# Research: Dynamic JSON Sidebar Menu

## Decision 1: Store menu JSON in public/config alongside runtime config artifacts

**Decision**: Store sidebar configuration at `public/config/sidebar-menu.json` and load it at runtime through an app-relative request.

**Rationale**: The repository already uses `public/config` for environment-level runtime configuration. Reusing this folder keeps deployment customization simple and avoids introducing another config location.

**Alternatives considered**:
- `src/assets` menu JSON: rejected because it is less aligned with the existing runtime config convention used for Keycloak.
- Hardcoded TypeScript constants: rejected because the feature explicitly requires JSON-driven menu definitions.
- Remote API endpoint for menu: rejected because it adds infrastructure dependency not required by the current scope.

## Decision 2: Use a feature-local loader service with explicit typing

**Decision**: Add a shell-local loader (`shell-menu-config.loader`) that fetches and validates the menu JSON contract into typed menu models before rendering.

**Rationale**: Strong typing and localized validation satisfy constitutional requirements and keep failures contained to the navigation surface.

**Alternatives considered**:
- Loading JSON directly in component template logic: rejected because it mixes I/O, parsing, and view concerns.
- Global app state store for sidebar menu: rejected because the menu currently has a single consumer and does not justify extra abstraction.

## Decision 3: Render two-level navigation with Angular Material navigation primitives

**Decision**: Render level-1 entries as Material list items and use Angular Material hierarchical pattern (expand/collapse row behavior with icon affordance) for level-2 entries.

**Rationale**: This preserves visual consistency with the existing Material shell and ensures keyboard/focus behavior can remain accessible without custom widget semantics.

**Alternatives considered**:
- Custom accordion without Material primitives: rejected due to higher accessibility and maintenance risk.
- Unlimited recursive nesting: rejected because the requirement supports two levels only.

## Decision 4: Define a deterministic fallback state for JSON load/validation failures

**Decision**: If menu config fetch or validation fails, render a non-blocking fallback navigation state and keep main content available.

**Rationale**: This directly satisfies FR-008 and avoids trapping users behind configuration problems.

**Alternatives considered**:
- Blank sidebar on error with no feedback: rejected because it is ambiguous and hard to diagnose.
- Blocking error screen: rejected because requirements state fallback must be non-blocking.

## Decision 5: Validate behavior with component + integration tests at the shell boundary

**Decision**: Add component tests for toggle and hierarchical rendering, plus integration tests that simulate valid/invalid JSON and verify navigation interactions.

**Rationale**: These are the lowest-cost tests that prove correctness of dynamic loading and UI behavior.

**Alternatives considered**:
- e2e-only coverage: rejected because it is slower and less precise for menu-model validation failures.
- Unit-only loader tests: rejected because route/render integration risk would remain unverified.
