import { OpenAnalytics, OpenEventKeys } from '../src/index';
import { getClientInfo } from '../src/plugins';

const btn1 = document.querySelector('#btn1');
const btnOpen = document.querySelector('#btn-open');
const btnClose = document.querySelector('#btn-close');
const btnEnvDev = document.querySelector('#btn-env-dev');
const btnEnvProd = document.querySelector('#btn-env-prod');
const btnLogin = document.querySelector('#btn-login');
const btnLogout = document.querySelector('#btn-logout');

const oa = new OpenAnalytics({
  appKey: 'test',
  request: (data) => {
    // console.log(
    //   'request to send content',
    //   data.header,
    //   data.body.map((item) => item.event)
    // );
    console.log('request to send content',data)
    // return fetch('report', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    // }).then((response) => response.ok);
  },
  // immediate: true,
});
console.log(oa);
oa.setHeader(getClientInfo());

function enabledOA(enabled) {
  oa.enableReporting(enabled);
  localStorage.setItem('enabled', enabled ? '1' : '0');
}

enabledOA(localStorage.getItem('enabled') === '1');

oa.report(OpenEventKeys.PV, () => ({
  id: 'home',
}));
oa.report(OpenEventKeys.PageBasePerformance);
oa.report(OpenEventKeys.LCP);
oa.report(OpenEventKeys.INP);
oa.report(
  OpenEventKeys.PageClick,
  (e: MouseEvent) => {
    const scroller = document.querySelector('.inner-screen');
    const el = e.target as HTMLElement | null;
    return {
      documentScrollLeft: 123, // 覆盖默认值
      name: el?.innerHTML, // 新增字段
      top: scroller?.scrollTop, // 新增字段
    };
  },
  {
    eventOptions: {
      delay: 1000, // 指定点击防抖时间，不传默认800
    },
  }
);

btn1?.addEventListener('click', () => {
  // window.open('/');
  console.log('btn1 clicked');

  oa.report('btn-click', () => ({
    date: Date.now(),
  }));
});

btnOpen?.addEventListener('click', () => {
  enabledOA(true);
});
btnClose?.addEventListener('click', () => {
  enabledOA(false);
});
btnEnvDev?.addEventListener('click', () => {
  oa.setEnvironment('development');
});
btnEnvProd?.addEventListener('click', () => {
  oa.setEnvironment('prodution');
});

btnLogin?.addEventListener('click', () => {
  oa.setUserId('12332112312312');
});
btnLogout?.addEventListener('click', () => {
  oa.setUserId('');
});
