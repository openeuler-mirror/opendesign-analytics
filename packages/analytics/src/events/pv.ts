import { EventContent } from '../types';
import { OpenEventKeys } from './_keys';

export default {
  event: OpenEventKeys.PV,
  collector: (onCollect: (data: EventContent) => void) => {
    onCollect({
      $url: window.location.href,
      $path: window.location.pathname,
      $hash: window.location.hash,
      $search: window.location.search,
      $title: document.title,
      $referrer: document.referrer,
    });
  },
};
