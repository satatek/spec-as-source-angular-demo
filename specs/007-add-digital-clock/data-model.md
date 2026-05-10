# Data Model: Digital Clock with Timezone

## ClockViewModel

**Purpose**: Render-ready state for top-menu clock display.

**Fields**:
- `timeText`: string (`HH:mm:ss`)
- `timezoneText`: string (e.g., `UTC`, `GMT-3`, `EST`)
- `isVisible`: boolean
- `lastUpdatedAt`: Date

**Validation Rules**:
- `timeText` is always 8 characters in `HH:mm:ss` format.
- `timezoneText` is required; fallback value is `UTC` if abbreviation is unavailable.
- `isVisible` must be `true` only when viewport width is `>= 768px`.
- `lastUpdatedAt` updates every second while component is active.

## ClockFormatConfig

**Purpose**: Encapsulates formatting decisions and fallback behavior.

**Fields**:
- `locale`: string (default `en-GB` for 24-hour behavior)
- `hourCycle`: 'h23'
- `timezoneSource`: 'server' | 'browser'
- `fallbackTimezone`: 'UTC'

**Validation Rules**:
- `hourCycle` must produce 24-hour output for all user stories.
- `timezoneSource` prefers `server` when available; otherwise `browser`.
- `fallbackTimezone` must be used when formatter cannot resolve timezone label.

## HeaderLayoutState (Extension)

**Purpose**: Existing shell header layout state extended with clock-centric visibility.

**Fields**:
- `hasCenteredClock`: boolean
- `availableWidthCategory`: 'mobile' | 'tablet' | 'desktop'

**Validation Rules**:
- `hasCenteredClock` is `false` for `mobile` category (<768px).
- `hasCenteredClock` must not alter profile/menu trigger accessibility or ordering.

## State Transitions

1. **Init -> Visible**: On initial render, if viewport >=768px, clock becomes visible and starts ticking.
2. **Init -> Hidden**: On initial render, if viewport <768px, clock remains hidden.
3. **Visible -> Hidden**: On resize below 768px, clock hides without affecting adjacent controls.
4. **Hidden -> Visible**: On resize to >=768px, clock reappears centered.
5. **Tick Update**: Every second, `timeText` and `lastUpdatedAt` refresh while preserving layout stability.
