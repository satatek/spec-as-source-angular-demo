# Tasks: Split Application Layout Sections

**Input**: Design documents from [specs/004-split-layout-sections](specs/004-split-layout-sections)
**Prerequisites**: [plan.md](plan.md) (required), [spec.md](spec.md) (required), [research.md](research.md), [data-model.md](data-model.md), [contracts/ui-contract.md](contracts/ui-contract.md), [quickstart.md](quickstart.md)

**Tests**: Include component and integration tests for layout structure, routing projection, responsive behavior, and auth-guard regression as required by the feature contracts.

**Organization**: Tasks are grouped by user story to allow independent implementation and testing for each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare layout feature scaffolding and baseline files.

- [X] T001 Create layout feature directory in src/app/layout/
- [X] T002 Create shell navigation model scaffold in src/app/layout/shell-navigation.models.ts
- [X] T003 Create app shell component scaffold in src/app/layout/app-shell.component.ts
- [X] T004 Create app shell template scaffold in src/app/layout/app-shell.component.html
- [X] T005 Create app shell style scaffold in src/app/layout/app-shell.component.scss

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement core layout shell wiring that all stories depend on.

**⚠️ CRITICAL**: No user story work should start before this phase is complete.

- [X] T006 Define typed layout contracts (LayoutSection, ShellNavigationItem, ShellLayoutState) in src/app/layout/shell-navigation.models.ts
- [X] T007 Implement Material imports and base shell state in src/app/layout/app-shell.component.ts
- [X] T008 Implement semantic shell structure (header, nav, main, footer) in src/app/layout/app-shell.component.html
- [X] T009 Implement baseline non-overlapping page-flow layout styles in src/app/layout/app-shell.component.scss
- [X] T010 Wire root routing to shell + child route structure in src/app/app.routes.ts
- [X] T011 Keep root app outlet minimal for shell-based routing in src/app/app.component.html

**Checkpoint**: Foundation complete. User stories can proceed.

---

## Phase 3: User Story 1 - Consistent Global Page Structure (Priority: P1) 🎯 MVP

**Goal**: Ensure all primary routes render through a consistent header-content-footer shell.

**Independent Test**: Navigate between / and /home and verify only content changes while header/footer remain stable.

### Tests for User Story 1

- [X] T012 [P] [US1] Add shell structure component tests for header/main/footer rendering in src/app/layout/app-shell.component.spec.ts
- [X] T013 [P] [US1] Add route projection integration tests for shell child routes in src/app/app.routes.spec.ts

### Implementation for User Story 1

- [X] T014 [US1] Implement toolbar shell header with app identity in src/app/layout/app-shell.component.html
- [X] T015 [US1] Implement content outlet region for route-specific views in src/app/layout/app-shell.component.html
- [X] T016 [US1] Implement shared footer region in normal flow in src/app/layout/app-shell.component.html
- [X] T017 [US1] Implement route-preserving shell behavior for welcome/home transitions in src/app/app.routes.ts
- [X] T018 [US1] Tune shell styles for stable region order and spacing in src/app/layout/app-shell.component.scss

**Checkpoint**: US1 is independently functional and testable.

---

## Phase 4: User Story 2 - Reuse Shared UI Components (Priority: P2)

**Goal**: Attach reusable shared UI elements to layout sections without page-level duplication.

**Independent Test**: Add or update a shared header/footer element once and verify it appears across all shell routes.

### Tests for User Story 2

- [X] T019 [P] [US2] Add tests for shared header/footer reuse visibility across routes in src/app/layout/app-shell.component.spec.ts
- [X] T020 [P] [US2] Add tests to verify no duplicated shared markup in feature pages in src/app/features/home/home-page.component.spec.ts

### Implementation for User Story 2

