import { Injectable } from '@angular/core';
import { map, shareReplay, timer } from 'rxjs';

import {
  CLOCK_FALLBACK_TIMEZONE,
  CLOCK_HOUR_CYCLE,
  CLOCK_LOCALE,
} from './header-clock.constants';
import { ClockViewModel } from './header-clock.models';

interface ServerTimezoneCarrier {
  __SATATEK_SERVER_TIMEZONE__?: unknown;
}

@Injectable({ providedIn: 'root' })
export class HeaderClockService {
  readonly clockViewModel$ = timer(0, 1000).pipe(
    map(() => this.getClockViewModel()),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  getClockViewModel(now: Date = new Date()): ClockViewModel {
    const resolvedTimeZone = this.resolvePreferredTimeZone();
    const formatter = new Intl.DateTimeFormat(CLOCK_LOCALE, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: CLOCK_HOUR_CYCLE,
      timeZone: resolvedTimeZone,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(now);
    const timeText = ['hour', 'minute', 'second']
      .map((partType) => parts.find((part) => part.type === partType)?.value ?? '00')
      .join(':');
    const timezoneText =
      parts.find((part) => part.type === 'timeZoneName')?.value?.trim() || CLOCK_FALLBACK_TIMEZONE;

    return {
      timeText,
      timezoneText,
      isVisible: true,
      lastUpdatedAt: now,
    };
  }

  private resolvePreferredTimeZone(): string {
    const serverTimeZone = this.resolveServerTimeZone();
    if (serverTimeZone !== null) {
      return serverTimeZone;
    }

    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (browserTimeZone && this.isValidTimeZone(browserTimeZone)) {
      return browserTimeZone;
    }

    return CLOCK_FALLBACK_TIMEZONE;
  }

  private resolveServerTimeZone(): string | null {
    const maybeServerTimeZone = (globalThis as ServerTimezoneCarrier).__SATATEK_SERVER_TIMEZONE__;
    if (typeof maybeServerTimeZone !== 'string') {
      return null;
    }

    const trimmed = maybeServerTimeZone.trim();
    if (!trimmed || !this.isValidTimeZone(trimmed)) {
      return null;
    }

    return trimmed;
  }

  private isValidTimeZone(timeZone: string): boolean {
    try {
      new Intl.DateTimeFormat(CLOCK_LOCALE, { timeZone }).format(new Date());
      return true;
    } catch {
      return false;
    }
  }
}
