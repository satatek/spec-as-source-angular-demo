# Data Model: Keycloak Authentication Flow

## AuthSessionState

**Purpose**: Represents the application's current authentication lifecycle and whether protected navigation is allowed.

**Fields**:
- `status`: `'checking' | 'authenticated' | 'anonymous' | 'error'`
- `isAuthenticated`: boolean
- `loginUrlRequested`: boolean
- `lastErrorMessage`: string | null
- `redirectTarget`: string | null

**Validation Rules**:
- `isAuthenticated` MUST be `true` only when `status` is `authenticated`.
- `redirectTarget` MUST be a safe in-app route or `null`.
- `lastErrorMessage` MUST be present when `status` is `error`.

**State Transitions**:
- `checking -> anonymous` when `check-sso` completes without a valid session.
- `checking -> authenticated` when Keycloak initialization restores a valid session.
- `anonymous -> checking` when the user starts login.
- `authenticated -> error` when profile retrieval or session refresh fails irrecoverably.
- `error -> anonymous` when auth state is cleared and the user is returned to the public route.

## KeycloakProfileViewModel

**Purpose**: Represents the user profile data rendered on the home page.

**Fields**:
- `subject`: string
- `displayName`: string
- `username`: string | null
- `email`: string | null
- `emailVerified`: boolean | null
- `firstName`: string | null
- `lastName`: string | null

**Validation Rules**:
- `subject` MUST be present for authenticated users.
- `displayName` MUST always be non-empty; derive from full name, username, email, or a fallback label in that order.
- Optional fields MAY be `null` when Keycloak does not provide them.

## HomePageState

**Purpose**: Represents the render state of the protected home page.

**Fields**:
- `session`: AuthSessionState
- `profile`: KeycloakProfileViewModel | null
- `isLoadingProfile`: boolean
- `profileWarning`: string | null

**Validation Rules**:
- `profile` MUST be populated when `session.status` is `authenticated` and profile loading succeeds.
- `profileWarning` MUST be present when profile fields are missing or profile loading partially fails.
- `isLoadingProfile` MUST be `false` once the page settles into success or fallback rendering.

**State Transitions**:
- Initial authenticated navigation starts with `isLoadingProfile = true`.
- Successful profile load sets `profile` and clears `profileWarning`.
- Partial profile load keeps `profile` populated and sets `profileWarning`.
- Unrecoverable auth failure clears `profile` and returns control to the welcome route.