import { EventContent } from '../types';
import { OpenEventKeys } from './_keys';

function handleClick(e: MouseEvent) {
  const { pageX, pageY } = e;
  const { scrollLeft, scrollTop } = document.scrollingElement || document.documentElement;

  return {
    $url: window.location.href,
    $pageX: pageX,
    $pageY: pageY,
    $documentScrollLeft: scrollLeft,
    $documentScrollTop: scrollTop,
  };
}

export default {
  event: OpenEventKeys.PageClick,
  collector: (onCollect: (data: EventContent, e: MouseEvent) => void, options?: { delay: Millisecond }) => {
    const { delay = 800 } = options || {};
    let debounceId = 0;
    window.addEventListener(
      'click',
      (e) => {
        clearTimeout(debounceId);
        debounceId = globalThis.setTimeout(async () => {
          const data = handleClick(e);

          onCollect?.(data, e);
        }, delay);
      },
      {
        capture: true,
      }
    );
  },
};
