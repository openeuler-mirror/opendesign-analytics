import { EventContent, EventParams } from '../types';
import { OpenEventKeys } from './_keys';
import { onFCP, onTTFB } from 'web-vitals';

interface PerformanceData {
  $url: string;
  $fcp: number;
  $ttfb: number;
  $load: number;
  $navigationEntry?: PerformanceNavigationTiming;
  $connection: {
    downlink: Megabit; // 有效带宽估算（单位：Mbps/s）
    effectiveType: EffectiveConnectionType; // 连接的有效类型
    rtt: Millisecond; // 当前连接的往返时延评估
    type: ConnectionType;
  };
}
function getConnection() {
  const { connection } = window.navigator as NavigatorNetworkInformation;

  return {
    downlink: connection?.downlink || 0,
    effectiveType: connection?.effectiveType || 'unknown',
    rtt: connection?.rtt || 0,
    type: connection?.type || 'unknown',
  };
}
export default {
  event: OpenEventKeys.PageBasePerformance,
  collector: (onCollect: (data: EventContent, params: EventParams) => void) => {
    const data: PerformanceData = {
      $url: window.location.href,
      $fcp: -1,
      $ttfb: -1,
      $load: -1,
      $connection: getConnection(),
    };
    let doneFcp = false;
    let doneTtfb = false;
    let entry: PerformanceNavigationTiming;

    const doResolve = () => {
      if (doneFcp && doneTtfb) {
        onCollect(data, entry);
      }
    };

    onFCP((m) => {
      data.$fcp = m.value;
      doneFcp = true;
      doResolve();
    });
    onTTFB((m) => {
      doneTtfb = true;
      entry = m.entries[0] as PerformanceNavigationTiming;
      data.$ttfb = m.value;
      data.$navigationEntry = entry;
      data.$load = entry.domComplete - entry.startTime;
      doResolve();
    });
  },
};
