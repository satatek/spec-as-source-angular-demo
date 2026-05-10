# Quickstart: World Clock Page Implementation

## Overview

The World Clock page is an Angular 21 standalone component that displays current times for Brazil (Brasília), UK (London), and China (Shanghai) with live updates and format toggle (digital/analog). This quickstart guides the implementation from specification to working feature.

## Prerequisites

- Angular 21 with standalone components
- TypeScript 5.x
- RxJS 7.x
- Angular Material 21
- Angular CDK 21
- Vitest for testing
- Playwright for e2e

All prerequisites are already installed in the project.

## Implementation Phases

### Phase 1: Models & Contracts (30 minutes)

**Goal**: Define TypeScript interfaces and constants for type safety.

**Files to Create**:

1. **`src/app/features/world-clock/models/world-clock.models.ts`**
   ```typescript
   export type ClockFormat = 'digital' | 'analog';
   
   export interface WorldClockEntry {
     readonly id: string;
     readonly region: string;
     readonly city: string;
     readonly timeZoneId: string;
     readonly locale: string;
     readonly currentTime: Date;
     readonly utcOffset: number;
   }
   
   export interface WorldClockPageState {
     readonly entries: ReadonlyArray<WorldClockEntry>;
     readonly currentFormat: ClockFormat;
     readonly isLoading: boolean;
     readonly error: string | null;
     readonly lastUpdated: Date;
   }
   ```

2. **`src/app/features/world-clock/models/timezones.constants.ts`**
   ```typescript
   import { TimeZoneConfig } from './world-clock.models';
   
   export const TIMEZONE_CONFIGS: ReadonlyArray<TimeZoneConfig> = [
     {
       id: 'brazil',
       region: 'Brazil',
       city: 'Brasília',
       timeZoneId: 'America/Sao_Paulo',
       locale: 'pt-BR',
     },
     {
       id: 'uk',
       region: 'United Kingdom',
       city: 'London',
       timeZoneId: 'Europe/London',
       locale: 'en-GB',
     },
     {
       id: 'china',
       region: 'China',
       city: 'Shanghai',
       timeZoneId: 'Asia/Shanghai',
       locale: 'zh-CN',
     },
   ];
   ```

**Checklist**:
- ✅ All fields have `readonly` modifier
- ✅ No `any` types
- ✅ Enums used for `ClockFormat` (consider string literal alternative)
- ✅ Validation rules documented in data-model.md

---

### Phase 2: Time Service (45 minutes)

**Goal**: Implement RxJS-based time resolution and formatting service.

**File**: `src/app/features/world-clock/services/world-clock-time.service.ts`

**Key Methods**:

```typescript
import { Injectable } from '@angular/core';
import { interval, map, startWith, Observable } from 'rxjs';
import { WorldClockEntry, WorldClockPageState, ClockFormat } from '../models/world-clock.models';
import { TIMEZONE_CONFIGS } from '../models/timezones.constants';

@Injectable({ providedIn: 'root' })
export class WorldClockTimeService {
  /**
   * Returns an observable of current times for all three regions.
   * Emits immediately and then every 1000ms.
   */
  getCurrentTimes(): Observable<ReadonlyArray<WorldClockEntry>> {
    return interval(1000).pipe(
      startWith(0),
      map(() => this.resolveCurrentTimes()),
    );
  }

  private resolveCurrentTimes(): ReadonlyArray<WorldClockEntry> {
    return TIMEZONE_CONFIGS.map(config => ({
      ...config,
      currentTime: new Date(),
      utcOffset: this.getUTCOffset(config.timeZoneId),
    }));
  }

  private getUTCOffset(timeZoneId: string): number {
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

    const now = new Date();
    const tzTime = new Date(formatter.format(now));
    return (now.getTime() - tzTime.getTime()) / 60000;
  }
}
```

**Unit Tests** (`world-clock-time.service.spec.ts`):
- ✅ `getCurrentTimes()` returns exactly 3 entries
- ✅ Each entry has valid `WorldClockEntry` fields
- ✅ Times update every 1000ms (use fakeAsync/tick)
- ✅ UTC offsets are correct for each timezone

**Checklist**:
- ✅ Service uses `interval()` from RxJS (matches feature-007 pattern)
- ✅ All timezone IDs are valid IANA identifiers
- ✅ No hardcoded dates (always use `new Date()`)
- ✅ Error handling for invalid timezone (throw Error with diagnostic)

---

### Phase 3: Display Components (60 minutes)

**Goal**: Build standalone components for page layout and clock rendering.

#### 3a. World Clock Entry Component (Reusable)

**File**: `src/app/features/world-clock/world-clock-entry.component.ts`

