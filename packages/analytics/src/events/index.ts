import { EventContent, EventParams } from '../types';

type CollectorOptions = any;
type EventCollector = (onCollect: (data: EventContent, params: EventParams) => void, options?: CollectorOptions) => void;

interface Event {
  event: string;
  collector: EventCollector;
}

const modules: Record<string, Record<string, Event>> = import.meta.glob(['./*.ts', '!./keys.ts'], {
  eager: true,
});

const Events = new Map<string, Event>();

for (const path in modules) {
  const m = modules[path].default;
  if (m) {
    Events.set(m.event, m);
  }
}

export function isInnerEvent(event: string) {
  return Events.has(event);
}

export async function reportInnerEvent(event: string, onCollect: (data: EventContent, params: EventParams) => void, options?: CollectorOptions) {
  const eventObject = Events.get(event);

  eventObject?.collector(onCollect, options);
}