- [X] T021 [US2] Define reusable navigation items and visibility flags in src/app/layout/shell-navigation.models.ts
- [X] T022 [US2] Implement shared header action and navigation rendering from typed model in src/app/layout/app-shell.component.ts
- [X] T023 [US2] Implement shared footer content contract and bindings in src/app/layout/app-shell.component.ts
- [X] T024 [US2] Remove/avoid layout duplication from home page template in src/app/features/home/home-page.component.html
- [X] T025 [US2] Remove/avoid layout duplication from welcome page template in src/app/features/welcome/welcome-page.component.html

**Checkpoint**: US1 and US2 are independently functional and testable.

---

## Phase 5: User Story 3 - Preserve Usability Across Viewports (Priority: P3)

**Goal**: Make shell behavior responsive and usable on desktop and mobile.

**Independent Test**: Validate desktop and mobile breakpoints for sidenav mode, toggle behavior, and non-overlapping regions.

### Tests for User Story 3

- [X] T026 [P] [US3] Add responsive state tests for side/over modes and opened state in src/app/layout/app-shell.component.spec.ts
- [X] T027 [P] [US3] Add auth-guard regression tests with shell route composition in src/app/core/auth/auth.guard.spec.ts

### Implementation for User Story 3

- [X] T028 [US3] Implement BreakpointObserver-driven responsive shell state in src/app/layout/app-shell.component.ts
- [X] T029 [US3] Implement mobile drawer toggle and close-on-navigation behavior in src/app/layout/app-shell.component.ts
- [X] T030 [US3] Implement responsive layout styles for desktop/mobile viewport transitions in src/app/layout/app-shell.component.scss
- [X] T031 [US3] Add accessibility labels and keyboard-safe toggle semantics in src/app/layout/app-shell.component.html

**Checkpoint**: All user stories are independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening and validation across stories.

- [X] T032 [P] Align route-level shell contract wording with implementation in specs/004-split-layout-sections/contracts/ui-contract.md
- [X] T033 [P] Update usage and verification steps for final shell behavior in specs/004-split-layout-sections/quickstart.md
- [X] T034 Run feature validation commands and capture status notes in specs/004-split-layout-sections/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies.
- Foundational (Phase 2): Depends on Setup completion and blocks all user stories.
- User Stories (Phases 3-5): Depend on Foundational completion.
- Polish (Phase 6): Depends on completion of desired user stories.

### User Story Dependencies

- US1 (P1): Starts after Phase 2, no dependency on other stories.
- US2 (P2): Starts after Phase 2, integrates with shell surfaces established in US1.
- US3 (P3): Starts after Phase 2, depends on shell structure and navigation contracts from US1/US2.

### Within Each User Story

- Add tests first at the lowest-cost layer that proves behavior.
- Apply typed contracts before dependent shell logic.
- Implement behavior before polish and cross-cutting validation.

### Parallel Opportunities

- T012 and T013 can run in parallel.
- T019 and T020 can run in parallel.
- T026 and T027 can run in parallel.
- T032 and T033 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "T012 [US1] Add shell structure component tests in src/app/layout/app-shell.component.spec.ts"
Task: "T013 [US1] Add route projection integration tests in src/app/app.routes.spec.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T019 [US2] Add shared header/footer reuse tests in src/app/layout/app-shell.component.spec.ts"
Task: "T020 [US2] Add no-duplication checks in src/app/features/home/home-page.component.spec.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T026 [US3] Add responsive state tests in src/app/layout/app-shell.component.spec.ts"
Task: "T027 [US3] Add auth-guard regression tests in src/app/core/auth/auth.guard.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently before moving on.

### Incremental Delivery

1. Deliver US1 for stable layout structure.
2. Deliver US2 for shared component reuse.
3. Deliver US3 for responsive and accessibility behavior.
4. Finish with Phase 6 polish and documentation validation.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. After foundation is complete:
- Developer A: US1 primary shell structure and tests.
- Developer B: US2 shared component reuse and tests.
- Developer C: US3 responsive behavior and tests.
3. Merge and validate with Phase 6 tasks.

---

## Notes

- [P] tasks indicate parallelizable work on different files or independent scopes.
- [US#] labels preserve traceability from tasks to user stories.
- Every task includes a target file path and can be executed by an implementation agent without additional context.