```typescript
import { Component, Input, computed, signal } from '@angular/core';
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

  readonly formattedTime = computed(() => this.formatTime(this.entry.currentTime));
  readonly ariaLabel = computed(() => 
    `${this.entry.region}: ${this.entry.city} time ${this.formattedTime()}`
  );

  private formatTime(date: Date): string {
    const formatter = new Intl.DateTimeFormat(this.entry.locale, {
      timeZone: this.entry.timeZoneId,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    return formatter.format(date);
  }
}
```

**Template** (`world-clock-entry.component.html`):
```html
<mat-card role="region" [attr.aria-label]="ariaLabel()">
  <mat-card-header>
    <h3 class="region-name">{{ entry.region }}</h3>
    <p class="city-name">{{ entry.city }}</p>
  </mat-card-header>
  <mat-card-content>
    <div *ngIf="format === 'digital'" class="digital-clock" aria-live="polite">
      {{ formattedTime() }}
    </div>
    <div *ngIf="format === 'analog'" class="analog-clock">
      <!-- SVG or Canvas analog clock implementation -->
    </div>
    <p class="utc-offset">UTC{{ entry.utcOffset > 0 ? '+' : '' }}{{ entry.utcOffset / 60 | number: '1.0-0' }}</p>
  </mat-card-content>
</mat-card>
```

**Stylesheet** (`world-clock-entry.component.scss`):
```scss
mat-card {
  background-color: var(--mat-sys-surface-container-low);
  color: var(--mat-sys-on-surface);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  mat-card-header {
    padding: clamp(1rem, 4%, 2rem);
  }

  .region-name {
    font: var(--mat-sys-title-medium);
    margin: 0 0 0.25rem 0;
  }

  .city-name {
    font: var(--mat-sys-body-medium);
    color: var(--mat-sys-on-surface-variant);
    margin: 0;
  }

  mat-card-content {
    padding: clamp(1rem, 4%, 2rem);
  }

  .digital-clock {
    font-family: 'Roboto Mono', monospace;
    font-size: clamp(2rem, 10vw, 3.5rem);
    font-weight: 500;
    text-align: center;
    margin: 1rem 0;
    letter-spacing: 0.1em;
  }

  .analog-clock {
    width: clamp(200px, 80vw, 300px);
    height: clamp(200px, 80vw, 300px);
    margin: 0 auto;
  }

  .utc-offset {
    font: var(--mat-sys-label-small);
    color: var(--mat-sys-on-surface-variant);
    text-align: center;
    margin: 0.5rem 0 0 0;
  }
}
```

**Component Tests**:
- ✅ Renders region name, city, formatted time
- ✅ Digital format shows HH:MM:SS
- ✅ Analog format renders (check SVG presence)
- ✅ Seconds value changes every 1000ms (fakeAsync)
- ✅ Correct UTC offset displayed
- ✅ ARIA labels present and descriptive

#### 3b. World Clock Page Component (Main)

**File**: `src/app/features/world-clock/world-clock-page.component.ts`

```typescript
import { Component, OnInit, signal, computed, effect, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAlertModule } from '@angular/material-experimental/mdc-alert';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { WorldClockTimeService } from './services/world-clock-time.service';
import { WorldClockPageState, ClockFormat } from './models/world-clock.models';
import { WorldClockEntryComponent } from './world-clock-entry.component';

@Component({
  selector: 'app-world-clock-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatAlertModule,
    WorldClockEntryComponent,
  ],
  templateUrl: './world-clock-page.component.html',
  styleUrl: './world-clock-page.component.scss',
})
export class WorldClockPageComponent implements OnInit, OnDestroy {
  private readonly timeService = inject(WorldClockTimeService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly state = signal<WorldClockPageState>({
    entries: [],
    currentFormat: 'digital',
    isLoading: true,
    error: null,
    lastUpdated: new Date(),
  });

  readonly isSmallScreen = toSignal(
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]),
    { initialValue: false as any },
  ).pipe(computed(v => (v as any)?.matches ?? false));

  readonly cardGridClass = computed(() => {
    const isSmall = this.isSmallScreen() as unknown as boolean;
    return isSmall ? 'grid-cols-1' : 'grid-cols-3';
  });

  ngOnInit() {
    effect(() => {
      this.timeService.getCurrentTimes().subscribe(entries => {
        this.state.update(current => ({
          ...current,
          entries,
          isLoading: false,
          lastUpdated: new Date(),
        }));
      });
    }, { allowSignalWrites: true });
  }

  toggleFormat() {
    this.state.update(current => ({
      ...current,
      currentFormat: current.currentFormat === 'digital' ? 'analog' : 'digital',
      lastUpdated: new Date(),
    }));
  }

  dismissError() {
    this.state.update(current => ({
      ...current,
      error: null,
    }));
  }

  ngOnDestroy() {
    // Subscriptions cleaned up automatically via toSignal + effect
  }
}
```

