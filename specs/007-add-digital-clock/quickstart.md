# Quickstart: Digital Clock with Timezone in Top Menu

## Prerequisites

- Node.js and npm installed
- Dependencies installed with `npm install`
- Feature context prepared for `007-add-digital-clock`

## Implementation Steps

1. Create a feature-local clock service in `src/app/layout/`:
   - Emit current time every second.
   - Expose formatted `timeText` and `timezoneText`.
   - Prefer server timezone when present, otherwise browser timezone.
2. Integrate clock state into `app-shell.component.ts`:
   - Subscribe/react using Angular signals or RxJS interop.
   - Add a `showClock` state driven by `BreakpointObserver` at `768px`.
3. Update `app-shell.component.html`:
   - Add a dedicated centered toolbar slot for clock output.
   - Ensure clock markup is conditionally rendered only when `showClock` is true.
4. Update `app-shell.component.scss`:
   - Keep default Angular Material theme token colors.
   - Apply futuristic digital typography using monospace stack.
   - Preserve responsive behavior and avoid overlap with existing toolbar controls.
5. Add tests:
   - Component tests for ticker updates and visibility breakpoint behavior.
   - e2e coverage for visible/hidden states and centered placement.

## Validation Steps

1. Run unit/component tests:

```bash
npm test -- --watch=false
```

2. Run build:

```bash
npm run build
```

3. Run e2e targeted checks (when Playwright deps are available):

```bash
npm run test:e2e -- e2e/header-clock.spec.ts
```

## Expected Outcome

- Users see a centered digital clock with timezone in the top menu at `>= 768px`.
- Clock hides automatically below `768px` without breaking top-menu layout.
- Clock updates every second and reflects timezone correctly.
- Styling stays consistent with Angular Material default theme while using a futuristic digital number appearance.

## Validation Notes

- `npm test -- --watch=false`: PASS (13 test files passed, 55 tests passed)
- `npm run build`: PASS with existing bundle budget warning (`initial` exceeded: 599.07 kB > 500.00 kB)
- `npm run test:e2e -- e2e/header-clock.spec.ts`: FAIL in this environment because Playwright Chromium cannot start without `libnspr4.so`
