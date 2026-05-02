# Tasks: Add Logoff Button

**Input**: Design documents from `/specs/002-add-logoff-button/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are expected for each user story because this feature changes authenticated route behavior, session teardown, and visible user feedback.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Angular single app**: `src/app/` with colocated `*.spec.ts` files and optional `e2e/`
- This feature extends the existing single Angular application rooted at `src/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the authenticated detail surface and regression targets for the new logout flow

- [ ] T001 Align the authenticated detail-page surface for logout work in `src/app/features/home/home-page.component.ts`, `src/app/features/home/home-page.component.html`, and `src/app/features/home/home-page.models.ts`
- [ ] T002 [P] Prepare logout regression targets in `src/app/features/home/home-page.component.spec.ts`, `src/app/core/auth/auth.facade.spec.ts`, `src/app/core/auth/auth.guard.spec.ts`, and `src/app/app.routes.spec.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the typed auth and logout surfaces that all logout stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Extend logout-related auth state contracts in `src/app/core/auth/auth.models.ts` and `src/app/features/home/home-page.models.ts`
- [ ] T004 Implement the shared logout contract in `src/app/core/auth/auth.facade.ts`
- [ ] T005 Preserve post-logout anonymous route protection in `src/app/core/auth/auth.guard.ts` and `src/app/app.routes.ts`
- [ ] T006 Add shared logout feedback state wiring in `src/app/features/home/home-page.component.ts` and `src/app/features/home/home-page.models.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Log Off From User Detail Page (Priority: P1) 🎯 MVP

**Goal**: Let authenticated users log off directly from the current user detail page and land on the welcome page

**Independent Test**: Sign in, open `/home`, activate the `Log off` button, and verify that the app ends the session and returns to `/`.

### Tests for User Story 1

- [ ] T007 [P] [US1] Add component coverage for logout button rendering and click handling in `src/app/features/home/home-page.component.spec.ts`
- [ ] T008 [P] [US1] Add auth-facade coverage for successful provider logout and welcome-page redirect intent in `src/app/core/auth/auth.facade.spec.ts`

### Implementation for User Story 1

- [ ] T009 [P] [US1] Extend the detail-page view model for logout action state in `src/app/features/home/home-page.models.ts`
- [ ] T010 [US1] Implement successful logout teardown and redirect handling in `src/app/core/auth/auth.facade.ts`
- [ ] T011 [US1] Add the visible `Log off` action and in-progress UI state in `src/app/features/home/home-page.component.html` and `src/app/features/home/home-page.component.scss`
- [ ] T012 [US1] Wire the home-page logout action to the auth facade in `src/app/features/home/home-page.component.ts`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Prevent Access To Authenticated Detail Content After Logoff (Priority: P2)

**Goal**: Ensure authenticated detail content disappears after logout and `/home` remains protected for anonymous users

**Independent Test**: Log off from `/home`, then revisit `/home` directly and verify the app keeps the user on the anonymous welcome flow without rendering stale profile data.

### Tests for User Story 2

- [ ] T013 [P] [US2] Add guard and route regression coverage for anonymous access after logout in `src/app/core/auth/auth.guard.spec.ts` and `src/app/app.routes.spec.ts`
- [ ] T014 [P] [US2] Add home-page regression coverage that profile details do not persist after logout in `src/app/features/home/home-page.component.spec.ts`

### Implementation for User Story 2

- [ ] T015 [US2] Clear authenticated profile and session state on logout completion in `src/app/core/auth/auth.facade.ts`
- [ ] T016 [US2] Ensure the post-logout redirect target resolves to the welcome page in `src/app/core/auth/auth.facade.ts` and `src/app/core/auth/redirect.utils.ts`
- [ ] T017 [US2] Preserve `/home` route protection for anonymous revisits in `src/app/core/auth/auth.guard.ts` and `src/app/app.routes.ts`

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Handle Unsuccessful Logoff Gracefully (Priority: P3)

**Goal**: Show clear, retryable feedback when logoff fails without leaving the user in an ambiguous UI state

**Independent Test**: Simulate a logout failure from `/home`, verify a retryable error message is shown, and verify the user can attempt logout again without reloading the page.

### Tests for User Story 3

