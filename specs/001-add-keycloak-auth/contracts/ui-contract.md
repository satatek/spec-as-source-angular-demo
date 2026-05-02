# UI Contract: Keycloak Authentication Flow

## Routes

### `GET /`

**Purpose**: Public welcome route for unauthenticated visitors and session restoration entry.

**Behavior**:
- Shows a welcome message and a primary login action.
- May show a recoverable auth-status message when a prior login attempt failed or was cancelled.
- If an existing session is restored during app initialization, the application may redirect to `/home` after auth readiness is confirmed.

### `GET /home`

**Purpose**: Protected authenticated route showing personalized identity data.

**Behavior**:
- Requires an authenticated Keycloak session.
- Redirects unauthenticated access attempts to `/`.
- Displays a personalized welcome message and a profile details section.
- Shows a fallback warning when some profile fields are unavailable.

## UI States

### Welcome Page

**Required elements**:
- App title or welcome headline
- Short explanatory text
- Primary login action that initiates Keycloak login
- Optional error or retry message region

### Home Page

**Required elements**:
- Personalized greeting using normalized display name
- Profile details section with labeled fields
- Loading indicator while profile data is being resolved
- Warning or fallback message area for partial profile data

## Integration Contracts

### Authentication Initialization

**Inputs**:
- Keycloak URL: `http://localhost:8080/`
- Realm: `local-demo`
- Client ID: `angular-local-demo`
- Init mode: `check-sso`

**Outputs**:
- Authenticated session state for route protection and UI rendering
- Redirect into Keycloak login when the user explicitly requests authentication

### Profile Retrieval

**Source**: Keycloak user profile API via the initialized client

**Mapped fields**:
- Subject identifier
- Display name
- Username
- Email
- First name
- Last name
- Email verification state