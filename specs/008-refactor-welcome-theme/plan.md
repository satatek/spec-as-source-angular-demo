# Implementation Plan: Refactor Welcome Page with Default Material Theme Colors

**Branch**: `008-refactor-welcome-theme` | **Date**: 2026-05-09 | **Spec**: [specs/008-refactor-welcome-theme/spec.md](specs/008-refactor-welcome-theme/spec.md)
**Input**: Feature specification from `/specs/008-refactor-welcome-theme/spec.md`

## Summary

Refactor the welcome page structure and styles to use Angular Material default theme semantics end-to-end, removing hardcoded custom palette values and preserving welcome-page behavior, responsiveness, and readability. The implementation follows usability best practices: clear visual hierarchy through surface roles, consistent typography, predictable responsive flow, and accessibility-safe contrast pairings.

## Technical Context

**Language/Version**: TypeScript 5.9.x, Angular 21.x  
**Primary Dependencies**: Angular standalone components, Angular Router, Angular Material 21 (`mat-card`, `mat-button`, `mat-progress-bar`)  
**Storage**: N/A  
**Testing**: Angular unit/component tests (`npm test`) with welcome-page component regression coverage  
**Target Platform**: Modern web browsers, responsive web app  
**Project Type**: Angular single application frontend  
**Performance Goals**: No perceptible regression in render responsiveness; keep CSS simple and token-driven  
**Constraints**: Strict typing, accessibility readability, preserve routing/behavior, use default Angular Material theme colors only  
**Scale/Scope**: `src/app/features/welcome/` component files plus related tests; no cross-feature redesign

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec First, Always**: PASS. Implementation slices map to FR-001..FR-006 and both P1 stories in [specs/008-refactor-welcome-theme/spec.md](specs/008-refactor-welcome-theme/spec.md).
- **Angular-Idiomatic by Default**: PASS. Scope remains a standalone Angular feature component with Material primitives and no framework mixing.
- **Strong Typing and Contracts**: PASS. UI/theme mappings and welcome-surface contract documented in [specs/008-refactor-welcome-theme/data-model.md](specs/008-refactor-welcome-theme/data-model.md) and [specs/008-refactor-welcome-theme/contracts/ui-contract.md](specs/008-refactor-welcome-theme/contracts/ui-contract.md).
- **Test at the Right Level**: PASS. Component-level regression coverage chosen as lowest-cost proof of behavior/render integrity.
- **Architectural Simplicity**: PASS. Feature-local refactor only; no new shared state or abstraction layers.

**Post-Design Re-check**: PASS. Design artifacts keep scope contained, typed, and aligned with constitution constraints.

## Project Structure

### Documentation (this feature)

```text
specs/008-refactor-welcome-theme/
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
│   └── features/
│       └── welcome/
│           ├── welcome-page.component.ts
│           ├── welcome-page.component.html
│           ├── welcome-page.component.scss
│           ├── welcome-page.component.spec.ts
│           └── welcome-page.facade.ts
└── styles.scss
```

**Structure Decision**: Keep all implementation localized to the existing `welcome` feature folder. No new global styling layer is introduced because this change is feature-scoped.

## Phase 0: Research Output

Research completed in [specs/008-refactor-welcome-theme/research.md](specs/008-refactor-welcome-theme/research.md), covering usability and design best practices for Angular Material themed surfaces, readable hierarchy, responsive layout flow, and safe token-based styling.

## Phase 1: Design & Contracts Output

- Data model defined in [specs/008-refactor-welcome-theme/data-model.md](specs/008-refactor-welcome-theme/data-model.md)
- UI contract defined in [specs/008-refactor-welcome-theme/contracts/ui-contract.md](specs/008-refactor-welcome-theme/contracts/ui-contract.md)
- Implementation and validation flow documented in [specs/008-refactor-welcome-theme/quickstart.md](specs/008-refactor-welcome-theme/quickstart.md)

## Phase 2 Preview (for /speckit.tasks)

1. Refactor welcome template/styles to remove custom hardcoded palette usage.
2. Map welcome visual regions to Material surface/on-surface token roles.
3. Preserve component behavior and route flow with no functional regressions.
4. Add/update component tests for render and interaction non-regression.
5. Validate responsiveness and readability across viewport sizes.

## Complexity Tracking

No constitutional violations identified.
