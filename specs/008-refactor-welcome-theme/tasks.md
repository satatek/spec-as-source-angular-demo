# Tasks: Refactor Welcome Page with Default Material Theme Colors

**Input**: Design documents from `/specs/008-refactor-welcome-theme/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`

**Tests**: Tests are REQUIRED for this feature because the specification explicitly requires automated regression validation (FR-003, FR-004, SC-004, IG-003).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm baseline context and establish task-local implementation safety for the refactor.

- [X] T001 Confirm feature scope and active documents in specs/008-refactor-welcome-theme/plan.md
- [X] T002 Capture current welcome-page baseline behavior notes in specs/008-refactor-welcome-theme/quickstart.md
- [X] T003 [P] Verify global Material token availability in src/styles.scss for welcome page usage

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Prepare shared typed/theming groundwork required by all user stories.

**⚠️ CRITICAL**: No user story work should start before this phase is complete.

- [X] T004 Define selector-to-token mapping checklist for welcome surfaces in specs/008-refactor-welcome-theme/contracts/ui-contract.md
- [X] T005 [P] Record no-hardcoded-color rule and fallback behavior in specs/008-refactor-welcome-theme/data-model.md
- [X] T006 [P] Align welcome test validation strategy with quickstart commands in specs/008-refactor-welcome-theme/quickstart.md

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Themed Welcome Experience (Priority: P1) 🎯 MVP

**Goal**: Make the welcome page use default Angular Material theme colors consistently across surfaces and interactive elements.

**Independent Test**: Open the welcome page and verify major containers, text, and interactive states use Material theme token semantics with no remaining hardcoded custom palette values.

### Tests for User Story 1

- [X] T007 [P] [US1] Add token-usage regression assertions in src/app/features/welcome/welcome-page.component.spec.ts
- [X] T008 [P] [US1] Add content readability/render integrity assertions in src/app/features/welcome/welcome-page.component.spec.ts

### Implementation for User Story 1

- [X] T009 [US1] Refactor themed structure wrappers and semantic regions in src/app/features/welcome/welcome-page.component.html
- [X] T010 [US1] Replace hardcoded palette colors with Material system tokens in src/app/features/welcome/welcome-page.component.scss
- [X] T011 [US1] Align Material component usage and visual semantics in src/app/features/welcome/welcome-page.component.ts
- [X] T012 [US1] Remove obsolete custom color helpers and keep typed surface contract coherent in src/app/features/welcome/welcome-page.facade.ts

**Checkpoint**: User Story 1 is functional and independently testable.

---

## Phase 4: User Story 2 - Safe Refactor Without Behavior Regression (Priority: P1)

**Goal**: Preserve welcome page content order, route behavior, and responsive usability while applying the refactor.

**Independent Test**: Navigate to welcome page on mobile and desktop widths and verify content hierarchy, route load behavior, and interactions remain unchanged.

### Tests for User Story 2

- [X] T013 [P] [US2] Add responsive layout regression tests for narrow/wide viewport behavior in src/app/features/welcome/welcome-page.component.spec.ts
- [X] T014 [P] [US2] Add route/load and interaction non-regression tests in src/app/features/welcome/welcome-page.component.spec.ts

### Implementation for User Story 2

- [X] T015 [US2] Refactor responsive spacing and stacking rules without clipping in src/app/features/welcome/welcome-page.component.scss
- [X] T016 [US2] Preserve section hierarchy and ordering contracts in src/app/features/welcome/welcome-page.component.html
- [X] T017 [US2] Keep welcome route integration unchanged while updating component internals in src/app/app.routes.ts
- [X] T018 [US2] Validate accessibility-related status/live-region behavior remains intact in src/app/features/welcome/welcome-page.component.ts

**Checkpoint**: User Stories 1 and 2 are independently functional and testable.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency checks and cross-story hardening.

- [X] T019 [P] Run full validation workflow from specs/008-refactor-welcome-theme/quickstart.md
- [X] T020 [P] Update feature notes and completion evidence in specs/008-refactor-welcome-theme/quickstart.md
- [X] T021 Verify no residual hardcoded colors remain in welcome feature styles via src/app/features/welcome/welcome-page.component.scss
- [X] T022 Perform focused cleanup of welcome component comments/structure in src/app/features/welcome/welcome-page.component.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 5)**: Depends on completion of both user stories.

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational phase; no dependency on US2.
- **US2 (P1)**: Starts after Foundational phase; should remain independently testable, but verifies behavior after US1 visual refactor.

### Within Each User Story

- Test tasks first (lowest-cost proof and regression safety).
- Template/style/theme contract updates before final route/accessibility verification.
- Complete story and pass independent test criteria before moving on.

### Story Completion Order

1. US1 (Themed Welcome Experience)
2. US2 (Safe Refactor Without Behavior Regression)

---

## Parallel Opportunities

- **Setup**: T003 can run in parallel with T001/T002 once docs are open.
- **Foundational**: T005 and T006 can run in parallel after T004 is started.
- **US1**: T007 and T008 can run in parallel; implementation tasks can be split by file ownership (`.html`, `.scss`, `.ts`/facade) with merge order T009/T010 before T011/T012.
- **US2**: T013 and T014 can run in parallel; T015 and T016 can run in parallel; T017 and T018 finalize behavior checks.
- **Polish**: T019 and T020 can run in parallel; T021 and T022 follow as final cleanup/verification.

---

## Parallel Example: User Story 1

```bash
# Parallel test preparation:
Task: "T007 [US1] Add token-usage regression assertions in src/app/features/welcome/welcome-page.component.spec.ts"
Task: "T008 [US1] Add content readability/render integrity assertions in src/app/features/welcome/welcome-page.component.spec.ts"

# Parallel implementation split by file:
Task: "T009 [US1] Refactor themed structure wrappers in src/app/features/welcome/welcome-page.component.html"
Task: "T010 [US1] Replace hardcoded palette colors in src/app/features/welcome/welcome-page.component.scss"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Deliver Phase 3 (US1) fully.
3. Validate US1 independent criteria and tests.
4. Demo/deploy themed welcome experience.

### Incremental Delivery

1. Setup + Foundational
2. US1 (visual consistency value)
3. US2 (behavior/responsive safety)
4. Polish and finalize validation evidence

### Parallel Team Strategy

With multiple developers:

1. Complete Setup/Foundational together.
2. Split US1 by file (`.html` / `.scss` / `.ts` + spec).
3. Split US2 by tests vs responsive/template adjustments.
4. Rejoin for final polish and validation.

---

## Notes

- All tasks follow checklist format: checkbox + Task ID + optional `[P]` + required `[USx]` in user-story phases + explicit file path.
- Avoid deep Angular Material private-class overrides; prefer token-driven styling.
- Keep scope limited to welcome feature and related route/test surfaces.
