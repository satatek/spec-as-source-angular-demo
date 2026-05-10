# Research: Digital Clock with Timezone in Top Menu

## Decision 1: Use a feature-local reactive clock service driven by RxJS

**Decision**: Implement a `HeaderClockService` in the layout feature that emits current time every second using `interval(1000)` with immediate initial emission.

**Rationale**: This keeps time logic out of templates, aligns with Angular reactive patterns, and provides a single source for clock and timezone formatting.

**Alternatives considered**:
- Using `setInterval` directly in component: rejected due to lifecycle cleanup risk and reduced testability.
- Updating time with CSS/animation only: rejected because timezone text and precise second boundaries still require JavaScript state.

## Decision 2: Format time and timezone through `Intl.DateTimeFormat`

**Decision**: Use `Intl.DateTimeFormat` for `HH:mm:ss` and short timezone abbreviation; fallback to `UTC` label when abbreviation is unavailable.

**Rationale**: Native browser internationalization is reliable for timezone handling and daylight-saving transitions without external dependencies.

**Alternatives considered**:
- Custom timezone parser: rejected due to complexity and regional edge cases.
- Third-party date library: rejected because native APIs satisfy current scope with lower bundle cost.

## Decision 3: Apply responsive visibility at 768px with Angular CDK BreakpointObserver + CSS guard

**Decision**: Determine visibility with `BreakpointObserver` (`(min-width: 768px)`) and keep CSS fallback (`display: none` under 768px).

**Rationale**: This satisfies explicit responsive behavior in the spec and avoids rendering jitter during resize while preserving graceful styling fallback.

**Alternatives considered**:
- CSS-only media query: rejected because functional visibility logic is needed in tests and template conditions.
- JavaScript `window.innerWidth` polling: rejected for poorer Angular integration and maintainability.

## Decision 4: Keep clock centered with a dedicated toolbar center slot

**Decision**: Introduce a structural center container in the top toolbar with absolute center alignment and pointer-events disabled for non-interactive clock text.

**Rationale**: Ensures visual centering independent of variable-width left/right controls (menu toggle, profile actions).

**Alternatives considered**:
- Flex-only centering with spacers: rejected because dynamic right profile content can shift center text off true center.
- Separate row for clock: rejected because requirement demands clock inside top menu.

## Decision 5: Use Angular Material theme tokens and a digital-style font stack

**Decision**: Style clock with Material system tokens (`--mat-sys-*`) and a digital font stack fallback (`'Roboto Mono', 'Courier New', monospace`) to create futuristic digits while preserving default Material theme colors.

**Rationale**: Meets user-requested futuristic style without forking theme colors or violating Material theming best practices.

**Alternatives considered**:
- Hardcoded neon colors/background panel: rejected because it diverges from default theme and harms consistency.
- Webfont-only dependency: rejected due to runtime dependency risk; keep resilient fallback stack.

## Decision 6: Validate at component and e2e boundaries

**Decision**: Add/adjust component tests for ticking updates, timezone rendering, and responsive visibility; add e2e assertion that clock appears at >=768px and is hidden below 768px.

**Rationale**: These are the lowest-cost tests that prove core behavior and protect against regressions.

**Alternatives considered**:
- Unit tests for formatting only: rejected because layout visibility behavior would remain unverified.
- E2E-only coverage: rejected as slower and less precise for edge-state validation.