- [ ] T018 [P] [US3] Add component coverage for logout failure messaging and retry behavior in `src/app/features/home/home-page.component.spec.ts`
- [ ] T019 [P] [US3] Add auth-facade coverage for failed logout attempts in `src/app/core/auth/auth.facade.spec.ts`

### Implementation for User Story 3

- [ ] T020 [P] [US3] Extend typed logout failure and retry state in `src/app/core/auth/auth.models.ts` and `src/app/features/home/home-page.models.ts`
- [ ] T021 [US3] Implement recoverable failed-logout handling in `src/app/core/auth/auth.facade.ts`
- [ ] T022 [US3] Render retryable logout error feedback and re-enabled action states in `src/app/features/home/home-page.component.ts`, `src/app/features/home/home-page.component.html`, and `src/app/features/home/home-page.component.scss`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, documentation, and end-to-end validation across the logout flow

- [ ] T023 [P] Update browser smoke coverage for logout from `/home` in `e2e/auth-flow.spec.ts`
- [ ] T024 [P] Document logout behavior and validation steps in `README.md` and `specs/002-add-logoff-button/quickstart.md`
- [ ] T025 Run logout quickstart validation and capture any required adjustments in `specs/002-add-logoff-button/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion and is best validated after US1 because it extends the success-path logout flow
- **User Story 3 (Phase 5)**: Depends on Foundational completion and extends the logout path built in US1 and US2
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - delivers the MVP logout action and redirect behavior
- **User Story 2 (P2)**: Can start after Foundational, but is best done after US1 because it hardens the completed logout path
- **User Story 3 (P3)**: Can start after Foundational, but depends on the logout path from US1 to validate failure and retry behavior realistically

### Within Each User Story

- Tests MUST be added at the lowest-cost layer that proves the logout behavior
- Typed contracts before component or facade surfaces that consume them
- Facade session handling before template-level state integration
- Story complete before moving to the next priority

### Parallel Opportunities

- T002 can run in parallel across the listed regression test files
- T007 and T008 can run in parallel for User Story 1
- T013 and T014 can run in parallel for User Story 2
- T018 and T019 can run in parallel for User Story 3
- T023 and T024 can run in parallel in the Polish phase

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 regression tests together:
Task: "Add component coverage for logout button rendering and click handling in src/app/features/home/home-page.component.spec.ts"
Task: "Add auth-facade coverage for successful provider logout and welcome-page redirect intent in src/app/core/auth/auth.facade.spec.ts"
```

## Parallel Example: User Story 2

```bash
# Launch User Story 2 protection checks together:
Task: "Add guard and route regression coverage for anonymous access after logout in src/app/core/auth/auth.guard.spec.ts and src/app/app.routes.spec.ts"
Task: "Add home-page regression coverage that profile details do not persist after logout in src/app/features/home/home-page.component.spec.ts"
```

## Parallel Example: User Story 3

```bash
# Launch User Story 3 failure-path validation together:
Task: "Add component coverage for logout failure messaging and retry behavior in src/app/features/home/home-page.component.spec.ts"
Task: "Add auth-facade coverage for failed logout attempts in src/app/core/auth/auth.facade.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate successful logout from `/home` to `/`

### Incremental Delivery

1. Deliver Setup + Foundational to establish typed logout state and shared auth ownership
2. Deliver User Story 1 to prove the visible detail-page logout action and redirect
3. Deliver User Story 2 to prove stale authenticated content and route access are blocked after logout
4. Deliver User Story 3 to harden logout failure messaging and retry behavior
5. Finish with Polish tasks to document and smoke-test the end-to-end logout journey

### Parallel Team Strategy

1. One developer updates the shared auth facade and typed state in Phase 2
2. A second developer can prepare home-page UI and component tests once the contracts are set
3. A third developer can prepare route-protection regressions and smoke coverage once the shared logout contract exists

---

## Notes

- [P] tasks target different files or disjoint test surfaces and avoid unresolved dependencies
- Each user story remains independently testable from the existing `/home` and `/` routes
- The task order follows the current Angular structure under `src/app/core/`, `src/app/features/`, and `e2e/`
- The existing `AuthFacade` remains the single owner of logout behavior unless implementation reveals a constitution-level complexity justification