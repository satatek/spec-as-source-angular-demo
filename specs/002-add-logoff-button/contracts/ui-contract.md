# UI Contract: Add Logoff Button

## Routes

### `GET /home`

**Purpose**: Render the authenticated user detail experience.

**Access**:
- Authenticated users only.
- Anonymous users are redirected to `/` by the existing route guard.

**Required UI Elements**:
- Personalized greeting derived from the normalized profile view model
- Profile details list
- A visible `Log off` button on the authenticated detail page

**Interaction Rules**:
- Selecting `Log off` starts a sign-out flow through the auth facade.
- While sign-out is in progress, the button is disabled and progress feedback is visible.
- On successful sign-out, the browser returns to `/` and the welcome page shows an anonymous state.
- On failed sign-out, the page remains recoverable and shows a clear retryable error message.

### `GET /`

**Purpose**: Render the anonymous welcome page.

**Access**:
- Public route.

**Required UI After Logout**:
- Welcome heading
- Sign-in action
- No authenticated profile details from the previous session

## Auth Facade Contract

### `logout(redirectTarget?: string): Promise<void>`

**Behavior**:
- Accepts an optional app redirect target and resolves it to the welcome route for this feature.
- Calls Keycloak's provider-level logout with an explicit redirect URI.
- Clears in-memory profile state before or during transition away from the authenticated page.
- Records a recoverable error message if the logout attempt fails.

**Failure Contract**:
- A failed logout does not silently leave the UI unchanged.
- The facade exposes enough typed state for the page to present retry guidance.

## Test Coverage Contract

- Component tests MUST verify the `Log off` button is rendered for authenticated users on the detail page.
- Component or integration tests MUST verify button disabling and visible feedback during logout attempts.
- Integration tests MUST verify post-logout access to `/home` is denied.