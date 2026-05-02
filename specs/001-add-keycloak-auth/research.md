# Research: Keycloak Authentication Flow

## Decision 1: Use `keycloak-angular` 21.x with `keycloak-js` 26.6.1 in standalone Angular configuration

**Decision**: Integrate Keycloak through `provideKeycloak` in `ApplicationConfig`, using `keycloak-angular` 21.x and `keycloak-js` 26.6.1 to match Angular 21 and the target Keycloak server version.

**Rationale**: The `keycloak-angular` project documents Angular 21 support in the 21.x line and recommends matching the `keycloak-js` version to the Keycloak server version. The standalone `provideKeycloak` API is the current path, while older NgModule-era services and guards are deprecated.

**Alternatives considered**:
- Wrapping `keycloak-js` manually in a custom Angular service: rejected because it would duplicate lifecycle and DI behavior already handled by `keycloak-angular`.
- Using deprecated `KeycloakService` and `KeycloakAuthGuard`: rejected because they are legacy APIs and contradict the Angular-idiomatic requirement.

## Decision 2: Initialize with `check-sso` and a public welcome route

**Decision**: Initialize Keycloak with `onLoad: 'check-sso'`, `silentCheckSsoRedirectUri`, and a public welcome route, then trigger `login()` only from the welcome page action.

**Rationale**: The specification requires unauthenticated users to land on a public welcome page before choosing to sign in. `check-sso` allows existing sessions to be restored without forcing login on first paint, while preserving a public entry point. The silent check file avoids a full reload in browsers that support it.

**Alternatives considered**:
- `login-required` during app initialization: rejected because it would bypass the public welcome page required by FR-001 and FR-002.
- No session restoration on app start: rejected because it would violate FR-010 and degrade the refresh experience.

## Decision 3: Protect the home route with a route guard built on `createAuthGuard`

**Decision**: Use a route guard derived from `createAuthGuard` to gate the home route and redirect unauthenticated users to the welcome page.

**Rationale**: `createAuthGuard` is the documented Keycloak Angular mechanism for route protection in standalone Angular apps. It keeps access control inside the router and avoids imperative auth checks scattered across components.

**Alternatives considered**:
- Checking authentication only inside the home component: rejected because the route would still activate and briefly expose protected UI state.
- A custom global navigation service: rejected because it adds indirection with no benefit for a two-route application.

## Decision 4: Load and normalize profile data into a typed home view model

**Decision**: After authentication succeeds, use the Keycloak client profile-loading API to retrieve user data and map it into a typed home view model with fallbacks for missing fields.

**Rationale**: The specification needs both a personalized greeting and a profile section. A normalized view model keeps UI logic simple, supports graceful degradation for partial data, and satisfies the constitution's strong-typing rule.

**Alternatives considered**:
- Binding templates directly to raw Keycloak profile objects: rejected because it leaks library-specific shapes into presentation and makes fallback behavior fragile.
- Displaying only token claims without loading the profile: rejected because the requested profile details may not be fully represented in the default claims set.

## Decision 5: Use Angular Material for layout primitives and accessible status presentation

**Decision**: Build the welcome and home pages with Angular Material primitives such as cards, buttons, progress indicators, and lists.

**Rationale**: The user explicitly requested Angular Material. Its components accelerate accessible, consistent UI work for login entry, loading states, and profile presentation without introducing unnecessary custom design systems.

**Alternatives considered**:
- Plain custom HTML/CSS only: rejected because it ignores an explicit dependency requirement.
- A heavier feature-specific design system: rejected because the feature scope is small and the constitution favors architectural simplicity.