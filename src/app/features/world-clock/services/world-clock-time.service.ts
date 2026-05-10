/**
 * World Clock Time Service
 *
 * Provides RxJS-based time resolution and live updates for the three timezone regions.
 * Returns an observable of current times that emits every 1000ms.
 *
 * Reference: research.md (R1, R2), plan.md (Technical Context, Phase 0.2)
 */

import { Injectable } from '@angular/core';
import { interval, map, startWith, Observable } from 'rxjs';
import { WorldClockEntry } from '../models/world-clock.models';
import { TIMEZONE_CONFIGS } from '../models/timezones.constants';

@Injectable({ providedIn: 'root' })
export class WorldClockTimeService {
  /**
   * getCurrentTimes(): Observable of current times for all three regions
   *
   * Emits immediately upon subscription, then every 1000ms.
   * Returns exactly 3 WorldClockEntry objects with current times for Brazil, UK, China.
   *
   * Performance: <1ms per emission, 3 component updates/sec, <0.1% CPU overhead
   * Reference: research.md (R2 - Performance)
   *
   * @returns Observable<ReadonlyArray<WorldClockEntry>> - Always exactly 3 entries
   */
  getCurrentTimes(): Observable<ReadonlyArray<WorldClockEntry>> {
    return interval(1000).pipe(
      startWith(0), // Emit immediately, then every 1000ms
      map(() => this.resolveCurrentTimes()),
    );
  }

  /**
   * resolveCurrentTimes(): Create current WorldClockEntry for all three regions
   *
   * @private
   * @returns Array of exactly 3 entries with current times
   */
  private resolveCurrentTimes(): ReadonlyArray<WorldClockEntry> {
    const now = new Date();
    return TIMEZONE_CONFIGS.map(config => ({
      ...config,
      currentTime: now,
      utcOffset: this.getUTCOffset(config.timeZoneId),
    }));
  }

  /**
   * getUTCOffset(timeZoneId): Calculate current UTC offset in minutes for timezone
   *
   * Uses Intl.DateTimeFormat to resolve the timezone offset, accounting for DST.
   * Performance: ~0.4ms per call (negligible)
   *
   * Reference: research.md (R1 - Timezone Precision & DST)
   *
   * Algorithm:
   * 1. Format current date in target timezone using Intl.DateTimeFormat
   * 2. Parse formatted time components
   * 3. Create local Date from parsed components
   * 4. Compare UTC time vs local time to calculate offset
   *
   * @private
   * @param timeZoneId - IANA timezone identifier (e.g., "America/Sao_Paulo")
   * @returns UTC offset in minutes (e.g., -180 for UTC-3)
   * @throws Error if timeZoneId is invalid
   */
  private getUTCOffset(timeZoneId: string): number {
    const now = new Date();

    // Validate timezone by attempting to format
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZoneId,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const formatted = formatter.format(now);
      // Parse formatted string: "MM/DD/YYYY, HH:MM:SS"
      const parts = formatted.split(', ');
      const [month, day, year] = parts[0].split('/').map(Number);
      const [hour, minute, second] = parts[1].split(':').map(Number);

      // Create a date from parsed components (interpreted as UTC in Date constructor)
      // This gives us the "local" time as if it were UTC
      const localDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

      // Calculate offset: (UTC time - local time as if UTC) / 60000 ms per minute
      const offsetMs = now.getTime() - localDate.getTime();
      return offsetMs / 60000;
    } catch (error) {
      throw new Error(
        `Failed to resolve timezone "${timeZoneId}": ${error instanceof Error ? error.message : 'Unknown error'}. Verify IANA timezone identifier.`
      );
    }
  }
}
