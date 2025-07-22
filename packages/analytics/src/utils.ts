import { v4 as uuidV4 } from 'uuid';
/**
 * 生成随机字符串
 */
export function uniqueId(): string {
  return uuidV4();
}
/**
 * 判断是否是函数
 */
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

// 是否是对象或者数组等（key:value 形式）
export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object';
}
/**
 * 判断是否是promise
 * @param val
 * @returns
 */
export const isPromise = <T>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
/**
 * 在文档准备完成
 * @param callback
 */
export function whenDocumentReady(callback: () => any): void {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', () => callback());
  }
}

/**
 * 在文档准备完成
 * @param callback
 */
export function whenWindowLoad(callback: () => any): void {
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => callback());
  } else {
    callback();
  }
}

/**
 * 是否是浏览器环境
 */
export const isClient = typeof window !== 'undefined';
