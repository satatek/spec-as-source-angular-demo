# Data Model: Split Application Layout Sections

## LayoutSection

**Purpose**: Represents a structural UI region in the shared shell.

**Fields**:
- `id`: `'header' | 'content' | 'footer'`
- `landmark`: `'header' | 'main' | 'footer'`
- `isShared`: boolean
- `order`: number

**Validation Rules**:
- `id` values MUST be unique per shell instance.
- `order` MUST preserve `header < content < footer`.
- `content` MUST contain router-projected page content.

## ShellNavigationItem

**Purpose**: Represents one navigation entry rendered from the shell.

**Fields**:
- `label`: string
- `route`: string
- `icon`: string | null
- `requiresAuth`: boolean
- `visibleWhenAuthenticated`: boolean | null

**Validation Rules**:
- `route` MUST be app-relative and correspond to an existing route.
- `label` MUST be non-empty and user-readable.
- `requiresAuth` MUST align with route guard policy.

## ShellLayoutState

**Purpose**: Represents current responsive behavior and drawer state.

**Fields**:
- `mode`: `'side' | 'over'`
- `opened`: boolean
- `isMobile`: boolean

**Validation Rules**:
- `mode` MUST be `side` when `isMobile` is false.
- `mode` SHOULD be `over` when `isMobile` is true.
- `opened` MUST become false after route selection in mobile mode.

**State Transitions**:
- `desktop -> mobile`: set `mode=over`, collapse drawer by default.
- `mobile -> desktop`: set `mode=side`, keep drawer open by default.
- `mobile drawer open -> route selected`: close drawer after navigation.
