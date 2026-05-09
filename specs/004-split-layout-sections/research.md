# Research: Split Application Layout Sections

## Decision 1: Use a route-wrapper app shell with Angular Material primitives

**Decision**: Implement a shared shell component that owns `header`, `main`
content outlet, and `footer`, using `mat-toolbar` for header actions and
`mat-sidenav-container` for responsive navigation.

**Rationale**: This is the most Angular-idiomatic way to centralize layout and
avoid repeating shared markup in each page component. It directly supports
FR-001, FR-002, FR-003, and FR-010 while preserving route-oriented page content.

**Alternatives considered**:
- Keep layout directly in each feature page: rejected due to duplication and low reuse.
- Keep layout in root component without route scoping: rejected because future
  layout variants become hard to support and test.

## Decision 2: Drive responsiveness with Angular CDK BreakpointObserver

**Decision**: Use `BreakpointObserver` to switch sidenav mode (`side` on desktop,
`over` on mobile) and opened state behavior based on viewport size.

**Rationale**: CDK breakpoints are stable, framework-native, and remove custom
window-size management logic. This supports FR-005 and keeps behavior predictable
for testing.

**Alternatives considered**:
- CSS-only behavior without state coordination: rejected because mobile drawer
  open/close behavior on navigation needs component-state awareness.
- Manual `window.matchMedia` wiring: rejected because CDK already provides a
  typed Angular-friendly abstraction.

## Decision 3: Keep auth and route guard logic unchanged

**Decision**: Nest existing routes under the shell component and preserve current
`canActivateAuthenticatedRoute` behavior for protected pages.

**Rationale**: The feature is structural (layout) and should not alter business
rules for access control. This aligns with FR-006 and minimizes regression risk.

**Alternatives considered**:
- Refactor auth guard while introducing layout: rejected as unnecessary scope expansion.
- Duplicate route definitions for shell/non-shell variants: rejected due to complexity.

## Decision 4: Validate at component and routing integration levels first

**Decision**: Prioritize tests for shell rendering, region ordering, sidenav
responsive behavior, and route content projection via child routes.

**Rationale**: The core risk is UI structure wiring, not backend integration.
Component and integration tests provide fast and precise feedback with minimal
maintenance cost.

**Alternatives considered**:
- e2e-only validation: rejected because it is slower and less diagnostic.
- no new tests for shell behavior: rejected due to regression risk in shared layout.
