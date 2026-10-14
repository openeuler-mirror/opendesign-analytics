import { Storage } from './storage';
import { whenDocumentReady, isFunction, isPromise, uniqueId, isClient } from './utils';
import { Constant } from './constant';
import { reportInnerEvent, isInnerEvent } from './events';
import packageJson from '../package.json';
import { EventContent, EventData, EventHeader, OpenAnalyticsParams, ReportRequest, ReportData, EventParams, Environment } from './types';

class AnalyticsStoreKey {
  appPrefix: string;
  client: string;
  session: string;
  events: string;
  constructor(appKey: string = '') {
    this.appPrefix = appKey ? `${appKey}-` : '';

    this.client = this.getKey('client');
    this.session = this.getKey('session');
    this.events = this.getKey('events');
  }
  getKey(key: string) {
    return `${Constant.OA_PREFIX}-${this.appPrefix}${key}`;
  }
}
type StoreKeyIns = InstanceType<typeof AnalyticsStoreKey>;
/**
 * 创建存储对象
 */
function createStorageTarget() {
  if (isClient) {
    return globalThis.localStorage;
  }
  const store: Record<string, string> = {};
  return {
    setItem(key: string, value: string) {
      store[key] = value;
    },
    getItem(key: string) {
      return store[key];
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
}

/**
 * 根据地址创建默认的上报请求
 */
function createRequestByUrl(url: string): ReportRequest {
  return (data: ReportData) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.ok)
      .catch(() => false);
  };
}

export class OpenAnalytics {
  #store: InstanceType<typeof Storage>;
  #timer: number | null;
  #firstReport: boolean;
  #request: ReportRequest;
  #beaconUrl: string;
  #eventData: EventData[];
  #immediate: boolean;
  #sessionId: number = 0;
  #appKey: string = '';
  #header: EventHeader;
  #StoreKey: StoreKeyIns;
  // 自定义上报策略
  #requestPlan?: (requestFn: () => void) => void;
  // 上报间隔，默认5s
  #requestInterval: number;
  #maxEvents: number;

