# Research: Organize Auth Header and Landing Pages

## Decision 1: Use a top-right profile trigger with Angular Material menu patterns

**Decision**: Use a top-right profile trigger in the shared shell header, combining icon, email label, and Angular Material menu actions for account-related navigation.

**Rationale**: This follows Angular Material best practices for discoverable top-level actions while keeping the interaction pattern compact and mobile-friendly.

**Alternatives considered**:
- Side navigation only for account actions: rejected because the request explicitly needs the top-right header area.
- Inline multiple auth buttons in the toolbar: rejected because it creates clutter on mobile and increases maintenance cost.

## Decision 2: Keep the component count intentionally small

**Decision**: Limit the feature to a small set of focused surfaces: shell header profile display, profile action/menu interaction, account/profile page surface, and page messaging updates.

**Rationale**: The request emphasizes simplicity and maintainability. A small component set reduces coupling and keeps future changes easy to understand and test.

**Alternatives considered**:
- Monolithic shell component for all auth/profile behavior: rejected because it mixes presentation, state, and route handling.
- Many micro-components for every profile field/action: rejected because the extra indirection is not justified at this scale.

## Decision 3: Reuse existing auth session/profile state

**Decision**: Reuse the existing auth facade/session/profile sources as the source of truth for top-right email display and login/logoff state.

**Rationale**: This avoids duplicate state management and keeps the feature aligned with current authentication behavior.

**Alternatives considered**:
- New global profile store: rejected because it adds complexity and synchronization risk.
- Independent header profile fetch: rejected because it duplicates loading and error handling.

## Decision 4: Validate with component and integration tests across mobile/desktop

**Decision**: Add tests that cover authenticated/anonymous header state, menu/account navigation, welcome/home messages, and responsive behavior.

**Rationale**: The key risks are state transitions and responsive usability. Component/integration tests offer fast feedback and good regression coverage.

**Alternatives considered**:
- e2e-only validation: rejected because it is slower and less diagnostic.
- No responsive tests: rejected because mobile/web support is a hard requirement.
