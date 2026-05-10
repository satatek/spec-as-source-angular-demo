# Quickstart: Refactor Welcome Page to Default Angular Material Theme

## Prerequisites

- Node.js and npm installed
- Dependencies installed with `npm install`
- Feature context set to `008-refactor-welcome-theme`

## Implementation Steps

### Baseline Behavior Notes (Pre-Refactor)

- Welcome route renders two content cards (hero and details) under app shell.
- Authenticated users are redirected to a sanitized internal target.
- Error state renders a dismissible status banner with polite live-region semantics.
- Checking state renders an indeterminate Material progress bar.

1. Inspect welcome feature files:
   - `src/app/features/welcome/welcome-page.component.ts`
   - `src/app/features/welcome/welcome-page.component.html`
   - `src/app/features/welcome/welcome-page.component.scss`
2. Refactor welcome page structure for clarity while preserving content and route behavior.
3. Replace hardcoded color values with Angular Material theme tokens.
4. Keep Material components (`mat-card`, `mat-progress-bar`, Material buttons) and avoid deep private-class overrides.
5. Verify responsive behavior at mobile and desktop widths.
6. Update component tests to cover non-regression and render integrity.

## Test Validation Strategy

- Component-level regression tests are the primary safety net for this refactor.
- Required checks:
   - themed structure and content order stability
   - status banner accessibility attributes (`role=status`, `aria-live=polite`)
   - checking-state progress feedback
   - redirect behavior for authenticated users and unsafe redirect input sanitization
- Execute:
   - `npm test -- --watch=false --include src/app/features/welcome/welcome-page.component.spec.ts`
   - `npm run build`

## Validation Steps

1. Run component/unit tests:

```bash
npm test -- --watch=false
```

2. Run production build:

```bash
npm run build
```

3. Manually verify welcome route:

- Theme consistency with default Angular Material colors
- Readability/contrast on hero and secondary sections
- Responsive layout at narrow and wide widths

## Expected Outcome

- Welcome page styling aligns with default Angular Material theme roles.
- Legacy hardcoded welcome palette is removed.
- Content, accessibility, and route behavior remain unchanged.
- Component-level regression checks pass.

## Completion Evidence

- Targeted component test suite: PASS (8 tests)
- Production build: PASS (bundle budget warning only)
- Hardcoded color scan in welcome HTML/SCSS: PASS (no matches)
