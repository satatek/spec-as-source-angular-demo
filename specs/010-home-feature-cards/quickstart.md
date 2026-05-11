# Quickstart: Home Feature Cards

## Objective

Rebuild existing Home feature to render cards from sidebar menu data and support parent collapse panels with child cards.

## Prerequisites

- Existing menu loader and menu visibility filtering are already present in layout layer.
- Angular Material components available in project.

## Implementation steps

### 1. Extend Home models

- Add feature-card domain models under `src/app/features/home/home-page.models.ts` or a dedicated `home-feature-cards.models.ts` file.
- Include `HomeFeatureCard`, `HomeFeatureGroup`, and `HomeFeatureCollectionState` types.
- Implement mapper from filtered sidebar menu items to Home view state.

### 2. Rebuild Home component logic

- Replace profile-summary rendering logic with card-oriented state.
- Consume same sidebar source used by shell navigation to avoid drift.
- Surface status variants: ready, empty, error.

### 3. Rebuild Home template

- Render direct feature cards.
- Render parent entries as Material expansion panels.
- Inside expanded panel, render child links as cards.
- Bind each card to destination navigation.

### 4. Style Home page

- Keep Material-based look and responsive layout.
- Ensure card tap targets and keyboard focus are visible.

### 5. Add tests

- Component tests:
- maps leaf and parent entries correctly.
- parent expansion reveals child cards.
- empty and error states are rendered.
- navigation interactions trigger correct routes.
- E2E tests:
- Home shows same visible options as sidebar.
- Clicking top-level and child cards navigates to expected routes.

## Validation checklist

- Home cards and sidebar options remain aligned for authenticated and unauthenticated states.
- Parent entries collapse/expand correctly.
- Child cards are actionable and route correctly.
- Empty/error state text is user-friendly.
- Existing route guards and auth behavior remain intact.

## Validation commands

- Unit/component/integration tests:

	`npm run test -- --watch=false --include=src/app/features/home/home-feature-cards.mapper.spec.ts --include=src/app/features/home/home-page.component.spec.ts --include=src/app/app.routes.spec.ts`

- E2E tests for Home feature cards:

	`npm run test:e2e -- e2e/home-feature-cards.spec.ts`

Notes:
- Playwright browsers must be installed before running e2e: `npx playwright install`
- Authenticated e2e assertions require `KEYCLOAK_E2E_USERNAME` and `KEYCLOAK_E2E_PASSWORD`
