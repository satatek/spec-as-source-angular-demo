# Runtime Contract: Sidebar Menu Configuration

## Endpoint

### `GET /config/sidebar-menu.json`

**Purpose**: Provides runtime navigation configuration for the left sidebar.

**Behavior**:
- Returns one JSON document containing top-level entries and optional level-2 children.
- Is environment-owned content served from the application's public config directory.
- Must be loadable without authentication side effects.

## Payload

```json
{
  "version": "1",
  "items": [
    {
      "id": "home",
      "label": "Home",
      "route": "/home",
      "icon": "dashboard",
      "requiresAuth": true,
      "visibleWhenAuthenticated": true,
      "order": 10,
      "children": null
    },
    {
      "id": "account",
      "label": "Account",
      "route": null,
      "icon": "manage_accounts",
      "requiresAuth": true,
      "visibleWhenAuthenticated": true,
      "order": 20,
      "children": [
        {
          "id": "profile",
          "label": "Profile",
          "route": "/account",
          "icon": "account_circle",
          "requiresAuth": true,
          "visibleWhenAuthenticated": true,
          "order": 10
        }
      ]
    }
  ]
}
```

## Field Rules

- `version`: Required. Non-empty string for contract evolution.
- `items`: Required. Array of top-level menu entries (may be empty).
- Top-level `id`: Required. Unique in top-level scope.
- Top-level `label`: Required. Non-empty.
- Top-level `route`: Optional when `children` exists; required for leaf entries.
- Top-level `children`: Optional. Array of child entries; grandchildren are unsupported.
- Child `id`: Required. Unique within each parent's children array.
- Child `label`: Required. Non-empty.
- Child `route`: Required. App-relative route.
- `visibleWhenAuthenticated`: Allowed values are `true`, `false`, or `null`.
- `order`: Required numeric field used to sort siblings.

## Validation Expectations

- Contract parser must reject entries missing required labels or route rules.
- Contract parser must normalize to at most two levels; any deeper nested fields are ignored.
- Contract parser must guard against duplicate ids within the same level scope.
- On fetch or validation error, the sidebar must enter a non-blocking fallback state with an explanatory message.
