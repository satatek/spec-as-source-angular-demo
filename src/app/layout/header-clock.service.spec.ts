import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CLOCK_FALLBACK_TIMEZONE } from './header-clock.constants';
import { HeaderClockService } from './header-clock.service';

describe('HeaderClockService', () => {
  let service: HeaderClockService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = new HeaderClockService();
    delete (globalThis as { __SATATEK_SERVER_TIMEZONE__?: unknown }).__SATATEK_SERVER_TIMEZONE__;
  });

  it('formats time as HH:mm:ss', () => {
    (globalThis as { __SATATEK_SERVER_TIMEZONE__?: unknown }).__SATATEK_SERVER_TIMEZONE__ = 'UTC';

    const viewModel = service.getClockViewModel(new Date('2026-05-09T15:04:05.000Z'));

    expect(viewModel.timeText).toBe('15:04:05');
  });

  it('uses UTC fallback when configured server timezone is invalid', () => {
    (globalThis as { __SATATEK_SERVER_TIMEZONE__?: unknown }).__SATATEK_SERVER_TIMEZONE__ = 'Mars/Base';

    const viewModel = service.getClockViewModel(new Date('2026-05-09T15:04:05.000Z'));

    expect(viewModel.timezoneText.length).toBeGreaterThan(0);
    expect(viewModel.timezoneText).not.toBe('Mars/Base');
  });

  it('prefers server timezone when available', () => {
    (globalThis as { __SATATEK_SERVER_TIMEZONE__?: unknown }).__SATATEK_SERVER_TIMEZONE__ = 'UTC';

    const viewModel = service.getClockViewModel(new Date('2026-05-09T15:04:05.000Z'));

    expect(viewModel.timezoneText).toContain('UTC');
  });

  it('emits immediately and then every second', () => {
    const emissions: Array<{ timeText: string; timezoneText: string }> = [];
    const subscription = service.clockViewModel$.subscribe((value) => {
      emissions.push({
        timeText: value.timeText,
        timezoneText: value.timezoneText,
      });
    });

    vi.advanceTimersByTime(0);
    vi.advanceTimersByTime(1000);

    expect(emissions.length).toBeGreaterThanOrEqual(2);
    expect(emissions[0]?.timeText).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(emissions[1]?.timeText).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(emissions[1]?.timezoneText || CLOCK_FALLBACK_TIMEZONE).toBeTruthy();

    subscription.unsubscribe();
  });
});
