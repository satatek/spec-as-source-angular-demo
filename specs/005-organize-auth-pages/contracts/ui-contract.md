# UI Contract: Top Profile Header and Landing Pages

## Header Profile Interaction Contract

### Scope

Applies to the shared shell header in all routes that use the main application layout.

### Required Behavior

- Header exposes a top-right profile entry point.
- Authenticated sessions show account icon and email when available.
- Anonymous sessions hide authenticated-only profile actions.
- Profile entry point opens a compact action surface for account-related navigation.
- Profile entry point exposes the authenticated email in the trigger and keeps account actions compact.

## Account Action Contract

### Primary Actions

- `Open Profile`: Navigates to the account/profile page.
- `Log off`: Starts the sign-out flow and returns the header to anonymous state.
- `Sign in`: Starts authentication for anonymous users.

### Visibility Rules

- Auth-required actions are visible only when authenticated.
- Anonymous users may see login-oriented alternatives where applicable.

### Failure Contract

- Failed account actions return a clear recoverable message.
- UI remains interactive after failures and supports retry.

## Account/Profile Route Contract

### `GET /account`

**Purpose**: Present organized account/profile details and actions.

**Access**:
- Authenticated users only (guarded route behavior remains consistent with current auth policy).

**Required UI Elements**:
- Account identity summary
- Profile details list
- Logoff action with progress/feedback handling

## Landing Page Messaging Contract

### `GET /`

**Purpose**: Render the welcome page for anonymous users.

**Required Messaging**:
- Friendly/funny demo copy
- Clear guidance that the page is a demo

### `GET /home`

**Purpose**: Render the logged-in home page for authenticated users.

**Required Messaging**:
- Positive/funny copy that reflects logged-in status
- Clear indication that richer demo content is available after login

## Responsive Contract

- Top-right profile trigger remains reachable and readable on mobile and desktop.
- Long email identifiers must not break header layout or hide primary actions.
- Profile action interaction remains keyboard-accessible across viewport sizes.

## Test Coverage Contract

- Component tests verify authenticated/anonymous/loading/error header profile states.
- Integration tests verify profile navigation and guard behavior for `/account`.
- Responsive tests verify top-right profile operability at mobile and desktop breakpoints.
- Page-message tests verify welcome/home copy variants for anonymous and authenticated states.
