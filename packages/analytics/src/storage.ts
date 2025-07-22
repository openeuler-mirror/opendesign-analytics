import { isFunction } from './utils';

interface StorageSetOptions {
  expire?: number;
  once?: boolean;
}

interface StorageOptions {
  checkExpiration?: (time: number) => boolean;
}

export interface StorageTarget {
  setItem: (key: string, value: any) => void;
  removeItem: (key: string) => void;
  getItem: (key: string) => string | null;
}

export class Storage {
  store: StorageTarget;
  checkExpiration: (expire: number) => boolean;
  constructor(target: StorageTarget, options?: StorageOptions) {
    this.store = target;
    this.checkExpiration = isFunction(options?.checkExpiration)
      ? options?.checkExpiration
      : (time: number) => {
          return Date.now() > time;
        };
  }
  set(key: string, value: any, options?: StorageSetOptions) {
    const { once, expire } = options || {};

    const data = {
      expire,
      value,
      once,
    };

    this.store.setItem(key, JSON.stringify(data));
  }
  remove(key: string) {
    this.store.removeItem(key);
  }
  setExpire(key: string, expire: number) {
    const { value } = this.get(key);
    this.set(key, value, {
      expire,
    });
  }
  get(
    key: string,
    {
      checkExpiration,
      onValid,
    }: {
      checkExpiration?: (expire: number) => boolean;
      onValid?: (value: any, expire: number) => void;
    } = {}
  ) {
    const dataStr = this.store.getItem(key);
    if (!dataStr) {
      return {
        value: undefined,
      };
    }
    try {
      const { once, expire, value } = JSON.parse(dataStr);
      const check = isFunction(checkExpiration) ? checkExpiration : this.checkExpiration;
      if (check(expire)) {
        return {
          value: undefined,
        };
      }
      if (once) {
        this.remove(key);
      }
      if (isFunction(onValid)) {
        onValid(value, expire);
      }

      return { expire, value };
    } catch {
      return {
        value: undefined,
      };
    }
  }
  getAlways(
    key: string,
    {
      defaultValue,
      setOption,
      onValid,
      checkExpiration,
      save = true,
    }: {
      defaultValue: () => any;
      setOption?: StorageSetOptions;
      onValid?: (value: any, expire: number) => void;
      checkExpiration?: (expire: number) => boolean;
      save?: boolean; // 是否保存默认值
    }
  ) {
    let { value } = this.get(key, { checkExpiration, onValid });
    if (value === undefined) {
      value = defaultValue();
      if (save) {
        this.set(key, value, setOption);
      }
    }
    return {
      value,
      expire: setOption?.expire,
    };
  }
}
