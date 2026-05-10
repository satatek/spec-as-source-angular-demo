# Contract: World Clock Page UI

## Purpose

Defines the user interface contract for the World Clock page, including component layout, interaction patterns, and responsiveness expectations.

## Page Structure

### URL Route
- **Path**: `/world-clock`
- **Named**: `world-clock` (for routerLink references)
- **Auth Guard**: Public (no authentication required; reuses existing public route pattern)
- **Breadcrumb**: "Home > World Clock" (if app has breadcrumb navigation)

### Component Hierarchy

```
WorldClockPageComponent (standalone)
├── PageHeader
│   ├── Title: "World Clock"
│   ├── Description: "Current time in three major regions"
│   └── FormatToggleButton: "🔄 Switch Format"
├── LoadingState (if isLoading)
│   └── MatSpinner
├── ErrorState (if error)
│   └── MatAlert (dismissible)
└── ClockGrid
    ├── WorldClockEntryComponent (Brazil)
    ├── WorldClockEntryComponent (UK)
    └── WorldClockEntryComponent (China)
```

### Responsive Layout

| Breakpoint | Layout | Cards per Row | Notes |
|------------|--------|---------------|-------|
| XS (<600px) | Stacked Vertical | 1 | Mobile: full width, no truncation |
| SM (600-960px) | Vertical Stack | 1 | Tablet portrait: full width |
| MD (960-1200px) | Grid 2x2 | 2 | Tablet landscape: 2 per row |
| LG (>1200px) | Grid 1x3 | 3 | Desktop: 3 per row in horizontal line |

**Layout Implementation**: Use Material `fxLayoutGap` and `fxFlexFill` or CSS Grid with `auto-fit` + BreakpointObserver computed signal.

### Clock Entry Card (Reusable Component)

**Component**: `WorldClockEntryComponent` (standalone)

**Props** (Inputs):
```typescript
@Input() entry!: WorldClockEntry;
@Input() format!: ClockFormat;
```

**Card Layout**:
```
┌─────────────────────────────┐
│ Brazil                      │
│ Brasília                    │
├─────────────────────────────┤
│                             │
│  [Digital Clock Display]    │  (or [Analog Clock Face])
│  HH:MM:SS                   │
│  15:45:23                   │
│                             │
├─────────────────────────────┤
│ UTC-3 (Current Offset)      │
└─────────────────────────────┘
```

**Digital Format**:
- Display: Time text in large, monospace font
- Format: HH:MM:SS (24-hour, always show seconds)
- Font Size: 3.5rem (desktop), 2rem (mobile), responsive via clamp()
- Font Family: Roboto Mono (Material Design monospace default)
- Color: Material token `--mat-sys-on-surface`

**Analog Format**:
- Display: SVG or Canvas clock face with animated hands
- Elements: Hour hand, minute hand, second hand (always visible)
- Center dot: Small filled circle
- Tick marks: 12 hour positions, 60 minute marks (optional detail)
- Second hand: Thin line with distinct color (Material `--mat-sys-primary`)
- Animation: Smooth hand rotation, 60 frames per second for second hand
- Size: Responsive circle (300px desktop, 200px mobile)

### Page Header Section

**Title**: "World Clock"
- Font: Material `--mat-sys-title-large`
- Color: `--mat-sys-on-surface`
- Margin: Material spacing (clamp(1rem, 3%, 2rem))

**Description**: "Current time in three major regions"
- Font: Material `--mat-sys-body-medium`
- Color: `--mat-sys-on-surface-variant`
- Margin: 0.5rem top

**Format Toggle Button**:
- Type: MatIconButton with FAB-style ripple
- Icon: Refresh icon (mat-icon "refresh")
- Label: "Toggle between digital and analog clock formats"
- Tooltip: "Switch Format"
- Behavior: Click toggles `currentFormat` signal, instant UI update
- State: Disabled if `isLoading === true`

### Loading State

- **Component**: Material `<mat-spinner>`
- **Message**: "Loading current times..."
- **Duration**: Max 100ms (per research decision)
- **Dismissible**: No (temporary)

### Error State

- **Component**: Material `<mat-alert type="error">`
- **Message**: `state().error` (e.g., "Failed to resolve timezone: Asia/Shanghai")
- **Dismissible**: Yes (X button or auto-dismiss in 5s)
- **Fallback**: Render partial entries (Brazil + UK visible if China failed)
- **Recommendation**: "Please refresh the page if times don't update after 10 seconds."

## Styling & Design Tokens

### Colors (All via Material CSS Custom Properties)

