---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are EXPECTED whenever a
story changes behavior, contracts, or regressions that can be automated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Angular single app**: `src/app/` with colocated `*.spec.ts` files and optional `e2e/`
- **Angular + API**: `frontend/src/app/` for Angular code and `backend/src/` for server code
- **Angular workspace**: `projects/` for apps and shared libraries
- Paths shown below assume an Angular single app - adjust based on plan.md structure

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize Angular project or workspace dependencies
- [ ] T003 [P] Configure linting, formatting, and strict TypeScript settings

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Create application shell, core providers, and route structure
- [ ] T005 [P] Define shared typed contracts used across stories
- [ ] T006 [P] Setup API access layer or adapters needed by multiple stories
- [ ] T007 Create base UI states and error handling patterns
- [ ] T008 Configure form validation and accessibility conventions
- [ ] T009 Setup environment configuration management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 ⚠️

> **NOTE: Add the lowest-cost tests that prove the story and ensure regression
> coverage for the changed behavior**

- [ ] T010 [P] [US1] Add component or unit test coverage in src/app/[feature]/[file].spec.ts
- [ ] T011 [P] [US1] Add integration or e2e coverage for [user journey] when needed

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create typed models or DTOs in src/app/[feature]/[types].ts
- [ ] T013 [P] [US1] Create standalone component or route in src/app/[feature]/[feature].ts
- [ ] T014 [US1] Implement supporting service or data adapter in src/app/[feature]/[service].ts
- [ ] T015 [US1] Wire template, state transitions, and route integration
- [ ] T016 [US1] Add validation, loading, and error states
- [ ] T017 [US1] Document any justified complexity in plan.md if introduced

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 ⚠️

- [ ] T018 [P] [US2] Add component or unit test coverage in src/app/[feature]/[file].spec.ts
- [ ] T019 [P] [US2] Add integration or e2e coverage for [user journey] when needed

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create typed contracts in src/app/[feature]/[types].ts
- [ ] T021 [US2] Implement Angular service, guard, or helper in src/app/[feature]/[service].ts
- [ ] T022 [US2] Implement route or component behavior in src/app/[feature]/[feature].ts
- [ ] T023 [US2] Integrate with User Story 1 surfaces only through explicit contracts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 ⚠️

- [ ] T024 [P] [US3] Add component or unit test coverage in src/app/[feature]/[file].spec.ts
- [ ] T025 [P] [US3] Add integration or e2e coverage for [user journey] when needed

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create typed contracts in src/app/[feature]/[types].ts
- [ ] T027 [US3] Implement Angular service, state helper, or adapter in src/app/[feature]/[service].ts
- [ ] T028 [US3] Implement route or component behavior in src/app/[feature]/[feature].ts

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/ or specs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional component, unit, or e2e tests where coverage is still thin
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests MUST be added at the lowest-cost layer that proves the change
- Typed contracts before services or components that consume them
- Services and adapters before route wiring when external data is involved
- Core implementation before broader integration coverage
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Add component or unit test coverage in src/app/[feature]/[file].spec.ts"
Task: "Add integration or e2e coverage for [user journey] when needed"

# Launch all models for User Story 1 together:
Task: "Create typed models or DTOs in src/app/[feature]/[types].ts"
Task: "Create standalone component or route in src/app/[feature]/[feature].ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify the planned tests cover the changed behavior before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
