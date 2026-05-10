/**
 * World Clock Entry Component (T014-T023)
 * 
 * Reusable clock display component for a single timezone region.
 * Displays region name, city, current time (digital or analog), and UTC offset.
 * Implements accessibility and responsive typography via Material tokens.
 */

import { Component, Input } from '@angular/core';
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
  @Input() use24Hour = true;
  @Input() showDialMarks = true;

  /**
   * formattedTime: Computed signal returning formatted time string (HH:MM:SS)
   * Uses Intl.DateTimeFormat with entry's locale and timeZoneId
   */
  formattedTime(): string {
    return this.formatTime(this.entry.currentTime);
  }

  /**
   * ariaLabel: Computed signal for accessibility
   * Screen reader announces: "Brazil: Brasília time 15:45:23"
   */
  ariaLabel(): string {
    return `${this.entry.region}: ${this.entry.city} time ${this.formattedTime()}`;
  }

  /**
   * utcOffsetDisplay: Format UTC offset for display
   * Example: -180 minutes → "UTC-3"
   */
  utcOffsetDisplay(): string {
    const hours = this.entry.utcOffset / 60;
    const sign = hours >= 0 ? '+' : '';
    return `UTC${sign}${hours.toFixed(0)}`;
  }

  hourHandRotation(): number {
    const { hours, minutes } = this.extractTimeParts(this.entry.currentTime);
    const normalizedHours = hours % 12;
    return normalizedHours * 30 + minutes * 0.5;
  }

  minuteHandRotation(): number {
    const { minutes, seconds } = this.extractTimeParts(this.entry.currentTime);
    return minutes * 6 + seconds * 0.1;
  }

  secondHandRotation(): number {
    const { seconds } = this.extractTimeParts(this.entry.currentTime);
    return seconds * 6;
  }

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
        hour12: !this.use24Hour,
      });
      return formatter.format(date);
    } catch {
      return '--:--:--';
    }
  }

  private extractTimeParts(date: Date): { hours: number; minutes: number; seconds: number } {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: this.entry.timeZoneId,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const getPart = (type: 'hour' | 'minute' | 'second'): number => {
      const value = parts.find((part) => part.type === type)?.value ?? '0';
      return Number(value);
    };

    return {
      hours: getPart('hour'),
      minutes: getPart('minute'),
      seconds: getPart('second'),
    };
  }
}
