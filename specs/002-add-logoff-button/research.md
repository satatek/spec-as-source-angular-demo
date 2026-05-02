# Research: Add Logoff Button

## Decision 1: Treat the existing protected home page as the current user detail surface

**Decision**: Implement the log off action on the existing protected home page instead of introducing a new authenticated route.

**Rationale**: The current application already exposes one authenticated page at `/home`, and it is the only place where user profile details are rendered. Adding the new action there satisfies the specification with the smallest viable change and avoids unnecessary routing or layout expansion.

**Alternatives considered**:
- Creating a new dedicated user detail route: rejected because the feature request only asks for a logoff action on the current detail experience and does not justify new route structure.
- Moving the action into a shared shell header: rejected because no shared authenticated shell exists today and adding one would be broader than the requested scope.

## Decision 2: Reuse `AuthFacade` as the single owner of logout and redirect behavior

**Decision**: Add logout behavior to the existing `AuthFacade`, including local state teardown, error reporting, and redirect target selection.

**Rationale**: The facade already owns login, profile restoration, and protected-route failure handling. Keeping logout in the same surface preserves a single source of truth for session transitions and avoids duplicating Keycloak calls across components.

**Alternatives considered**:
- Calling `keycloak.logout()` directly from the component: rejected because it would split session logic between UI and auth integration code.
- Adding a second logout-only service: rejected because the existing facade already has the required dependencies and state.

## Decision 3: Use native `keycloak.logout()` with an explicit redirect to the welcome page

**Decision**: Use `keycloak.logout({ redirectUri: window.location.origin + '/' })` so the identity provider completes sign-out and the browser returns to the anonymous welcome route.

**Rationale**: The installed `keycloak-js` client exposes `logout(options?: KeycloakLogoutOptions)` with a typed `redirectUri`, which matches the required behavior directly. This keeps logout consistent with the provider rather than simulating sign-out by clearing local memory alone.

**Alternatives considered**:
- Only calling `clearToken()` and navigating locally: rejected because it would not guarantee a provider-level logout.
- Redirecting to `/home` after logout and relying on the guard: rejected because the specification requires a direct welcome-page redirect.

## Decision 4: Model logout progress and failure explicitly in typed state

**Decision**: Extend the current auth and home-page view state to represent logoff-in-progress and logoff-failed states explicitly.

**Rationale**: The specification requires visible feedback for failed logoff attempts and a clear UI during the action. Explicit typed state is the lowest-friction way to drive button disabling, progress messaging, and retry behavior without ambiguous template logic.

**Alternatives considered**:
- Reusing only the existing generic `checking` state: rejected because login/profile refresh and logout have different user-facing semantics.
- Managing local component booleans without type changes: rejected because the logout result must remain consistent with the shared auth session surface.

## Decision 5: Validate logout at component and integration layers, keeping e2e optional

**Decision**: Add component tests for the home page button and feedback states, plus integration tests for facade logout teardown and route protection after sign-out.

**Rationale**: These layers are the cheapest way to prove the new behavior required by the spec: button visibility, logout initiation, local state clearing, redirect intent, and protection against revisiting `/home` anonymously.

**Alternatives considered**:
- Relying only on end-to-end testing: rejected because it is more expensive and slower for a focused logout behavior.
- Testing only the facade: rejected because the feature request explicitly includes a new UI action on the detail page.