# Contract: Navigation Card Mapping

## Purpose

Specify typed mapping from normalized sidebar entries to Home card models.

## Input contract

Uses existing normalized menu contracts:
- `SidebarMenuItem`
- `SidebarMenuChildItem`

Auth visibility must already be applied before mapping.

## Output contract

### HomeFeatureCard

```ts
interface HomeFeatureCard {
  readonly id: string;
  readonly label: string;
  readonly route: string;
  readonly icon: string | null;
  readonly source: 'top-level' | 'child';
  readonly parentId: string | null;
  readonly order: number;
}
```

### HomeFeatureGroup

```ts
interface HomeFeatureGroup {
  readonly id: string;
  readonly label: string;
  readonly icon: string | null;
  readonly order: number;
  readonly children: ReadonlyArray<HomeFeatureCard>;
  readonly initiallyExpanded: boolean;
}
```

### HomeFeatureCollectionState

```ts
interface HomeFeatureCollectionState {
  readonly status: 'ready' | 'empty' | 'error';
  readonly directCards: ReadonlyArray<HomeFeatureCard>;
  readonly groups: ReadonlyArray<HomeFeatureGroup>;
  readonly errorMessage: string | null;
}
```

## Mapping constraints

- Top-level leaf item (`route != null`) maps to `directCards`.
- Top-level parent item (`route == null` and children present) maps to `groups`.
- Group child cards must have `source: 'child'` and `parentId` equal to parent id.
- Preserve order values from input.
- Exclude any group with zero visible children.

## Error behavior

- If upstream menu load status is error, output state must be:
- `status: 'error'`
- empty `directCards` and `groups`
- non-null `errorMessage`
