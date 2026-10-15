# opendesign-analytics

OpenDesign 前端数据采集方案：埋点 SDK 与演示站点，采集页面浏览（PV）、性能（FCP / TTFB / LCP / INP）、用户行为（点击热力图）等运营数据。

## 仓库结构

| 目录 | 说明 |
|---|---|
| packages/analytics | 埋点 SDK `@opensig/open-analytics`，框架无关，构建产物为单文件 ES 模块 |
| packages/demo | Vue 3 演示站点，dev server 内置模拟采集端点，报文直接打印在终端 |

- 版本记录：[CHANGELOG.md](./CHANGELOG.md)

## 安装

```bash
pnpm add @opensig/open-analytics
```

## 快速开始

```ts
import { OpenAnalytics, OpenEventKeys, getClientInfo } from '@opensig/open-analytics';

const oa = new OpenAnalytics({
  appKey: 'test',
  request: '/report', // 上报地址，关页冲刷默认发往同地址
  // beaconUrl: '/report',         // request 为函数时，用于关页冲刷
  // cookieDomain: '.example.com', // 跨子域共享访客标识
});

oa.setHeader(getClientInfo()); // 注入 os / browser / device 信息
oa.enableReporting();

// 性能数据
oa.report(OpenEventKeys.PageBasePerformance);
oa.report(OpenEventKeys.LCP);
oa.report(OpenEventKeys.INP);

// 路由切换时上报 PV（以 vue-router 为例）
router.afterEach((to, from) => {
  oa.report(OpenEventKeys.PV, () => ({
    prev_page: from.fullPath,
    url: to.fullPath,
  }));
});

// 业务自定义事件
oa.report('submit-order', () => ({ amount: 100 }));
```

需要自定义上报逻辑（鉴权、多端点切换）时，`request` 传入函数：

```ts
const oa = new OpenAnalytics({
  appKey: 'test',
  request: (data) => {
    return fetch('/report', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((response) => response.ok);
  },
  beaconUrl: '/report',
});
```

## 配置项

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| request | `string \| (data: ReportData) => Promise<boolean> \| void` | — | 上报地址，或自定义上报函数 |
| appKey | `string` | `''` | 应用标识，多应用共用域名时隔离标识存储与上报 |
| beaconUrl | `string` | 取 request 字符串 | 关页冲刷的 sendBeacon 直发地址 |
| cookieDomain | `string` | — | Cookie 的 Domain 属性，跨子域共享访客标识时配置 |
| env | `string` | `'production'` | 运行环境，随 header 上报 |
| immediate | `boolean` | `false` | 事件立即上报，不等待批量间隔 |
| requestInterval | `number` | `5000` | 批量上报间隔（毫秒） |
| maxEvents | `number` | `500` | 内存队列上限，超出丢弃最早事件 |
| requestPlan | `(requestFn: () => void) => void` | — | 自定义上报调度策略 |

## 实例方法

| 方法 | 说明 |
|---|---|
| `report(event, content?, options?)` | 采集事件。content 为返回事件数据的函数；内置事件按各自触发时机执行，业务事件立即执行 |
| `setHeader(header)` | 追加或覆盖 header 字段 |
| `setUserId(userId)` | 设置登录用户 id |
| `setEnvironment(env)` | 切换运行环境，切换前自动上报当前环境存量数据 |
| `enableReporting(enabled?)` | 开启 / 停止上报；停止时清除本地标识 |

## 内置事件

| 事件名 | `OpenEventKeys` 常量 | 触发时机 | 采集内容 |
|---|---|---|---|
| `$PageView` | `OpenEventKeys.PV` | report 调用处 | URL、path、hash、search、title、referrer |
| `$PageBasePerformance` | `OpenEventKeys.PageBasePerformance` | FCP 与 TTFB 均确定后 | FCP、TTFB、load 耗时、网络连接信息 |
| `$LCP` | `OpenEventKeys.LCP` | 最大内容绘制确定 | LCP 值 |
| `$INP` | `OpenEventKeys.INP` | 页面交互 | INP 值 |
| `$PageClick` | `OpenEventKeys.PageClick` | 页面点击（防抖 800ms） | 点击坐标与滚动偏移，可用于热力图 |

## 开发

```bash
pnpm install
pnpm dev:demo    # 演示站点（3200 端口），上报报文打印在 dev server 终端
pnpm dev         # SDK 调试页（3300 端口）
```
