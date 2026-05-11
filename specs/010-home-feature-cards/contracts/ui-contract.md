# UI Contract: Home Feature Cards

## Goal

Define user-visible behavior for the rebuilt Home page using feature cards from sidebar menu data.

## View structure

- Home page root section.
- Direct features section: grid/list of clickable cards from top-level leaf menu items.
- Grouped features section: expansion panels for parent items, each containing child cards.
- Status surfaces:
- Empty state when there are no visible feature entries.
- Error state when menu data cannot be loaded or normalized.

## Interaction contract

### Direct feature card

- Trigger: user click or keyboard activation.
- Action: navigate to card `route`.
- Result: current route changes to destination feature.

### Parent feature panel

- Trigger: user click or keyboard toggle on panel header.
- Action: expand/collapse panel.
- Result: expanded panel reveals child feature cards.

### Child feature card

- Trigger: user click or keyboard activation inside expanded parent panel.
- Action: navigate to child card `route`.
- Result: current route changes to destination feature.

## Accessibility

- Cards must be keyboard reachable and activatable.
- Expansion headers must expose expanded/collapsed state.
- Empty and error states must include perceivable text.
- Focus indicators must remain visible for panel headers and cards.

## Responsiveness

- Mobile: cards stack, panels stay full-width.
- Tablet/desktop: cards may use multi-column layout.
- No horizontal scrolling for core card content.
