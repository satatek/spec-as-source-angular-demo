/**
 * World Clock Entry Component (T014-T023)
 * 
 * Reusable clock display component for a single timezone region.
 * Displays region name, city, current time (digital or analog), and UTC offset.
 * Implements accessibility and responsive typography via Material tokens.
 */

import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { WorldClockEntry, ClockFormat } from './models/world-clock.models';

@Component({
  selector: 'app-world-clock-entry',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './world-clock-entry.component.html',
  styleUrl: './world-clock-entry.component.scss',
})
export class WorldClockEntryComponent {
  @Input() entry!: WorldClockEntry;
  @Input() format!: ClockFormat;

  /**
   * formattedTime: Computed signal returning formatted time string (HH:MM:SS)
   * Uses Intl.DateTimeFormat with entry's locale and timeZoneId
   */
  readonly formattedTime = computed(() => this.formatTime(this.entry.currentTime));

  /**
   * ariaLabel: Computed signal for accessibility
   * Screen reader announces: "Brazil: Brasília time 15:45:23"
   */
  readonly ariaLabel = computed(
    () => `${this.entry.region}: ${this.entry.city} time ${this.formattedTime()}`
  );

  /**
   * utcOffsetDisplay: Format UTC offset for display
   * Example: -180 minutes → "UTC-3"
   */
  readonly utcOffsetDisplay = computed(() => {
    const hours = this.entry.utcOffset / 60;
    const sign = hours >= 0 ? '+' : '';
    return `UTC${sign}${hours.toFixed(0)}`;
  });

  /**
   * formatTime: Format current time to HH:MM:SS using Intl API
   * Respects timezone and locale for accurate display
   */
  private formatTime(date: Date): string {
    try {
      const formatter = new Intl.DateTimeFormat(this.entry.locale, {
        timeZone: this.entry.timeZoneId,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      return formatter.format(date);
    } catch {
      return '--:--:--';
    }
  }
}