**Template** (`world-clock-page.component.html`):
```html
<div class="world-clock-page">
  <header class="page-header">
    <h1>World Clock</h1>
    <p class="subtitle">Current time in three major regions</p>
    <button
      mat-icon-button
      (click)="toggleFormat()"
      [disabled]="state().isLoading"
      aria-label="Toggle between digital and analog clock formats"
      matTooltip="Switch Format"
    >
      <mat-icon>refresh</mat-icon>
    </button>
  </header>

  <mat-spinner *ngIf="state().isLoading" diameter="48"></mat-spinner>

  <mat-alert *ngIf="state().error" type="error" closable (closed)="dismissError()">
    {{ state().error }}
  </mat-alert>

  <div class="clock-grid" [ngClass]="cardGridClass()">
    <app-world-clock-entry
      *ngFor="let entry of state().entries"
      [entry]="entry"
      [format]="state().currentFormat"
    ></app-world-clock-entry>
  </div>
</div>
```

**Stylesheet** (`world-clock-page.component.scss`):
```scss
.world-clock-page {
  padding: clamp(1rem, 5%, 3rem);
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(1rem, 3%, 2rem);

  h1 {
    font: var(--mat-sys-title-large);
    color: var(--mat-sys-on-surface);
    margin: 0;
  }

  .subtitle {
    font: var(--mat-sys-body-medium);
    color: var(--mat-sys-on-surface-variant);
    margin: 0.25rem 0 0 0;
  }

  button {
    &:disabled {
      opacity: 0.5;
    }
  }
}

.clock-grid {
  display: grid;
  gap: clamp(0.5rem, 3%, 2rem);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

  &.grid-cols-1 {
    grid-template-columns: 1fr;
  }

  &.grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

mat-spinner {
  margin: 2rem auto;
}

mat-alert {
  margin-bottom: 1rem;
}
```

**Page Component Tests**:
- ✅ Initial state has isLoading=true
- ✅ After timeService emits, isLoading becomes false
- ✅ All three clock entries rendered
- ✅ toggleFormat() switches between digital and analog
- ✅ Format button disabled while loading
- ✅ Error message displayed and dismissible
- ✅ Responsive grid layout changes on breakpoint
- ✅ aria-labels on header and button

---

### Phase 4: Route Integration (15 minutes)

**Goal**: Add world-clock route to app.routes.ts and update menu configuration.

**File**: `src/app/app.routes.ts`

```typescript
export const routes: Routes = [
  // ... existing routes ...
  {
    path: 'world-clock',
    component: WorldClockPageComponent,
    data: { title: 'World Clock', icon: 'schedule' },
  },
  // ... other routes ...
];
```

**Menu Configuration**: `public/config/sidebar-menu.json`

Add entry (if menu is configured to load from this file):
```json
{
  "id": "world-clock",
  "label": "World Clock",
  "icon": "schedule",
  "route": "world-clock",
  "requiresAuth": false,
  "visibleWhenAuthenticated": null
}
```

**Checklist**:
- ✅ Route path is `/world-clock`
- ✅ Component is WorldClockPageComponent standalone
- ✅ Menu item is public (requiresAuth: false)
- ✅ Menu item appears in navigation

---

### Phase 5: Testing (45 minutes)

#### Unit Tests

**Component Tests** (`world-clock-page.component.spec.ts`):
```typescript
describe('WorldClockPageComponent', () => {
  it('renders three clock entries', () => {
    // Arrange + Act + Assert
  });

  it('toggles format from digital to analog', () => {
    // Test currentFormat signal update
  });

  it('displays error state when service fails', () => {
    // Mock service to throw error
  });

  it('responsive grid changes layout on breakpoint', () => {
    // Use BreakpointObserver mock to trigger breakpoint change
  });

  it('ARIA labels present on page', () => {
    // Verify role="region", aria-label, aria-live attributes
  });
});
```

**Service Tests** (`world-clock-time.service.spec.ts`):
```typescript
describe('WorldClockTimeService', () => {
  it('emits three clock entries on getCurrentTimes()', () => {
    // Assert entries.length === 3
  });

  it('updates times every 1000ms', () => {
    // fakeAsync, tick(1000), verify time incremented
  });

  it('returns valid WorldClockEntry structure', () => {
    // Verify all fields present and typed correctly
  });

  it('computes correct UTC offsets', () => {
    // Known timezone offsets for test times
  });
});
```

#### e2e Tests

**File**: `e2e/world-clock.spec.ts`

