# Implementation Plan: Home Feature Cards

**Branch**: `010-next-feature-branch` | **Date**: 2026-05-10 | **Spec**: [specs/010-home-feature-cards/spec.md](../spec.md)
**Input**: Feature specification from `/specs/010-home-feature-cards/spec.md`

## Summary

Rebuild the existing Home page to present feature navigation as cards sourced from the same sidebar menu data used by shell navigation. Top-level leaf features become direct cards. Top-level parent features become collapse panels, and expanded panels reveal child entries as clickable cards that route to each child destination.

## Technical Context

**Language/Version**: TypeScript 5.x, Angular 21.x  
**Primary Dependencies**: Angular standalone components, Angular Router, Angular Material (card/expansion), RxJS, existing shell menu loader/model contracts  
**Storage**: N/A (runtime config only via `public/config/sidebar-menu.json`)  
**Testing**: Angular unit/component tests + route/integration tests + Playwright e2e  
**Target Platform**: Modern web browsers, responsive web app
**Project Type**: Angular single-application frontend  
**Performance Goals**: Home render remains within existing route baseline and card interactions navigate without perceptible delay (<200ms local)  
**Constraints**: Strict typing, accessibility for cards and expansion interactions, parity with sidebar visibility rules, no duplicate menu parsing logic  
**Scale/Scope**: One feature page rebuild (`home`) with top-level + nested menu support and status states (ready/empty/error)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Spec First, Always**
- FR-001/FR-005 map to Home card rendering and interaction.
- FR-002/FR-004 map to shared source-of-truth menu mapping.
- FR-003/FR-007 map to navigation and route-failure behavior.
- FR-006 maps to explicit empty state handling.
- FR-008 maps to responsive card and panel behavior.

✅ **Angular-Idiomatic by Default**
- Uses standalone Home component, Angular Router navigation, Angular Material components, and existing DI-based menu loading.
- No framework mixing or custom routing wrappers.

✅ **Strong Typing and Contracts**
- Typed contracts for `HomeFeatureCard`, `HomeFeatureGroup`, and `HomeFeatureCollectionState`.
- Mapping contract references `SidebarMenuItem` and `SidebarMenuChildItem` as canonical input.

✅ **Test at the Right Level**
- Component tests for mapping/rendering/expand interactions.
- Integration tests for parity with sidebar-derived visibility.
- E2E tests for navigation from direct and child cards.

✅ **Architectural Simplicity**
- Feature-local mapper and view model in Home feature.
- Reuses existing shell menu source and avoids new shared state containers.

## Project Structure

### Documentation (this feature)

```text
specs/010-home-feature-cards/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── navigation-card.contract.md
│   └── ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── features/
│   │   └── home/
│   │       ├── home-page.component.ts
│   │       ├── home-page.component.html
│   │       ├── home-page.component.scss
│   │       ├── home-page.component.spec.ts
│   │       └── home-page.models.ts
│   ├── layout/
│   │   ├── shell-menu-config.loader.ts
│   │   ├── shell-menu.models.ts
│   │   └── shell-navigation.models.ts
│   └── app.routes.ts
└── ...

public/
└── config/
    └── sidebar-menu.json

e2e/
└── (home/navigation related specs)
```

**Structure Decision**: Keep all implementation local to `src/app/features/home` while reusing existing normalized and auth-filtered menu contracts from `src/app/layout`. No additional shared abstraction is required in this phase.

## Complexity Tracking

| Item | Status | Rationale |
|------|--------|-----------|
| No violations | ✅ PASS | Existing layout contracts already provide normalized menu input; feature-local mapping is sufficient and simplest |

---

## Phase 0: Research Completed

Output file: `specs/010-home-feature-cards/research.md`

Resolved items:
- Source-of-truth alignment with sidebar menu loading and filtering.
- Parent-collapse and child-card rendering behavior.
- Router-based card navigation strategy.
- Empty and error state behavior.
- Test layering and parity checks.

All technical clarifications resolved. No remaining `NEEDS CLARIFICATION` markers.

## Phase 1: Design & Contracts Completed

Output files:
- `specs/010-home-feature-cards/data-model.md`
- `specs/010-home-feature-cards/contracts/navigation-card.contract.md`
- `specs/010-home-feature-cards/contracts/ui-contract.md`
- `specs/010-home-feature-cards/quickstart.md`

Design highlights:
- `HomeFeatureCard` captures both top-level leaf and child card targets.
- `HomeFeatureGroup` models parent entries as expansion panel groups.
- `HomeFeatureCollectionState` supports ready, empty, and error states.
- UI contract defines click, keyboard, expansion, and navigation expectations.

### Post-Design Constitution Re-check

✅ Spec traceability maintained
✅ Angular-native approach maintained
✅ Typed contracts defined
✅ Test levels matched to behavior
✅ No unnecessary architecture introduced

## Next Command

Use `/speckit.tasks` to generate dependency-ordered implementation tasks.
