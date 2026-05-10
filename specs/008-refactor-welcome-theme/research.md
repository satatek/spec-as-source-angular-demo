# Research: Welcome Page Refactor with Default Angular Material Theme

## Decision 1: Replace hardcoded colors with Material system tokens

**Decision**: Refactor `welcome-page.component.scss` to use Angular Material system color tokens (`--mat-sys-surface`, `--mat-sys-on-surface`, `--mat-sys-surface-container*`, `--mat-sys-outline-variant`) instead of custom hex palette.

**Rationale**: Angular Material theming guidance recommends token-driven styling for consistency, maintainability, and compatibility across theme evolution.

**Alternatives considered**:
- Keep existing hex values and partially map accents: rejected because it preserves drift from system theme.
- Introduce a custom secondary local palette: rejected because request is to use default theme colors.

## Decision 2: Preserve semantic hierarchy through Material surface roles

**Decision**: Map page background to `surface`, cards/sections to `surface-container` variants, and muted text to `on-surface-variant`.

**Rationale**: Material 3 color-role guidance emphasizes pairing/layering of surface and on-surface roles to maintain readable hierarchy and accessible contrast.

**Alternatives considered**:
- Flat single-surface background for all blocks: rejected because it reduces hierarchy and scannability.
- Highly emphasized accent containers for all sections: rejected due to unnecessary visual noise.

## Decision 3: Keep layout responsive with simple content-first structure

**Decision**: Maintain a single-column centered layout with responsive spacing (`clamp`) and avoid brittle pixel-perfect positioning.

**Rationale**: Welcome pages are content-first surfaces; adaptive spacing and straightforward flow produce stable mobile/desktop behavior with lower regression risk.

**Alternatives considered**:
- Multi-column hero composition: rejected as over-scoped for this refactor.
- Complex decorative layers/animations: rejected to keep focus on readability and maintainability.

## Decision 4: Use Angular Material primitives as-is, avoid deep overrides

**Decision**: Continue using `mat-card`, `mat-progress-bar`, and Material buttons with minimal component-level adjustments, avoiding deep CSS overrides of internal Material classes.

**Rationale**: Angular Material docs discourage direct style overrides of private DOM/classes and recommend token/mixin APIs for stable customization.

**Alternatives considered**:
- `::ng-deep` customizations on card internals: rejected due to fragility.
- Replacing Material components with custom equivalents: rejected due to unnecessary complexity.

## Decision 5: Validate refactor at component-test level first

**Decision**: Update/extend `welcome-page.component.spec.ts` to verify key content integrity and non-regression of behavior while style source changes occur.

**Rationale**: Component tests are the lowest-cost layer to catch structural regressions for this UI-focused change.

**Alternatives considered**:
- E2E-only validation: rejected due to slower feedback for styling/layout refactor.
- No additional tests: rejected per constitution quality gate.

## Decision 6: Align typography with existing theme defaults

**Decision**: Use existing theme typography tokens/fonts from global theme setup and avoid introducing a page-specific typography scheme.

**Rationale**: The welcome page should look native to the app’s default Angular Material appearance and avoid local style drift.

**Alternatives considered**:
- Decorative custom font family for hero section: rejected as inconsistent with default-themed requirement.
