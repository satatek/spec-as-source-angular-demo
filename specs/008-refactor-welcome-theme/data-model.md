# Data Model: Welcome Page Theme Refactor

## WelcomePageSurface

**Purpose**: Represents each visible layout region on the welcome page and its theme-role intent.

**Fields**:
- `id`: string
- `kind`: 'page' | 'card' | 'banner' | 'text'
- `colorRole`: string
- `textRole`: string | null
- `isInteractive`: boolean

**Validation Rules**:
- `kind = 'page'` uses a surface-level role (`surface` or `surface-*`).
- `textRole` must be provided for textual regions.
- Interactive surfaces must not use low-contrast role pairings.

## ThemeColorMapping

**Purpose**: Defines mapping from welcome-page selectors/elements to Material theme tokens.

**Fields**:
- `selector`: string
- `backgroundToken`: string | null
- `foregroundToken`: string | null
- `borderToken`: string | null
- `elevationToken`: string | null

**Validation Rules**:
- Hardcoded hex colors are disallowed for mapped welcome selectors.
- `foregroundToken` must be compatible with `backgroundToken` pairing.
- Border tokens should use `outline` or `outline-variant` semantics.

**Hard Rule**:
- Welcome feature styles MUST NOT include hardcoded color literals (`#hex`, `rgb()`, `rgba()`) for page/UI theming.

**Fallback Behavior**:
- If a target token is unavailable, fallback must remain within Material semantic roles:
	- background: `surface` -> `surface-container-low` -> `surface-container`
	- foreground: `on-surface` -> `on-surface-variant`
	- border: `outline-variant` -> `outline`

## WelcomeRefactorState

**Purpose**: Tracks implementation completeness for refactor acceptance.

**Fields**:
- `structureRefactored`: boolean
- `themeTokenMigrationComplete`: boolean
- `responsiveIntegrityVerified`: boolean
- `contentRegressionChecked`: boolean

**Validation Rules**:
- All flags must be `true` before marking feature done.
- `themeTokenMigrationComplete` requires 0 intentional hardcoded color values in welcome styles.

## State Transitions

1. **Legacy -> Refactor In Progress**: Component template/style split and cleanup begin.
2. **Refactor In Progress -> Tokenized Theme**: Visual roles mapped to Material tokens.
3. **Tokenized Theme -> Verified Responsive**: Mobile/desktop behavior validated.
4. **Verified Responsive -> Completed**: Tests and manual checks confirm no content/routing regressions.
