# Research: Home Feature Cards

**Phase 0 Output** | **Generated**: 2026-05-10

## Context

Feature goal is to rebuild the Home page so it displays cards derived from the same runtime sidebar menu source. Leaf menu entries become direct cards. Parent entries (entries with children and no route) render as collapsible panels, and each visible child is rendered as a card inside the expanded panel.

## Decisions

### R1. Single source of truth for Home cards

- Decision: Reuse normalized and auth-filtered menu items produced by existing layout menu logic, instead of duplicating JSON parsing in Home.
- Rationale: Keeps Home and sidebar behavior aligned and satisfies FR-002/FR-004 with one source.
- Alternatives considered:
- Read `public/config/sidebar-menu.json` directly in Home component (rejected: duplicates parsing/validation rules).
- Hardcode Home cards in Home models (rejected: high drift risk from sidebar).

### R2. Parent and child rendering behavior

- Decision: Map top-level menu entries as follows:
- Leaf top-level item (`route !== null`, `children === null`) => render as clickable feature card.
- Parent top-level item (`route === null`, `children.length > 0`) => render as expansion panel with child cards.
- Rationale: Matches sidebar semantics and explicit user request.
- Alternatives considered:
- Flatten all children into one card grid (rejected: loses parent grouping context).
- Parent row with text links only (rejected: child items must also be cards).

### R3. Navigation behavior for cards

- Decision: Use Angular Router navigation (`routerLink`) for card click actions and keep no direct URL manipulation.
- Rationale: Angular-idiomatic routing, testable at component/e2e levels, and works with current route guards.
- Alternatives considered:
- `window.location` redirect (rejected: bypasses Angular navigation lifecycle).
- Custom navigation service wrapper (rejected: unnecessary abstraction for this feature).

### R4. Expansion component choice

- Decision: Use Angular Material expansion panel for parent features and Material cards for parent and child entries.
- Rationale: Existing app already uses Angular Material, and expansion panel provides accessible keyboard/ARIA semantics by default.
- Alternatives considered:
- Custom collapse component (rejected: complexity and a11y burden).
- Native details/summary only (rejected: visual mismatch with existing Material shell).

### R5. Error and empty state handling

- Decision: Reuse existing menu load result behavior (`ready` or `error`) and render:
- Empty state when no visible features exist.
- Error state when menu load result fails.
- Rationale: Keeps resilient behavior consistent with existing shell menu loading contract.
- Alternatives considered:
- Silent fallback to blank page (rejected: fails FR-006/FR-007).

### R6. Validation strategy for this feature

- Decision: Validate at three layers:
- Unit/component: mapping and rendering behavior for leaf and parent entries.
- Integration: Home uses same filtered items as sidebar.
- End-to-end: card click navigates correctly; parent panel expand reveals child cards.
- Rationale: Lowest-cost proof per constitution principle IV.
- Alternatives considered:
- E2E only (rejected: expensive and brittle for mapping logic).

## Best-practice notes

- Keep transformation logic in a feature-local mapper function with strict types.
- Keep card model immutable (`readonly` fields).
- Preserve menu ordering using pre-sorted config and child order.
- Use ARIA labels for card actions and descriptive expansion panel headers.

## Resolved clarifications

No unresolved `NEEDS CLARIFICATION` items remain for this feature scope.
