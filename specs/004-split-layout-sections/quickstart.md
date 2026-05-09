# Quickstart: Split Application Layout Sections

## Prerequisites

- Node.js and npm installed locally
- Dependencies installed with `npm install`
- Existing routes and auth guard flow available in the project

## Implement the Shared Shell

1. Create `src/app/layout/` and add a standalone shell component with:
   - `mat-toolbar` in the header region
   - `mat-sidenav-container` with navigation and `router-outlet` in content
   - Footer region in normal page flow
2. Add a typed navigation model (for example `shell-navigation.models.ts`) to
   keep route labels and visibility rules explicit.
3. Apply responsive behavior using `BreakpointObserver`:
   - Desktop: `mode='side'`, opened drawer
   - Mobile: `mode='over'`, toggle drawer from header button
4. Add semantic landmarks in markup (`header`, `nav`, `main`, `footer`) and
   ensure keyboard access for toggle and menu actions.

## Wire Routes

1. Update `src/app/app.routes.ts` so primary routes are children of the shell route.
2. Keep existing route guard declarations unchanged for protected routes.
3. Keep wildcard behavior consistent with current navigation expectations.

## Verify Behavior

1. Run `npm test -- --watch=false` and verify shell tests pass.
2. Run `npm start` and manually validate:
   - Header/content/footer appears on in-scope routes
   - Route transitions update only content area
   - Mobile drawer opens/closes correctly
   - Guarded route behavior is unchanged
3. Run `npm run build` to ensure no compilation regressions.

## Validation Status (2026-05-08)

- `npm test -- --watch=false`: PASS (39 tests, 10 files)
- `npm run build`: PASS with warning (initial bundle budget exceeded by 43.57 kB)
