# Data Model: Home Feature Cards

## Overview

Home feature cards are derived from runtime sidebar menu entries after authentication visibility filtering. The model separates direct feature cards from grouped parent panels that contain child feature cards.

## Entities

### HomeFeatureCard

Represents a clickable card that routes to one feature destination.

Fields:
- `id: string` unique stable identifier.
- `label: string` card title shown to users.
- `route: string` app-relative destination path.
- `icon: string | null` optional Material icon name.
- `source: 'top-level' | 'child'` indicates whether card originated from top-level entry or parent child.
- `parentId: string | null` parent identifier for child cards.
- `order: number` display ordering.

Validation rules:
- `id`, `label`, and `route` must be non-empty.
- `route` must start with `/`.
- `order` must be finite.

### HomeFeatureGroup

Represents a parent feature displayed as a collapse panel.

Fields:
- `id: string` parent feature identifier.
- `label: string` panel header label.
- `icon: string | null` optional icon for header.
- `order: number` display ordering.
- `children: ReadonlyArray<HomeFeatureCard>` child feature cards.
- `initiallyExpanded: boolean` initial panel state.

Validation rules:
- Parent groups must have at least one child card.
- Child cards inside a group must be sorted by `order`.

### HomeFeatureCollectionState

Represents full page state for Home card rendering.

Fields:
- `status: 'ready' | 'empty' | 'error'` rendering mode.
- `directCards: ReadonlyArray<HomeFeatureCard>` top-level leaf cards.
- `groups: ReadonlyArray<HomeFeatureGroup>` grouped parent panels.
- `errorMessage: string | null` user-facing error text for error mode.

State transitions:
1. Initial loading: resolved by existing menu loader behavior.
2. Ready: at least one direct card or one group with children.
3. Empty: no visible items after auth filtering.
4. Error: menu loading/parsing failure.

## Relationships

- A `HomeFeatureCollectionState` contains zero or more `HomeFeatureCard` and zero or more `HomeFeatureGroup`.
- A `HomeFeatureGroup` contains one or more child `HomeFeatureCard`.
- A child `HomeFeatureCard.parentId` references its containing `HomeFeatureGroup.id`.

## Mapping rules from sidebar menu

1. Each visible top-level item with route becomes one `directCards` entry.
2. Each visible top-level item with children becomes one `groups` entry.
3. Each visible child entry becomes one group child card.
4. Empty parents after auth filtering are excluded.
5. Relative order follows sidebar `order` at both levels.
