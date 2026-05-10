# Tasks: Add Digital Clock with Timezone to Top Menu

**Input**: Design documents from `/specs/007-add-digital-clock/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared assets and baseline files for clock feature work.

- [X] T001 Add digital-style font preload for clock numerals in src/index.html
- [X] T002 Create clock constants for locale, fallback timezone, and breakpoint in src/app/layout/header-clock.constants.ts
- [X] T003 [P] Create initial service and spec file stubs in src/app/layout/header-clock.service.ts and src/app/layout/header-clock.service.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish typed contracts and shell wiring required by all user stories.

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

- [X] T004 Create typed clock view models and format config in src/app/layout/header-clock.models.ts
- [X] T005 Implement base timezone resolution helpers with UTC fallback in src/app/layout/header-clock.service.ts
- [X] T006 Add initial shell clock state fields and dependency injection hooks in src/app/layout/app-shell.component.ts
- [X] T007 Add centered clock container skeleton in the toolbar markup in src/app/layout/app-shell.component.html
- [X] T008 [P] Add baseline clock container styles using Material theme tokens in src/app/layout/app-shell.component.scss

**Checkpoint**: Foundation ready - user stories can be implemented and tested independently.

---

## Phase 3: User Story 1 - View Current Time and Timezone (Priority: P1) 🎯 MVP

**Goal**: Show a real-time digital clock (`HH:mm:ss`) with timezone in the top menu.

**Independent Test**: Open the app at desktop/tablet width and verify the centered clock shows `HH:mm:ss` plus timezone, updating every second.

### Tests for User Story 1

- [X] T009 [P] [US1] Add service tests for `HH:mm:ss` formatting and timezone fallback behavior in src/app/layout/header-clock.service.spec.ts
- [X] T010 [US1] Add component test coverage for rendering time and timezone text in src/app/layout/app-shell.component.spec.ts

### Implementation for User Story 1

- [X] T011 [US1] Implement 1-second ticker stream with immediate first emission in src/app/layout/header-clock.service.ts
- [X] T012 [US1] Implement timezone preference order (server -> browser -> UTC) in src/app/layout/header-clock.service.ts
- [X] T013 [US1] Bind reactive clock view model into shell state in src/app/layout/app-shell.component.ts
- [X] T014 [US1] Render centered clock time and timezone output in src/app/layout/app-shell.component.html
- [X] T015 [US1] Apply futuristic digital number typography with theme-token colors in src/app/layout/app-shell.component.scss

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Responsive Clock Display (Priority: P1)

**Goal**: Show the clock only when viewport width is at least 768px and keep top-menu layout stable.

**Independent Test**: Resize from desktop/tablet to mobile and confirm the clock appears at `>=768px`, hides below `768px`, and does not overlap toolbar controls.

### Tests for User Story 2

- [X] T016 [P] [US2] Add breakpoint visibility tests around 768px in src/app/layout/app-shell.component.spec.ts
- [X] T017 [P] [US2] Add e2e responsive visibility checks for tablet/desktop and mobile in e2e/header-clock.spec.ts

### Implementation for User Story 2

- [X] T018 [US2] Implement BreakpointObserver-driven `showClock` state using 768px threshold in src/app/layout/app-shell.component.ts
- [X] T019 [US2] Gate clock rendering by responsive visibility state in src/app/layout/app-shell.component.html
- [X] T020 [US2] Add CSS fallback media rules for `<768px` hide behavior in src/app/layout/app-shell.component.scss
- [X] T021 [US2] Refine centered toolbar slot layout to avoid overlap with menu/profile actions in src/app/layout/app-shell.component.scss

**Checkpoint**: User Story 2 is independently functional and testable.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and feature-level consistency checks.

- [X] T022 [P] Run and stabilize updated clock unit/component tests in src/app/layout/header-clock.service.spec.ts and src/app/layout/app-shell.component.spec.ts
- [ ] T023 [P] Run and stabilize responsive e2e checks in e2e/header-clock.spec.ts
- [X] T024 Update implementation/validation notes for clock behavior in specs/007-add-digital-clock/quickstart.md
- [X] T025 Run production build validation and record results in specs/007-add-digital-clock/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2 completion.
- **Phase 4 (US2)**: Depends on Phase 2 completion and can proceed in parallel with late US1 tasks if no same-file conflicts.
- **Phase 5 (Polish)**: Depends on completion of target user stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories after foundational tasks.
- **US2 (P1)**: No dependency on US1 business behavior, but shares shell files and should merge after foundational structure is in place.

### Within Each User Story

- Tests are added before/alongside implementation for regression safety.
- Service logic precedes shell binding and template rendering.
- Responsive state logic precedes CSS/layout refinements.

---

## Parallel Opportunities

- **Setup**: T003 can run in parallel with T001-T002 once file paths are created.
- **Foundational**: T008 can run in parallel with T005-T007.
- **US1**: T009 can run in parallel with T011-T012.
- **US2**: T016 and T017 can run in parallel; T020 and T021 can run in parallel after T018/T019.
- **Polish**: T022 and T023 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "T009 [US1] Add service tests in src/app/layout/header-clock.service.spec.ts"
Task: "T011 [US1] Implement 1-second ticker in src/app/layout/header-clock.service.ts"
Task: "T012 [US1] Implement timezone fallback logic in src/app/layout/header-clock.service.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T016 [US2] Add breakpoint visibility tests in src/app/layout/app-shell.component.spec.ts"
Task: "T017 [US2] Add e2e responsive checks in e2e/header-clock.spec.ts"
```

---

## Implementation Strategy

### MVP First (US1)

1. Finish Phase 1 and Phase 2.
2. Deliver Phase 3 (US1) completely.
3. Validate clock rendering, ticker cadence, and timezone text.
4. Demo/deploy MVP.

### Incremental Delivery

1. Setup + foundational shell wiring.
2. Deliver US1 (time + timezone behavior).
3. Deliver US2 (responsive visibility and layout safety).
4. Execute polish and validation tasks.

### Team Parallel Strategy

1. Engineer A: service + service tests (`header-clock.service.ts`, `.spec.ts`).
2. Engineer B: shell template/SCSS responsive slot (`app-shell.component.html`, `.scss`).
3. Engineer C: component + e2e regression checks (`app-shell.component.spec.ts`, `e2e/header-clock.spec.ts`).
