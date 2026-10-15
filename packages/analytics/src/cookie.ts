import { isClient } from './utils';

interface CookieSetOptions {
  maxAge?: number; // 有效期，毫秒
  domain?: string; // Domain属性，跨子域场景配置
}

/**
 * 写入cookie，https环境自动附加Secure
 */
export function setCookie(name: string, value: string, options: CookieSetOptions = {}) {
  if (!isClient) {
    return;
  }
  const { maxAge, domain } = options;
  let cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax`;
  if (maxAge !== undefined) {
    cookie += `; Max-Age=${Math.floor(maxAge / 1000)}`;
  }
  if (domain) {
    cookie += `; Domain=${domain}`;
  }
  if (location.protocol === 'https:') {
    cookie += '; Secure';
  }
  document.cookie = cookie;
}

/**
 * 读取cookie
 */
export function getCookie(name: string): string | undefined {
  if (!isClient) {
    return undefined;
  }
  const matched = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return matched ? decodeURIComponent(matched[1]) : undefined;
}

/**
 * 删除cookie
 */
export function removeCookie(name: string, domain?: string) {
  if (!isClient) {
    return;
  }
  let cookie = `${name}=; Path=/; Max-Age=0`;
  if (domain) {
    cookie += `; Domain=${domain}`;
  }
  document.cookie = cookie;
}
