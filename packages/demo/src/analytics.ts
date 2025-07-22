import { OpenAnalytics, OpenEventKeys, getClientInfo } from '@opensig/open-analytics';

const oa = new OpenAnalytics({
  appKey: 'test',
  request: (data) => {
    console.log('request to send content', data);
    // return fetch('report', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    // }).then((response) => response.ok);
  },
});
oa.setHeader(getClientInfo());
oa.enableReporting();
oa.report(OpenEventKeys.PageBasePerformance);
oa.report(OpenEventKeys.LCP);
oa.report(OpenEventKeys.INP);
export { oa, OpenEventKeys };
