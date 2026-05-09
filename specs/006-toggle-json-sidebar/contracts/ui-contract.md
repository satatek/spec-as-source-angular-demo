# UI Contract: Dynamic Sidebar and Two-Level Navigation

## Sidebar Toggle Contract

### Scope

Applies to the left navigation drawer rendered by the application shell.

### Required Behavior

- A visible toggle control allows users to show/hide the sidebar on demand.
- The toggle control is available from the shared header across desktop and mobile layouts.
- Sidebar state changes are reflected immediately after user action.
- Primary content remains available when sidebar is hidden.

## JSON-Driven Rendering Contract

### Required Behavior

- Sidebar menu entries are sourced from runtime JSON (`/config/sidebar-menu.json`).
- Render order follows each entry's declared `order`.
- Auth visibility filtering is applied before render.
- Missing/invalid contract data triggers non-blocking fallback behavior.

## Two-Level Hierarchy Contract

### Parent Entries

- Parent entries with children indicate expandable state.
- Expand/collapse interaction is keyboard-accessible.
- Parent entries without route do not trigger route navigation.

### Child Entries

- Child entries render under expanded parent entries only.
- Selecting a child entry navigates to the configured route.
- Child entries inherit global sidebar close-on-navigation behavior for mobile.

## Angular Material Contract

- Sidebar uses Angular Material sidenav/list interaction patterns.
- Visual affordances for hierarchy use Material iconography and spacing conventions.
- Interactive rows must expose semantic labels and visible focus treatment.

## Failure and Fallback Contract

- If runtime menu JSON fails to load or validate, sidebar presents a clear fallback message.
- Fallback state does not block router-outlet content rendering.
- Fallback mode may render an empty menu list and still keep shell navigation controls responsive.
- Retry or recovery behavior must keep UI responsive and predictable.

## Test Coverage Contract

- Component tests cover toggle behavior and hierarchy rendering.
- Integration tests cover runtime JSON loading, route navigation, and fallback handling.
- Responsive tests cover mobile and desktop interactions for expanded/collapsed behavior.