- **Card Background**: `--mat-sys-surface-container-low`
- **Card Text**: `--mat-sys-on-surface`
- **Header Text**: `--mat-sys-on-surface`
- **Secondary Text** (UTC offset): `--mat-sys-on-surface-variant`
- **Accent** (second hand): `--mat-sys-primary`
- **Error**: `--mat-sys-error`
- **Border**: `--mat-sys-outline-variant` (subtle)

### Spacing (Responsive via clamp())

- **Page Padding**: `clamp(1rem, 5%, 3rem)`
- **Card Gap**: `clamp(0.5rem, 3%, 2rem)`
- **Card Padding**: `clamp(1rem, 4%, 2rem)`
- **Title Margin Bottom**: `clamp(0.5rem, 2%, 1.5rem)`

### Shadows & Elevation

- **Card Elevation**: Material elevation level 1 (subtle shadow)
- **Hover**: Elevation level 2 (slight lift on hover)
- **Active Format Button**: Elevation level 3

### Typography

- **Title**: `--mat-sys-title-large` (32px, 500 weight)
- **Region Name**: `--mat-sys-title-medium` (20px, 500 weight)
- **City Name**: `--mat-sys-body-medium` (14px, 400 weight)
- **Digital Clock**: Roboto Mono 3.5rem (desktop), 2rem (mobile)
- **UTC Offset**: `--mat-sys-label-small` (12px, 500 weight)

## Interaction Patterns

### Mouse / Keyboard

- **Tab Navigation**: Forward through format button, then each clock card
- **Space / Enter on Button**: Toggle format
- **Click Card**: No action (informational only)
- **Focus Ring**: Visible from Material theme (--mat-sys-outline)

### Touch / Mobile

- **Tap Format Button**: Toggle format (larger target, 48px min)
- **Swipe Left/Right**: No custom behavior (scroll page if needed)

## Accessibility Requirements

### ARIA Labels & Regions

```html
<div role="region" aria-label="World Clock: Current times for three major regions">
  <h1>World Clock</h1>
  <p>Current time in three major regions</p>
  
  <div class="clock-grid" role="region" aria-live="polite" aria-label="Clock displays">
    <!-- Each clock card -->
    <div role="region" aria-label="Brazil: Brasília time">
      <h2>Brazil</h2>
      <p>Brasília</p>
      <div aria-live="polite" aria-label="Current time: 15 hours 45 minutes 23 seconds">
        15:45:23
      </div>
    </div>
  </div>
</div>
```

### Color Contrast

- Text on background: 4.5:1 minimum (Material tokens enforce)
- Digital clock text: 7:1 (large monospace improves readability)

### Focus Management

- Focus on format button after page load
- Tab order: Header button → Clock cards (top to bottom, left to right)
- Visible focus ring on all interactive elements

### Screen Reader

- Page announces: "World Clock page. Current time in three major regions. Loading... Brazil Brasília 15:45:23..."
- Format toggle announces: "Switch Format button. Toggled to analog format."

## Responsive Design Examples

### Mobile (XS - 360px width)
```
┌──────────────────┐
│ World Clock   🔄 │
│ Current times... │
├──────────────────┤
│ Brazil           │
│ Brasília         │
│ 15:45:23         │
│ UTC-3            │
├──────────────────┤
│ United Kingdom   │
│ London           │
│ 20:45:23         │
│ UTC+0            │
├──────────────────┤
│ China            │
│ Shanghai         │
│ 04:45:23         │
│ UTC+8            │
└──────────────────┘
```

### Desktop (LG - 1400px width)
```
┌─────────────────────────────────────────────────────────────┐
│ World Clock                               🔄 Switch Format  │
│ Current time in three major regions                         │
├──────────────────┬──────────────────┬──────────────────┐
│ Brazil           │ UK               │ China            │
│ Brasília         │ London           │ Shanghai         │
│ 15:45:23         │ 20:45:23         │ 04:45:23         │
│ UTC-3            │ UTC+0            │ UTC+8            │
└──────────────────┴──────────────────┴──────────────────┘
```

## Component Testing Expectations

- **Rendering**: All three clocks visible, correct region labels
- **Format Toggle**: Digital → Analog → Digital works without page reload
- **Live Update**: Time values increment by 1 second every ~1000ms
- **Responsiveness**: Layout changes correctly on breakpoint transitions
- **Accessibility**: ARIA labels present, color contrast compliant, keyboard navigable
- **Error Handling**: Partial clock display if one timezone fails

## References

- **Data Model**: [data-model.md](../data-model.md)
- **Specification**: [spec.md](../spec.md) — FR-005, FR-006, US3 (layout, comparison, readability)
- **Component Best Practices**: Angular Material Design System documentation
