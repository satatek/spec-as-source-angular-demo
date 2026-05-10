export interface ClockViewModel {
  timeText: string;
  timezoneText: string;
  isVisible: boolean;
  lastUpdatedAt: Date;
}

export interface ClockFormatConfig {
  locale: string;
  hourCycle: 'h23';
  timezoneSource: 'server' | 'browser';
  fallbackTimezone: 'UTC';
}
