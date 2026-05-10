# UI Contract: Welcome Page with Default Angular Material Theme

## Scope

Applies to the welcome route surface rendered by `WelcomePageComponent`.

## Structural Contract

- Welcome page keeps a content-first, centered layout with hero and supporting sections.
- Existing semantic content and message intent remain preserved after refactor.
- No additional global page landmarks (`header`, `nav`, `footer`) are introduced inside the welcome component.

## Theme Contract

- Welcome page colors MUST come from Angular Material default theme semantics.
- Surface areas MUST use surface/container role hierarchy rather than custom palette colors.
- Text and icon colors MUST use compatible on-surface roles.
- Decorative and divider boundaries should use Material outline roles where needed.

### Selector-to-Token Mapping Checklist

- `.welcome-page`: `--mat-sys-surface` (page background)
- `.hero-card`: `--mat-sys-surface-container-low` + `--mat-sys-on-surface` + `--mat-sys-outline-variant`
- `.details-card`: `--mat-sys-surface-container-low` + `--mat-sys-on-surface` + `--mat-sys-outline-variant`
- `.eyebrow`: `--mat-sys-primary`
- `.supporting-copy`: `--mat-sys-on-surface-variant`
- `.status-banner`: `--mat-sys-surface-container-high` + `--mat-sys-on-surface` + `--mat-sys-outline-variant`
- `ol` content: `--mat-sys-on-surface-variant`

## Interaction Contract

- Existing welcome interactions (status/dismiss feedback and any route-safe actions) remain functional.
- Refactor MUST NOT change navigation behavior or redirect behavior for authenticated users.

## Responsive Contract

- Layout remains readable and functional on mobile and desktop widths.
- Content blocks must avoid clipping/overlap on narrow viewports.

## Accessibility Contract

- Text contrast remains sufficient against applied themed surfaces.
- Focus-visible behavior remains intact for interactive controls.
- Live region messaging for status remains perceivable.

## Test Coverage Contract

- Component tests verify content integrity and route behavior remain stable.
- Component tests (or style assertions where feasible) verify themed class/token application for major containers.
