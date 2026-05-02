# Data Model: Add Logoff Button

## AuthSessionState

**Purpose**: Represents the application's authentication and logout lifecycle state.

**Fields**:
- `status`: one of `checking`, `authenticated`, `anonymous`, `error`, or a new explicit logout state such as `signing-out`
- `isAuthenticated`: boolean indicating whether the user is currently authenticated
- `loginUrlRequested`: boolean indicating whether login handoff has started
- `lastErrorMessage`: nullable string for recoverable auth or logout failures
- `redirectTarget`: nullable route string for the next app navigation target

**Relationships**:
- Drives the welcome page and authenticated detail page feedback states.

**Validation Rules**:
- `isAuthenticated` MUST be `false` after logout success or logout failure that clears the current session.
- `redirectTarget` MUST resolve to `/` after successful logout.
- `lastErrorMessage` MUST be populated when logout fails and cleared on retry or success.

## UserDetailPageState

**Purpose**: Represents the authenticated page state that renders profile details and the log off action.

**Fields**:
- `greeting`: string shown in the page header
- `profileFields`: list of label/value pairs already rendered for the user profile
- `profileWarning`: nullable string for partial profile data warnings
- `canLogoff`: boolean controlling button availability
- `isLogoffInProgress`: boolean used to disable the button and show progress feedback
- `logoffErrorMessage`: nullable string shown when the latest logout attempt fails

**Relationships**:
- Derived from `AuthSessionState` and the normalized Keycloak profile view model.

**Validation Rules**:
- `canLogoff` MUST be `false` while logout is in progress.
- `logoffErrorMessage` MUST only be shown after a failed logout attempt.
- Profile details MUST not remain rendered once session state becomes anonymous after logout.

## LogoutAttemptOutcome

**Purpose**: Represents the observable result of the latest logoff interaction.

**Fields**:
- `attemptedAt`: timestamp or event moment used only for reasoning and tests if needed
- `result`: `success` or `failure`
- `message`: nullable human-readable explanation when the attempt fails
- `redirectUri`: target route expected after successful sign-out

**Relationships**:
- Produced by the auth facade and consumed by the detail page UI.

**Validation Rules**:
- `redirectUri` MUST be `/` for successful logout in this feature.
- `message` MUST be present when `result` is `failure`.