import { UAParser } from 'ua-parser-js';

/**
 * 根据userAgent信息获取系统及浏览器信息
 */
function getClientByUA(userAgent: string = window.navigator.userAgent) {
  const { browser, os, device } = UAParser(userAgent);
  return { browser, os, device };
}
/**
 * 获取客户端信息：browser, os, device
 * @returns
 */
export function getClientInfo() {
  const { browser, os, device } = getClientByUA();
  return {
    os: os.name ?? '',
    os_version: os.version ?? '',
    browser: browser.name ?? '',
    browser_version: browser.version ?? '',
    device: device.model ?? '',
    device_type: device.type ?? '',
    device_vendor: device.vendor ?? '',
  };
}
