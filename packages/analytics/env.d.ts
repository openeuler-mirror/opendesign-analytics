declare type Navigator = NavigatorNetworkInformation;
declare interface NavigatorNetworkInformation {
  readonly connection?: NetworkInformation;
}
type Megabit = number;
type Millisecond = number;
declare type EffectiveConnectionType = '2g' | '3g' | '4g' | 'slow-2g' | 'unknown';
declare type ConnectionType = 'bluetooth' | 'cellular' | 'ethernet' | 'mixed' | 'none' | 'other' | 'unknown' | 'wifi' | 'wimax';
declare interface NetworkInformation extends EventTarget {
  readonly type?: ConnectionType;
  readonly effectiveType?: EffectiveConnectionType;
  readonly downlinkMax?: Megabit;
  readonly downlink?: Megabit;
  readonly rtt?: Millisecond;
  readonly saveData?: boolean;
  onchange?: EventListener;
}
