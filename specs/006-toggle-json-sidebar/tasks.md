# Tasks: Dynamic JSON Sidebar Menu

**Input**: Design documents from `/specs/006-toggle-json-sidebar/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are required for this feature because the specification explicitly requires component and integration validation for toggle behavior, JSON loading, and two-level navigation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish baseline runtime configuration artifacts and shell-local menu files.

- [X] T001 Create initial runtime sidebar configuration file in public/config/sidebar-menu.json
- [X] T002 Create shell menu contract file scaffold in src/app/layout/shell-menu.models.ts
- [X] T003 Create shell runtime menu loader file scaffold in src/app/layout/shell-menu-config.loader.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build core typed runtime-menu infrastructure that blocks all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Define strict menu config, item, child-item, and fallback interfaces in src/app/layout/shell-menu.models.ts
- [X] T005 Implement menu contract normalization and depth-limiting helpers in src/app/layout/shell-menu.models.ts
- [X] T006 Implement HttpClient-based menu fetch entry point and typed result shape in src/app/layout/shell-menu-config.loader.ts
- [X] T007 [P] Create loader unit test suite scaffold with TestBed Http testing setup in src/app/layout/shell-menu-config.loader.spec.ts
- [X] T008 [P] Add shell dependency seam for runtime menu loader injection in src/app/layout/app-shell.component.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Toggle Sidebar Visibility (Priority: P1) 🎯 MVP

**Goal**: Users can show/hide the left sidebar on demand while content stays usable.

**Independent Test**: Run shell component tests that toggle sidebar visibility on desktop and mobile and verify content remains accessible after route changes.

### Tests for User Story 1

- [X] T009 [P] [US1] Add desktop/mobile toggle coverage and route-transition persistence checks in src/app/layout/app-shell.component.spec.ts
- [X] T010 [P] [US1] Add accessibility assertions for toggle labels and focusable controls in src/app/layout/app-shell.component.spec.ts

### Implementation for User Story 1

- [X] T011 [US1] Implement always-available sidebar toggle controls in header and mobile topbar in src/app/layout/app-shell.component.html
- [X] T012 [US1] Refine toggle state transitions for consistent session behavior in src/app/layout/app-shell.component.ts
- [X] T013 [US1] Add responsive toggle/hidden-state styles without breaking content layout in src/app/layout/app-shell.component.scss

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Load Navigation from JSON Source (Priority: P2)

**Goal**: Sidebar menu items are dynamically loaded from JSON with robust fallback handling.

**Independent Test**: Run loader and shell tests with valid, invalid, and unavailable JSON responses; verify expected menu rendering and fallback behavior.

### Tests for User Story 2

- [X] T014 [P] [US2] Add loader tests for valid payload parsing and ordered output in src/app/layout/shell-menu-config.loader.spec.ts
- [X] T015 [P] [US2] Add loader tests for invalid or unavailable JSON fallback behavior in src/app/layout/shell-menu-config.loader.spec.ts
- [X] T016 [P] [US2] Add shell integration tests for runtime-loaded menu rendering and fallback messaging in src/app/layout/app-shell.component.spec.ts

### Implementation for User Story 2

- [X] T017 [US2] Implement runtime JSON loading, validation, and fallback mapping logic in src/app/layout/shell-menu-config.loader.ts
- [X] T018 [US2] Replace static navigation constant consumption with loader-backed state in src/app/layout/app-shell.component.ts
- [X] T019 [US2] Render dynamic first-level menu list and fallback message region in src/app/layout/app-shell.component.html
- [X] T020 [US2] Update static navigation model exports to support runtime-driven filtering rules in src/app/layout/shell-navigation.models.ts
- [X] T021 [US2] Populate default runtime menu entries for local environments in public/config/sidebar-menu.json

**Checkpoint**: User Stories 1 and 2 both function and are independently testable.

---

## Phase 5: User Story 3 - Use Two-Level Navigation Hierarchy (Priority: P3)

**Goal**: Sidebar supports parent/child menu rendering with accessible expand/collapse behavior.

**Independent Test**: Run shell tests with two-level menu payloads and verify expand/collapse, child rendering, and child navigation behavior.

### Tests for User Story 3

- [X] T022 [P] [US3] Add component tests for parent expand/collapse and child navigation in src/app/layout/app-shell.component.spec.ts
- [X] T023 [P] [US3] Add loader tests for ignoring unsupported depth beyond level 2 in src/app/layout/shell-menu-config.loader.spec.ts
- [X] T024 [P] [US3] Add smoke e2e for two-level sidebar behavior on responsive viewport in e2e/sidebar-menu.spec.ts

### Implementation for User Story 3

- [X] T025 [US3] Extend menu normalization for parent/child ordering and visibility filtering in src/app/layout/shell-menu.models.ts
- [X] T026 [US3] Implement expanded parent state and child route click handling in src/app/layout/app-shell.component.ts
- [X] T027 [US3] Render two-level Angular Material hierarchy with accessible parent toggles in src/app/layout/app-shell.component.html
- [X] T028 [US3] Add hierarchical spacing, icon, and focus styles for nested menu rows in src/app/layout/app-shell.component.scss

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, documentation alignment, and regression validation.

- [X] T029 [P] Update runtime-menu contract details to match final implementation behavior in specs/006-toggle-json-sidebar/contracts/runtime-menu-config-contract.md
- [X] T030 [P] Update UI contract notes for final accessibility and fallback interactions in specs/006-toggle-json-sidebar/contracts/ui-contract.md
- [X] T031 [P] Refresh validation walkthrough for JSON and two-level scenarios in specs/006-toggle-json-sidebar/quickstart.md
- [X] T032 Run full regression command checklist and record outcomes in specs/006-toggle-json-sidebar/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Story Phases (Phase 3-5)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on completion of all user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and has no dependency on US2/US3.
- **User Story 2 (P2)**: Starts after Phase 2 and integrates with US1 shell behavior without requiring US3.
- **User Story 3 (P3)**: Starts after Phase 2 and builds on US2 runtime-loading pipeline.

### Within Each User Story

- Add tests first (or in parallel where marked [P]) to guard behavior.
- Implement models/services before template integration.
- Complete story implementation and validation before moving to next priority.

### Parallel Opportunities

- T007 and T008 can run in parallel in Foundational phase.
- In US1, T009 and T010 can run in parallel.
- In US2, T014, T015, and T016 can run in parallel.
- In US3, T022, T023, and T024 can run in parallel.
- Polish tasks T029, T030, and T031 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "T009 [US1] Add desktop/mobile toggle coverage in src/app/layout/app-shell.component.spec.ts"
Task: "T010 [US1] Add accessibility assertions in src/app/layout/app-shell.component.spec.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T014 [US2] Add valid-payload loader tests in src/app/layout/shell-menu-config.loader.spec.ts"
Task: "T015 [US2] Add invalid/unavailable loader tests in src/app/layout/shell-menu-config.loader.spec.ts"
Task: "T016 [US2] Add runtime-render integration tests in src/app/layout/app-shell.component.spec.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T022 [US3] Add expand/collapse component tests in src/app/layout/app-shell.component.spec.ts"
Task: "T023 [US3] Add depth-limit loader tests in src/app/layout/shell-menu-config.loader.spec.ts"
Task: "T024 [US3] Add responsive two-level smoke e2e in e2e/sidebar-menu.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1).
4. Validate US1 independently before expanding scope.

### Incremental Delivery

1. Deliver MVP with US1 toggle behavior.
2. Add US2 runtime JSON loading and fallback behavior.
3. Add US3 two-level hierarchy and nested navigation.
4. Finish with Phase 6 hardening and regression checks.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. Then split by story:
   - Developer A: US1 toggle/UX
   - Developer B: US2 loader + dynamic render
   - Developer C: US3 hierarchy + nested interactions

---

## Notes

- [P] tasks indicate no blocking dependency on incomplete tasks in other files.
- [US1]/[US2]/[US3] labels map directly to spec user stories.
- Every task includes an explicit file path for execution clarity.
- Each story has its own independent test criteria for demo/validation.
