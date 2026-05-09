# Data Model: Dynamic JSON Sidebar Menu

## SidebarMenuConfig

**Purpose**: Represents the runtime payload loaded from `public/config/sidebar-menu.json`.

**Fields**:
- `version`: string
- `items`: SidebarMenuItem[]

**Validation Rules**:
- `version` is required and non-empty.
- `items` is required and may be empty.
- Configuration must not contain effective depth beyond two levels.

## SidebarMenuItem

**Purpose**: Represents one first-level or second-level menu entry.

**Fields**:
- `id`: string
- `label`: string
- `route`: string | null
- `icon`: string | null
- `requiresAuth`: boolean
- `visibleWhenAuthenticated`: boolean | null
- `children`: SidebarMenuChildItem[] | null
- `order`: number

**Validation Rules**:
- `id` must be unique among all level-1 items and unique within each children array.
- `label` is required and non-empty.
- `route` is required for leaf entries and must be app-relative (starts with `/`).
- Parent entries with `children` may omit `route`.
- `children` may contain only level-2 entries; nested grandchildren are ignored or flattened per FR-010.
- `order` must be a finite numeric value.

## SidebarMenuChildItem

**Purpose**: Represents a level-2 child entry under a parent menu item.

**Fields**:
- `id`: string
- `label`: string
- `route`: string
- `icon`: string | null
- `requiresAuth`: boolean
- `visibleWhenAuthenticated`: boolean | null
- `order`: number

**Validation Rules**:
- `route` is mandatory and must be app-relative.
- `label` is mandatory.
- `order` must be numeric and determines render order within the parent.

## SidebarViewState

**Purpose**: Represents the render-ready state for the shell sidebar.

**Fields**:
- `isOpen`: boolean
- `isMobile`: boolean
- `status`: 'loading' | 'ready' | 'error'
- `items`: SidebarMenuItem[]
- `expandedParentIds`: string[]
- `errorMessage`: string | null

**Validation Rules**:
- `status = 'ready'` requires `items` to be present (can be empty).
- `status = 'error'` requires `errorMessage` to be present.
- `expandedParentIds` must include only parent ids existing in current `items`.

## SidebarFallbackState

**Purpose**: Defines non-blocking behavior when config cannot be loaded or validated.

**Fields**:
- `showFallbackMessage`: boolean
- `fallbackItems`: SidebarMenuItem[]
- `canRetry`: boolean

**Validation Rules**:
- `showFallbackMessage` is true when runtime config fails.
- `fallbackItems` may be empty but must not crash the sidebar rendering logic.
- `canRetry` indicates whether reloading config is exposed in UI/testing flow.
