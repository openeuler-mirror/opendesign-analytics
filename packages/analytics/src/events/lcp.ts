import { OpenEventKeys } from './_keys';
import { EventContent } from '../types';
import { onLCP } from 'web-vitals';

export default {
  event: OpenEventKeys.LCP,
  collector: (onCollect: (data: EventContent) => void) => {
    onLCP((m) => {
      onCollect({
        $url: window.location.href,
        $lcp: m.value,
      });
    });
  },
};
