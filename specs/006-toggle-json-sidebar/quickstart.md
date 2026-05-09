# Quickstart: Dynamic JSON Sidebar Menu

## Prerequisites

- Node.js and npm installed
- Dependencies installed with `npm install`
- Feature branch checked out for `006-toggle-json-sidebar`

## Runtime Configuration Setup

1. Add a runtime menu file at `public/config/sidebar-menu.json`.
2. Define top-level items and optional child items (maximum two levels).
3. Ensure each leaf item has an app-relative `route` and stable `id`.

Example starter payload:

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
      "children": null,
      "order": 10
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

## Implementation Steps

1. Add typed menu contracts in shell-local models.
2. Implement a menu loader that fetches and validates `/config/sidebar-menu.json`.
3. Replace static `SHELL_NAV_ITEMS` consumption with loaded menu view state.
4. Render parent and child entries with Angular Material navigation patterns.
5. Preserve existing sidebar toggle behavior and responsive close-on-navigation behavior.
6. Add fallback rendering for missing/invalid config while keeping content usable.

## Validation Steps

1. Run `npm test -- --watch=false` and verify shell tests for:
   - toggle visibility behavior
   - two-level rendering and expand/collapse behavior
   - valid/invalid JSON handling
   - authenticated/anonymous visibility filtering
2. Run `npm start` and manually verify:
   - sidebar can be shown/hidden on demand
   - JSON updates are reflected on reload
   - child entries navigate correctly
   - fallback message appears for bad config without blocking content
3. Run `npm run build` to ensure no regressions in build output.
4. Run `npm run test:e2e -- e2e/sidebar-menu.spec.ts` for sidebar smoke coverage when Playwright system dependencies are installed.

## Expected Outcome

- Sidebar navigation is runtime-configurable from `public/config/sidebar-menu.json`.
- Users can toggle sidebar visibility reliably across mobile and desktop.
- Two-level menu behavior remains accessible and consistent with Angular Material UI conventions.
- Invalid config scenarios degrade gracefully without breaking the application shell.

## Validation Notes

- `npm test -- --watch=false`: PASS (49 tests passed across 12 test files).
- `npm run build`: PASS with existing bundle-size warning (`initial` budget exceeded by ~86.76 kB).
- `npm run test:e2e -- e2e/sidebar-menu.spec.ts`: FAIL in this environment because Chromium headless shell cannot start without `libnspr4` (`error while loading shared libraries: libnspr4.so`).