  enabled: boolean;
  /**
   * 构造函数
   * @param params {OpenAnalyticsParams}
   */
  constructor(params: OpenAnalyticsParams) {
    this.#store = new Storage(createStorageTarget());
    const { request } = params;
    this.#request = isFunction(request) ? request : createRequestByUrl(request);
    // 关页冲刷地址：显式配置优先，未配置时默认取request字符串
    this.#beaconUrl = params.beaconUrl ?? (typeof request === 'string' ? request : '');
    this.#immediate = params.immediate ?? false;
    this.#appKey = params.appKey ?? '';
    this.#StoreKey = new AnalyticsStoreKey(params.appKey);
    this.#requestInterval = params.requestInterval ?? Constant.DEFAULT_REQUEST_INTERVAL;
    this.#timer = null;
    this.#maxEvents = params.maxEvents ?? Constant.MAX_EVENTS;

    this.#firstReport = true;

    // 存量队列迁移：仅读取一次，队列不再持久化写入，成功上报后清理key
    this.#eventData = this.#store.getAlways(this.#StoreKey.events, {
      defaultValue: () => [],
      save: false,
    }).value;

    this.#header = {
      env: params.env ?? 'production',
    };

    this.enabled = false;

    if (isClient) {
      this.#registerPageEndFlush();
    }
  }
  /**
   * 初始化通用数据
   * @param keys {string}
   * @param appId {string}
   */
  #initHeader(keys: StoreKeyIns, appId: string): EventHeader {
    const aKey = keys.client;
    const client = this.#store.getAlways(aKey, {
      defaultValue: () => ({
        id: uniqueId(),
        created_at: Date.now(),
      }),
      setOption: {
        expire: Date.now() + Constant.CLIENT_EXPIRE_TIME,
      },
      onValid: (value) => {
        // 兼容历史数据：无created_at时以当前时间补齐
        value.created_at = value.created_at ?? Date.now();
        this.#store.set(aKey, value, {
          expire: Date.now() + Constant.CLIENT_EXPIRE_TIME,
        });
      },
    }).value;

    return {
      uId: '',
      cId: client.id,
      first_visit_time: client.created_at,
      aId: appId,
      oa_version: packageJson.version,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      screen_width: window.screen.width || window.innerWidth,
      screen_height: window.screen.height || window.innerHeight,
    };
  }
  /**
   * 获取会话id（即会话开始时间戳），每次获取，延长有效期
   * @param sKey session key
   */
  #getSessionId(sKey: string) {
    const session = this.#store.get(sKey, {
      onValid: () => {
        this.#store.setExpire(sKey, Date.now() + Constant.SESSION_EXPIRE_TIME);
      },
    }).value;

    // 历史版本会话id为uuid（对象存储），视为过期，重新生成时间戳会话
    if (typeof session !== 'number') {
      const newSession = Date.now();
      this.#store.set(sKey, newSession, {
        expire: Date.now() + Constant.SESSION_EXPIRE_TIME,
      });
      return newSession;
    }

    return session;
  }
  /**
   * 搜集数据
   */
  #collect(data: EventData, immediate?: boolean) {
    this.#eventData.push(data);

    // 如果事件数超过最大数量，丢弃之前的事件
    if (this.#eventData.length > this.#maxEvents) {
      this.#eventData.shift();
    }
    if (this.enabled) {
      this.#runRequestPlan(immediate);
    }
  }

  /**
   * 执行上报策略
   * @param immediate
   */
  #runRequestPlan(immediate?: boolean) {
    if (immediate || this.#immediate) {
      this.#doSendEventData();
    } else if (this.#firstReport) {
      this.#firstReport = false;
      whenDocumentReady(() => this.#doSendEventData());
    } else {
      if (isFunction(this.#requestPlan)) {
        this.#requestPlan(this.#doSendEventData);
      } else {
        const run = () => {
          this.#timer = window.setTimeout(() => {
            this.#doSendEventData();
            run();
          }, this.#requestInterval);
        };
        if (!this.#timer) {
          run();
        }
      }
    }
  }
  /**
   * 发起数据上报
   */
  #doSendEventData() {
    if (!this.#request || !this.enabled || this.#eventData.length === 0) {
      return;
    }
    const reportData = {
      header: this.#header,
      body: this.#eventData,
    };
    const rlt = this.#request(reportData);
    if (isPromise(rlt)) {
      rlt.then((isSuccess) => {
        if (isSuccess) {
          this.#eventData = [];
          // 清理存量迁移的队列key，稳态下为空操作
          this.#store.remove(this.#StoreKey.events);
        }
      });
    } else {
      this.#eventData = [];
      this.#store.remove(this.#StoreKey.events);
    }
  }
  /**
   * 注册页面结束冲刷：页面隐藏或关闭时，将内存队列通过sendBeacon直发
   */
  #registerPageEndFlush() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.#doPageEndFlush();
      }
    });
    window.addEventListener('pagehide', () => {
      this.#doPageEndFlush();
    });
  }
  /**
   * 页面结束时冲刷数据
   */
  #doPageEndFlush() {
    if (!this.#beaconUrl || !this.enabled || this.#eventData.length === 0) {
      return;
    }
    const reportData = JSON.stringify({
      header: this.#header,
      body: this.#eventData,
    });
    // sendBeacon由浏览器保证在页面卸载后送达；入队失败时保留队列，等待定时上报重试
    if (navigator.sendBeacon(this.#beaconUrl, reportData)) {
      this.#eventData = [];
    }
  }
  /**
   * 设置header
   */
  setHeader(header: Record<string, string | number>) {
    Object.assign(this.#header, header);
  }
  /**
   * 设置运行环境
   */
  setEnvironment(env: Environment) {
    // 如果环境切换，需将之前环境数据上报，避免旧环境数据记录到新环境
    if (this.#header.env !== env) {
      this.#runRequestPlan(true);
    }
    Object.assign(this.#header, {
      env: env,
    });
  }
  /**
   * 设置user id
   */
  setUserId(userId: string) {
    Object.assign(this.#header, {
      uId: userId,
    });
  }
  /**
   * 控制是否发送数据上报
   * @param enabled
   */
  enableReporting(enabled: boolean = true) {
    if (this.enabled !== enabled) {
      this.enabled = enabled;
    }

    if (this.enabled) {
      this.#header = Object.assign(this.#initHeader(this.#StoreKey, this.#appKey), this.#header);
      // 初始化sessionId
      this.#sessionId = this.#getSessionId(this.#StoreKey.session);
      // 给内存中事件添加sessionId
      this.#eventData.forEach((event) => {
        if (event.sId === 0) {
          event.sId = this.#sessionId;
        }
      });
      // 执行上报策略
      this.#runRequestPlan();
    } else if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = 0;
      this.#eventData = [];
      this.#store.remove(this.#StoreKey.events);
      this.#store.remove(this.#StoreKey.client);
      this.#store.remove(this.#StoreKey.session);
    }
  }
  /**
   * 采集数据
   * @param event 事件名
   * @param data 事件数据，如果是内部事件，则会在内部事件触发时执行
   * @param options 配置
   */
  async report(
    event: string,
    content?: (...opts: any[]) => Promise<EventContent> | EventContent,
    options?: {
      immediate?: boolean;
      eventOptions?: any;
    }
  ) {
    if (!event) {
      return;
    }
    const sId = this.enabled ? this.#getSessionId(this.#StoreKey.session) : 0;

    if (!isInnerEvent(event)) {
      const cData = isFunction(content) ? await content() : {};
      // 非内部事件
      this.#collect(
        {
          sId,
          event,
          time: Date.now(),
          properties: cData,
        },
        options?.immediate
      );
      return;
    }

    // 上报内部事件
    reportInnerEvent(
      event,
      async (data: EventContent, params: EventParams) => {
        const cData = isFunction(content) ? await content(params) : {};

        this.#collect(
          {
            sId,
            event,
            time: Date.now(),
            properties: Object.assign(data, cData),
          },
          options?.immediate
        );
      },
      options?.eventOptions
    );
  }
}
