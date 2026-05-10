/**
 * World Clock Page Component (T024-T040)
 * 
 * Main page component for displaying world clock across three timezones.
 * Uses signals for reactive state management and RxJS for live time updates.
 * Implements responsive layout with Material CDK breakpoint observer.
 */

import { Component, effect, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

import { WorldClockTimeService } from './services/world-clock-time.service';
import { WorldClockEntryComponent } from './world-clock-entry.component';
import { WorldClockPageState, ClockFormat } from './models/world-clock.models';

@Component({
  selector: 'app-world-clock-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    WorldClockEntryComponent,
  ],
  templateUrl: './world-clock-page.component.html',
  styleUrl: './world-clock-page.component.scss',
})
export class WorldClockPageComponent {
  private readonly timeService = inject(WorldClockTimeService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  /**
   * Page state signal: entries, format, loading, error, lastUpdated
   * Initialized with loading state while fetching first entries
   */
  readonly pageState = signal<WorldClockPageState>({
    entries: [],
    currentFormat: 'digital',
    isLoading: true,
    error: null,
    lastUpdated: new Date(),
  });

  /**
   * Format toggle signal: 'digital' | 'analog'
   * (T042-T043 US2 feature - format toggle)
   */
  readonly currentFormat = signal<ClockFormat>('digital');
  readonly use24Hour = signal(true);

  /**
   * Responsive layout signal
   * isMobile: true if viewport < 960px (Breakpoints.Tablet)
   * isSmall: true if viewport < 600px (Breakpoints.Small)
   */
  readonly isSmallScreen = toSignal(
    this.breakpointObserver.observe(Breakpoints.Small),
    { initialValue: { matches: false, breakpoints: {} } }
  );
  
  readonly isMobileScreen = toSignal(
    this.breakpointObserver.observe(Breakpoints.Tablet),
    { initialValue: { matches: false, breakpoints: {} } }
  );

  /**
   * Grid template for responsive layout
   * Small screens: 1 column
   * Medium screens: 2 columns  
   * Large screens: 3 columns
   */
  readonly gridColumns = computed(() => {
    if (this.isSmallScreen().matches) return '1';
    if (this.isMobileScreen().matches) return '2';
    return '3';
  });

  /**
   * Effect: Subscribe to time service and update page state
   * Runs whenever format changes (triggers new subscriptions)
   */
  private updateStateEffect = effect(() => {
    const format = this.currentFormat();
    
    const subscription = this.timeService.getCurrentTimes().subscribe({
      next: (entries) => {
        this.pageState.set({
          entries,
          currentFormat: format,
          isLoading: false,
          error: null,
          lastUpdated: new Date(),
        });
      },
      error: (err: Error) => {
        console.error('Error fetching times:', err);
        this.pageState.set({
          ...this.pageState(),
          isLoading: false,
          error: err.message || 'Failed to fetch time data',
        });
      },
    });

    return () => subscription.unsubscribe();
  });

  /**
   * toggleFormat: Switch between digital and analog clock displays
   * (T042-T043 US2 feature)
   */
  toggleFormat(): void {
    this.currentFormat.set(this.currentFormat() === 'digital' ? 'analog' : 'digital');
  }

  toggleHourFormat(): void {
    this.use24Hour.update((value) => !value);
  }

  /**
   * Accessibility: descriptive title for page
   */
  readonly pageTitle = 'World Clock';
  readonly pageDescription = 'Display of current time across Brazil, United Kingdom, and China';
}
