# Data Model: World Clock Page

## Overview

The World Clock page operates on two key entities: the clock display state for each timezone region and the aggregated page state. No persistence layer required; all state is ephemeral and runtime-generated.

## Core Entities

### ClockFormat

**Purpose**: Enumeration of supported clock display formats.

**Definition**:
```typescript
export type ClockFormat = 'digital' | 'analog';
```

**Semantics**:
- `digital`: Time displayed as text (HH:MM:SS) with seconds always visible
- `analog`: Time displayed as clock face with hour, minute, and second hands; seconds always visible

---

### WorldClockEntry

**Purpose**: Represents the state and metadata for a single timezone region's clock.

**Definition**:
```typescript
export interface WorldClockEntry {
  readonly id: string;                    // Unique identifier (e.g., "brazil", "uk", "china")
  readonly region: string;                // Display label (e.g., "Brazil", "United Kingdom", "China")
  readonly city: string;                  // City reference (e.g., "Brasília", "London", "Shanghai")
  readonly timeZoneId: string;            // IANA timezone ID (e.g., "America/Sao_Paulo", "Europe/London", "Asia/Shanghai")
  readonly locale: string;                // BCP 47 locale tag for formatting (e.g., "pt-BR", "en-GB", "zh-CN")
  readonly currentTime: Date;             // Current time in the referenced timezone (UTC Date, formatted on display)
  readonly utcOffset: number;             // Current UTC offset in minutes (informational, for diagnostics)
}
```

**Validation Rules**:
- `id`: Non-empty string, lowercase alphanumeric
- `region`, `city`: Non-empty strings, max 50 chars
- `timeZoneId`: Valid IANA timezone identifier (runtime validation via Intl API)
- `locale`: Valid BCP 47 language-region tag
- `currentTime`: Valid JavaScript Date object in UTC
- `utcOffset`: Integer in range [-840, +840] (UTC±14 max)

**State Transitions**:
- Initial: Created with current system time via service
- Update: `currentTime` refreshed every 1000ms via RxJS interval stream
- No other field mutations during page lifetime

---

### WorldClockPageState

**Purpose**: Aggregated state of the World Clock page, encompassing all three region entries and display preferences.

**Definition**:
```typescript
export interface WorldClockPageState {
  readonly entries: ReadonlyArray<WorldClockEntry>;  // Always exactly 3 entries (Brazil, UK, China)
  readonly currentFormat: ClockFormat;               // Current display format (applies to all entries)
  readonly isLoading: boolean;                       // True during initial time resolution
  readonly error: string | null;                     // Error message if any entry fails to resolve
  readonly lastUpdated: Date;                        // Timestamp of last state mutation
}
```

**Validation Rules**:
- `entries`: Exactly 3 items, each a valid WorldClockEntry
- `currentFormat`: One of 'digital' | 'analog'
- `isLoading`: Boolean, true only during initial load (max duration 100ms)
- `error`: Null or non-empty string (max 200 chars)
- `lastUpdated`: Valid Date, always ≥ previous lastUpdated (monotonic)

**State Transitions**:

1. **Initialization** (isLoading = true):
   - entries: [Brazil, UK, China] with initial current times
   - currentFormat: 'digital' (default)
   - isLoading: true
   - error: null
   - lastUpdated: now

2. **Load Complete** (isLoading = false):
   - (no change to entries)
   - (no change to currentFormat)
   - isLoading: false
   - error: null (or set if partial load)
   - lastUpdated: now

3. **Live Update** (every 1000ms):
   - entries: Each entry's currentTime refreshed
   - (no change to other fields unless error)
   - lastUpdated: now

4. **Format Toggle**:
   - (no change to entries)
   - currentFormat: toggled between 'digital' and 'analog'
   - (no change to other fields)
   - lastUpdated: now

5. **Error State**:
   - entries: Partial entries (e.g., Brazil + UK visible, China failed)
   - currentFormat: unchanged
   - isLoading: false
   - error: "Failed to resolve timezone: Asia/Shanghai"
   - lastUpdated: now

---

## Related Models

### TimeZoneConfig (Internal)

**Purpose**: Configuration object for each supported timezone (Brazil, UK, China).

**Definition**:
```typescript
export interface TimeZoneConfig {
  readonly id: string;
  readonly region: string;
  readonly city: string;
  readonly timeZoneId: string;
  readonly locale: string;
}
```

**Usage**: Stored in `timezones.constants.ts`, used to initialize WorldClockEntry instances.

---

## Design Patterns

### Immutability
All entities use `readonly` fields and `ReadonlyArray` to prevent accidental mutations. New state is computed rather than modified in-place.

### Signals Integration (Angular 21)
- `WorldClockPageState` is wrapped in a component signal: `signal<WorldClockPageState>(...)`
- Computed signals derive responsive layout state: `computed(() => isResponsiveMobile() ? ... : ...)`
- Effects subscribe to state changes and manage RxJS subscriptions

### Time Formatting
- Clock display (digital/analog) derives from `currentTime` via `Intl.DateTimeFormat`
- No intermediate formatting layer; formatted on component render only
- Seconds always visible in both formats

---

## Validation & Error Handling

### Component-Level Validation
- All WorldClockEntry fields validated on creation
- Invalid timezone ID throws `Error` immediately
- Page state never enters invalid intermediate state (atomic transitions)

### Runtime Safeguards
- If a timezone becomes unresolvable (e.g., IANA database mismatch), entry shows last valid time + error badge
- Page continues rendering other entries
- Error dismissal via UI or 5s auto-dismiss

---

## References to Specification

- **WorldClockEntry** satisfies FR-002, FR-003 (display time for regions, clear labels)
- **WorldClockPageState + format toggle** satisfies US2 (digital/analog support)
- **Live update mechanism** satisfies FR-004, US1 (times stay current)
- **Responsive layout signal** satisfies FR-006, US3 (readable across screen sizes)
- **Seconds visibility** satisfies user guidance (must always show seconds)
