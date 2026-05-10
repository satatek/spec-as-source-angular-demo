# UI Contract: Centered Digital Clock in Top Menu

## Scope

Applies to the shared shell top toolbar used across application routes.

## Clock Presentation Contract

- Header MUST present a centered digital clock region when viewport width is `>= 768px`.
- Clock text MUST render in `HH:mm:ss` 24-hour format.
- Timezone label MUST appear adjacent to the time text.
- Clock typography MUST use a digital-style monospace treatment while preserving Angular Material default theme colors.
- Clock region MUST be non-interactive and MUST NOT steal focus order from existing toolbar controls.

## Responsive Visibility Contract

- For viewports `< 768px`, the clock MUST be hidden.
- For viewports `>= 768px`, the clock MUST be visible.
- Visibility changes on resize MUST avoid disruptive layout shifts for menu toggle and profile controls.

## Time and Timezone Contract

- Time MUST refresh at a 1-second cadence.
- Timezone label MUST prefer server timezone if available via app context.
- If server timezone is unavailable, browser/system timezone MUST be used.
- If abbreviation cannot be resolved, fallback label MUST be `UTC`.

## Accessibility Contract

- Clock content MUST remain readable against Material surface/on-surface token colors.
- Existing toolbar controls retain keyboard navigation order and ARIA semantics.
- Hiding/showing clock MUST NOT remove or alter accessibility of primary actions.

## Test Coverage Contract

- Component tests verify:
  - 1-second time updates
  - timezone text rendering
  - visibility toggling around 768px threshold
  - centered placement container exists in toolbar structure
- e2e tests verify:
  - visible clock on tablet/desktop viewport
  - hidden clock on mobile viewport
  - no overlap with profile trigger on responsive transitions
