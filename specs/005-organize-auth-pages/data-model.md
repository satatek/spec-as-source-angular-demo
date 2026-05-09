# Data Model: Organize Auth Header and Landing Pages

## HeaderProfileState

**Purpose**: Represents the top-right profile area state in the shell header.

**Fields**:
- `isAuthenticated`: boolean
- `displayEmail`: string | null
- `displayLabel`: string | null
- `iconName`: string
- `isLoading`: boolean
- `errorMessage`: string | null
- `actionsVisible`: boolean

**Validation Rules**:
- `displayEmail` must be present when authenticated profile data is available.
- `displayLabel` must fall back to a safe value if email is missing.
- `iconName` must correspond to a supported Material icon token.
- `actionsVisible` must be false for anonymous sessions.

## ProfileActionItem

**Purpose**: Represents one account-related action in the profile menu.

**Fields**:
- `id`: 'open-profile' | 'logoff' | 'login'
- `label`: string
- `requiresAuth`: boolean
- `isDestructive`: boolean
- `targetRoute`: string | null

**Validation Rules**:
- Auth-required actions must not render for anonymous users.
- `targetRoute` must be app-relative when present.
- Destructive actions must be clearly identifiable in the UI.

## AccountPageViewState

**Purpose**: Represents the organized profile/account surface.

**Fields**:
- `status`: 'loading' | 'ready' | 'error'
- `profileFields`: Array<{ label: string; value: string }>
- `canLogoff`: boolean
- `feedbackMessage`: string | null

**Validation Rules**:
- `profileFields` must remain display-safe even with missing user data.
- `canLogoff` must be false while sign-out is already in progress.
- `feedbackMessage` must exist when the page needs to show recoverable failure state.

## AuthAwarePageMessage

**Purpose**: Represents welcome/home page messaging variants by auth state.

**Fields**:
- `page`: 'welcome' | 'home'
- `audience`: 'anonymous' | 'authenticated'
- `headline`: string
- `supportingCopy`: string

**Validation Rules**:
- Welcome messages must remain friendly and demo-oriented.
- Home messages must clearly reflect the authenticated context.
- Message variants must be stable across mobile and desktop layouts.
