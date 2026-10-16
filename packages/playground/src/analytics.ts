import { OpenAnalytics, OpenEventKeys, getClientInfo } from '@opensig/open-analytics';

const oa = new OpenAnalytics({
  appKey: 'test',
  // 传入上报地址字符串：SDK内部自动fetch上报，关页冲刷自动通过sendBeacon发送至同地址
  request: '/report',
  // 需要自定义上报逻辑（如鉴权、切换端点）时，可传入函数：
  // request: (data) => {
  //   console.log('request to send content', data);
  //   return fetch('/report', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //   }).then((response) => response.ok);
  // },
  // request为函数时，如需关页冲刷，可显式配置beaconUrl（默认取request字符串）：
  // beaconUrl: '/report',
  // 跨子域共享访客标识时配置：
  // cookieDomain: '.example.com',
});
oa.setHeader(getClientInfo());
oa.enableReporting();
oa.report(OpenEventKeys.PageBasePerformance);
oa.report(OpenEventKeys.LCP);
oa.report(OpenEventKeys.INP);
export { oa, OpenEventKeys };
