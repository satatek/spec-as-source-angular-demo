# Contract: WorldClockPageState

## Purpose

Defines the interface contract for the complete state of the World Clock page. This contract ensures consistency between the component's internal state management and any future service or effects that may modify page state.

## TypeScript Interface

```typescript
// src/app/features/world-clock/models/world-clock.models.ts

export interface WorldClockPageState {
  readonly entries: ReadonlyArray<WorldClockEntry>;  // Exactly 3 entries
  readonly currentFormat: ClockFormat;               // 'digital' | 'analog'
  readonly isLoading: boolean;                       // Initial load indicator
  readonly error: string | null;                     // Null or error message
  readonly lastUpdated: Date;                        // Monotonic timestamp
}

export type ClockFormat = 'digital' | 'analog';
```

## Contract Guarantees

### Immutability
- All fields are `readonly`
- `entries` is a `ReadonlyArray` (no mutation methods)
- New page state created via new object (not mutation)

### Validity Invariants
- `entries.length === 3` (always Brazil, UK, China)
- Each entry in `entries` is a valid `WorldClockEntry`
- `currentFormat` is one of: `'digital'` | `'analog'`
- `isLoading` is `true` only during initial load (<100ms)
- `error` is `null` or non-empty string
- `lastUpdated` is always ≥ previous `lastUpdated` (monotonic)

### State Transitions

Valid transitions (non-exhaustive):

```
[INIT] →
  entries: [Brazil, UK, China] (current times)
  currentFormat: 'digital'
  isLoading: true
  error: null
  lastUpdated: now

[INIT] → [READY]
  (entries unchanged)
  (currentFormat unchanged)
  isLoading: false
  error: null
  lastUpdated: now

[READY] → [LIVE_UPDATE] (every 1000ms)
  entries: Updated with new currentTime for each region
  (other fields unchanged)
  lastUpdated: now

[READY] → [FORMAT_TOGGLE]
  (entries unchanged)
  currentFormat: 'digital' ↔ 'analog'
  (other fields unchanged)
  lastUpdated: now

[READY] → [ERROR]
  entries: Partial (e.g., only 2 regions resolved)
  (currentFormat unchanged)
  isLoading: false
  error: "Failed to resolve timezone: ..."
  lastUpdated: now
```

### Invalid States (Never Occurs)

- `entries.length !== 3`
- `entries` contains invalid `WorldClockEntry`
- `currentFormat` is neither `'digital'` nor `'analog'`
- `isLoading === true` AND `lastUpdated` is >100ms old
- `lastUpdated < previousLastUpdated` (violates monotonicity)

## Usage Pattern

**Component Signal**:
```typescript
@Component({...})
export class WorldClockPageComponent {
  readonly state = signal<WorldClockPageState>(initialState);
  
  constructor(private timeService: WorldClockTimeService) {
    // Subscribe to updates and mutate state signal
    effect(() => {
      this.timeService.getCurrentTimes().subscribe(entries => {
        this.state.update(current => ({
          ...current,
          entries,
          isLoading: false,
          lastUpdated: new Date(),
        }));
      });
    });
  }
  
  toggleFormat() {
    this.state.update(current => ({
      ...current,
      currentFormat: current.currentFormat === 'digital' ? 'analog' : 'digital',
      lastUpdated: new Date(),
    }));
  }
}
```

**Template**:
```html
<div class="world-clock-page" [ngSwitch]="state().currentFormat">
  <div *ngSwitchCase="'digital'" class="digital-clocks">
    <!-- Digital clock display for each entry in state().entries -->
  </div>
  <div *ngSwitchCase="'analog'" class="analog-clocks">
    <!-- Analog clock display for each entry in state().entries -->
  </div>
  <div *ngIf="state().error" class="error-message">
    {{ state().error }}
  </div>
</div>
```

## Breaking Changes

Breaking change occurs if:
1. Required field removed (e.g., `entries` deleted)
2. Field type changes (e.g., `ClockFormat` becomes string union)
3. Field becomes mutable (loses `readonly`)
4. `entries` no longer guaranteed to have exactly 3 items
5. `currentFormat` gains a new value option without compatibility layer

Non-breaking changes:
- Adding optional field
- Adding validation constraint (service-level)
- Changing field order

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 9, 2026 | Initial contract definition |

## References

- **Data Model**: [data-model.md](../data-model.md)
- **Specification**: [spec.md](../spec.md) — US1 (all three times), US2 (format toggle), US3 (responsive display)
