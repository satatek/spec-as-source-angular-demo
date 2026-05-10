# Implementation Plan: Add Digital Clock with Timezone to Top Menu

**Branch**: `main` | **Date**: 2026-05-09 | **Spec**: [specs/007-add-digital-clock/spec.md](specs/007-add-digital-clock/spec.md)
**Input**: Feature specification from `/specs/007-add-digital-clock/spec.md`

## Summary

Add a centered, real-time digital clock (`HH:mm:ss`) with timezone to the shared Angular Material top toolbar. The clock is visible only for viewport widths `>= 768px`, hidden on mobile, and styled with futuristic digital numerals using a monospace stack while preserving the default Angular Material theme tokens and component behavior.

## Technical Context

**Language/Version**: TypeScript 5.9.x, Angular 21.x  
**Primary Dependencies**: Angular core/common/router, RxJS 7.8, Angular Material 21, Angular CDK BreakpointObserver  
**Storage**: N/A  
**Testing**: Angular unit/component tests (`npm test`), Playwright e2e (`npm run test:e2e`)  
**Target Platform**: Modern web browsers, responsive web app  
**Project Type**: Angular single-application frontend  
**Performance Goals**: 1-second ticker updates with no visible jitter; no toolbar layout shifts during resize  
**Constraints**: Strict typing enabled, accessible toolbar interactions, default Angular Material theme usage, responsive threshold exactly 768px  
**Scale/Scope**: Shared shell header only; one new clock service/state path; updates to shell template/styles/tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec First, Always**: PASS. Planned implementation maps directly to FR-001..FR-008 and both P1 stories in [specs/007-add-digital-clock/spec.md](specs/007-add-digital-clock/spec.md).
- **Angular-Idiomatic by Default**: PASS. Plan uses standalone shell component updates, DI service, RxJS/Signal-friendly state, and Angular CDK breakpoints.
- **Strong Typing and Contracts**: PASS. Typed view model/service contracts documented in [specs/007-add-digital-clock/data-model.md](specs/007-add-digital-clock/data-model.md) and UI behavior contract in [specs/007-add-digital-clock/contracts/ui-contract.md](specs/007-add-digital-clock/contracts/ui-contract.md).
- **Test at the Right Level**: PASS. Component tests for ticker/visibility behavior + e2e responsive assertions for top-menu integration.
- **Architectural Simplicity**: PASS. Feature-local service and shell changes only; no new shared state containers or unnecessary layers.

**Post-Design Re-check**: PASS. Phase 1 artifacts remain compliant; no justified violations required.

## Project Structure

### Documentation (this feature)

```text
specs/007-add-digital-clock/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md  # created later by /speckit.tasks
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout/
│   │   ├── app-shell.component.ts
│   │   ├── app-shell.component.html
│   │   ├── app-shell.component.scss
│   │   └── header-clock.service.ts (new)
│   └── ...
├── styles.scss
└── assets/

e2e/
└── ...
```

**Structure Decision**: Use the existing Angular single-application structure and keep all implementation localized to `src/app/layout` because the clock is a shell-header feature with one immediate consumer.

## Phase 0: Research Output

Research completed in [specs/007-add-digital-clock/research.md](specs/007-add-digital-clock/research.md) resolving formatting, timezone source/fallback, breakpoint behavior, centered-layout strategy, and Angular Material theming constraints.

## Phase 1: Design & Contracts Output

- Data model defined in [specs/007-add-digital-clock/data-model.md](specs/007-add-digital-clock/data-model.md)
- UI contract defined in [specs/007-add-digital-clock/contracts/ui-contract.md](specs/007-add-digital-clock/contracts/ui-contract.md)
- Implementation and validation path documented in [specs/007-add-digital-clock/quickstart.md](specs/007-add-digital-clock/quickstart.md)

## Phase 2 Preview (for /speckit.tasks)

1. Create `header-clock.service.ts` with typed clock stream and timezone resolver.
2. Integrate reactive clock state into `app-shell.component.ts`.
3. Add centered clock slot and conditional rendering to `app-shell.component.html`.
4. Add Material-token-based digital styling to `app-shell.component.scss`.
5. Add/update component tests for ticking, timezone text, and 768px visibility threshold.
6. Add/update e2e assertions for responsive visibility and non-overlap in toolbar.

## Complexity Tracking

No constitutional violations identified.