```typescript
test.describe('World Clock Page', () => {
  test('navigates to world clock via menu and displays three clocks', async ({ page }) => {
    await page.goto('/');
    // Click World Clock menu item
    await page.click('[data-testid="menu-world-clock"]');
    // Assert URL is /world-clock
    // Assert three clock cards visible
    // Assert times are readable
  });

  test('times update every second', async ({ page }) => {
    await page.goto('/world-clock');
    const initialTime = await page.textContent('[data-testid="clock-brazil"] .time');
    await page.waitForTimeout(1100);
    const updatedTime = await page.textContent('[data-testid="clock-brazil"] .time');
    // Assert times are different
  });

  test('format toggle switches between digital and analog', async ({ page }) => {
    await page.goto('/world-clock');
    // Assert digital clocks visible
    await page.click('button[aria-label*="Toggle"]');
    // Assert analog clocks visible (SVG present)
  });

  test('responsive layout stacks on mobile', async ({ page }) => {
    // Set mobile viewport (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/world-clock');
    // Assert clocks stack vertically
  });

  test('is keyboard navigable', async ({ page }) => {
    await page.goto('/world-clock');
    await page.keyboard.press('Tab');
    // Assert format button focused
    await page.keyboard.press('Space');
    // Assert format toggled
  });
});
```

**Checklist**:
- ✅ All critical paths covered (render, update, toggle, error, responsive)
- ✅ Accessibility tested (ARIA, keyboard, color contrast)
- ✅ e2e tests verify menu integration and live updates
- ✅ No hardcoded timeouts (use waitForCondition or specific triggers)

---

### Phase 6: Analog Clock Implementation (Optional Polish)

**Goal**: If timeline allows, implement SVG analog clock with animated second hand.

**Approach**:
```typescript
// In world-clock-entry.component.ts
readonly analogClockSvg = computed(() => this.renderAnalogClock(this.entry.currentTime));

private renderAnalogClock(date: Date): string {
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const secondDeg = seconds * 6;

  return `
    <svg viewBox="0 0 200 200" class="analog-clock-svg">
      <circle cx="100" cy="100" r="95" stroke="var(--mat-sys-outline-variant)" stroke-width="2" fill="var(--mat-sys-surface)"/>
      <!-- Hour marks -->
      <!-- Hour hand -->
      <line x1="100" y1="100" x2="100" y2="50" transform="rotate(${hourDeg} 100 100)" stroke="var(--mat-sys-on-surface)" stroke-width="4" stroke-linecap="round"/>
      <!-- Minute hand -->
      <line x1="100" y1="100" x2="100" y2="30" transform="rotate(${minuteDeg} 100 100)" stroke="var(--mat-sys-on-surface)" stroke-width="3" stroke-linecap="round"/>
      <!-- Second hand -->
      <line x1="100" y1="100" x2="100" y2="20" transform="rotate(${secondDeg} 100 100)" stroke="var(--mat-sys-primary)" stroke-width="1" stroke-linecap="round"/>
      <!-- Center dot -->
      <circle cx="100" cy="100" r="5" fill="var(--mat-sys-on-surface)"/>
    </svg>
  `;
}
```

---

## Testing Checklist

- ✅ `npm run test -- --include "**/world-clock**"` — All tests pass
- ✅ `npm run build` — Build succeeds, no console errors
- ✅ `npm run e2e` — e2e tests pass
- ✅ Manual: Menu item visible and clickable
- ✅ Manual: Times update live every second
- ✅ Manual: Format toggle works
- ✅ Manual: Responsive layout adapts on resize
- ✅ Manual: Keyboard navigation works (Tab, Space/Enter)
- ✅ Manual: Screen reader announces correctly
- ✅ Manual: Color contrast passes WCAG 2.1 AA

## Deliverables

By end of implementation:
1. ✅ Standalone `WorldClockPageComponent` rendering all three clocks
2. ✅ Live time updates via RxJS timer stream (every 1000ms)
3. ✅ Digital and analog format support (seconds always visible)
4. ✅ Responsive layout (mobile/tablet/desktop)
5. ✅ Material theme tokens (no hardcoded colors)
6. ✅ Full accessibility (ARIA, keyboard, contrast)
7. ✅ Route integration (`/world-clock`)
8. ✅ Menu item added to navigation
9. ✅ Comprehensive unit + e2e test coverage
10. ✅ No console warnings or errors

## Next Steps

1. Begin Phase 1 (Models & Constants)
2. Implement phases in order, testing after each phase
3. Verify `npm test` and `npm build` pass before next phase
4. Update task.md as phases complete

---

## References

- **Specification**: [spec.md](../spec.md)
- **Data Model**: [data-model.md](../data-model.md)
- **UI Contract**: [contracts/ui-contract.md](../contracts/ui-contract.md)
- **Implementation Plan**: [plan.md](../plan.md)
- **Feature 007 Reference**: Digital clock header (proven RxJS timer pattern)
- **Feature 008 Reference**: Material token migration (proven styling pattern)
