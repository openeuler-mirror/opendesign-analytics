import { OpenEventKeys } from './_keys';
import { EventContent } from '../types';
import { onINP } from 'web-vitals';

export default {
  event: OpenEventKeys.INP,
  collector: (onCollect: (data: EventContent) => void) => {
    onINP((m) => {
      onCollect({
        $url: window.location.href,
        $inp: m.value,
      });
    });
  },
};
