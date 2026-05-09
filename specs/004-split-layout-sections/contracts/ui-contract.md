# UI Contract: Shared Layout Shell (Header, Content, Footer)

## Routes

### `GET /`

**Purpose**: Render the welcome page inside the shared shell.

**Access**:
- Public route.

**Required UI Elements**:
- Header region with app identity and navigation trigger.
- Content region with welcome page content via router outlet.
- Footer region with shared static/support information.

### `GET /home`

**Purpose**: Render the authenticated home page inside the shared shell.

**Access**:
- Authenticated users only via existing route guard.

**Required UI Elements**:
- Same shared header/footer regions used by `/`.
- Content region with authenticated home content via router outlet.

## Layout Contract

- The shell MUST render regions in this order: header -> content -> footer.
- Route-specific views MUST render only in the content region.
- Header/footer shared components MUST NOT be duplicated in feature page templates.
- Footer MUST remain in normal flow and avoid overlap with content.

## Responsive Navigation Contract

- Desktop behavior: sidenav mode `side`, visible by default.
- Mobile behavior: sidenav mode `over`, hidden by default, toggleable from header.
- In mobile mode, selecting a navigation entry closes the sidenav after route navigation.
- Navigation source of truth is a typed shell navigation model with shared items for `Welcome` and authenticated-only `Home`.

## Accessibility Contract

- Header, nav, main, and footer landmarks MUST be present in shell markup.
- Sidenav toggle MUST be keyboard accessible and expose an accessible label.
- Focus flow MUST remain predictable when opening/closing mobile sidenav.

## Test Coverage Contract

- Component tests MUST verify shell region order and visibility.
- Integration tests MUST verify route child projection into content region.
- Responsive tests MUST verify sidenav mode and open/close behavior across breakpoints.
- Guard regression tests MUST verify `/home` access control remains intact.
- Content-page tests MUST verify feature templates remain content-only and do not duplicate `header`, `nav`, or `footer` shell landmarks.
