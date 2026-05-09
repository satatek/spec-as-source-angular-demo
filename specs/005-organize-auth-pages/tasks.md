# Tasks: Organize Auth Header and Landing Pages

**Input**: Design documents from [specs/005-organize-auth-pages](specs/005-organize-auth-pages)
**Prerequisites**: [plan.md](plan.md) (required), [spec.md](spec.md) (required), [research.md](research.md), [data-model.md](data-model.md), [contracts/ui-contract.md](contracts/ui-contract.md), [quickstart.md](quickstart.md)

**Tests**: Include component and integration tests for header/profile state, account navigation, route guards, responsive behavior, and landing-page messaging.

**Organization**: Tasks are grouped by user story to allow independent implementation and testing for each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the feature scaffolding and baseline files for profile/account organization.

- [X] T001 Create the account feature directory in src/app/features/account/
- [X] T002 Create the account page component scaffold in src/app/features/account/account-page.component.ts
- [X] T003 Create the account page template scaffold in src/app/features/account/account-page.component.html
- [X] T004 Create the account page style scaffold in src/app/features/account/account-page.component.scss
- [X] T005 Create the top-profile model contract scaffold in src/app/layout/shell-profile.models.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement the core profile state and route wiring that all stories depend on.

**⚠️ CRITICAL**: No user story work can start before this phase is complete.

- [X] T006 Define typed top-profile display and action contracts in src/app/layout/shell-profile.models.ts
- [X] T007 Extend the shared shell header state with profile display data in src/app/layout/app-shell.component.ts
- [X] T008 Add top-right profile markup and menu trigger in src/app/layout/app-shell.component.html
- [X] T009 Add responsive header/profile styling for mobile and desktop in src/app/layout/app-shell.component.scss
- [X] T010 Add an authenticated account/profile route under the shell in src/app/app.routes.ts
- [X] T011 Keep the root app shell routing minimal and child-route driven in src/app/app.component.html and src/app/app.routes.ts

**Checkpoint**: Foundation complete. User stories can proceed.

---

## Phase 3: User Story 1 - Show Auth Identity in Header Top-Right (Priority: P1) 🎯 MVP

**Goal**: Show authenticated user identity, including icon and email, in the top-right header area and keep logoff state consistent.

**Independent Test**: Authenticate with a test account and verify the top-right header shows profile icon and email; sign out and verify anonymous state returns.

### Tests for User Story 1

- [X] T012 [P] [US1] Add component tests for authenticated/anonymous profile header rendering in src/app/layout/app-shell.component.spec.ts
- [ ] T013 [P] [US1] Add auth facade regression tests for login/logoff state transitions in src/app/core/auth/auth.facade.spec.ts
- [X] T014 [P] [US1] Add route integration tests for header-driven account navigation in src/app/app.routes.spec.ts

### Implementation for User Story 1

- [X] T015 [US1] Bind authenticated email and profile icon into the top-right header in src/app/layout/app-shell.component.html
- [ ] T016 [US1] Derive top-profile visibility from existing auth session state in src/app/layout/app-shell.component.ts and src/app/core/auth/auth.facade.ts
- [X] T017 [US1] Add accessible labels and keyboard-friendly profile trigger behavior in src/app/layout/app-shell.component.html
- [ ] T018 [US1] Ensure logoff updates header identity state and clears profile visibility in src/app/core/auth/auth.facade.ts

**Checkpoint**: US1 is independently functional and testable.

---

## Phase 4: User Story 2 - Organize Login/Logoff/Profile Through a Dedicated Entry Point (Priority: P2)

**Goal**: Provide a clear account/profile surface from the top-right profile entry point with organized actions and details.

**Independent Test**: Open the top-right profile entry and verify it navigates to or reveals an organized account/profile page with logoff access.

### Tests for User Story 2

- [X] T019 [P] [US2] Add component tests for account page rendering and logoff action visibility in src/app/features/account/account-page.component.spec.ts
- [X] T020 [P] [US2] Add route tests for authenticated access to the account page in src/app/app.routes.spec.ts
- [X] T021 [P] [US2] Add header/menu interaction tests for opening the account entry point in src/app/layout/app-shell.component.spec.ts

### Implementation for User Story 2

- [X] T022 [US2] Implement the account/profile page view state in src/app/features/account/account-page.component.ts
- [X] T023 [US2] Implement the account/profile page template with identity summary, profile details, and logoff action in src/app/features/account/account-page.component.html
- [X] T024 [US2] Implement account/profile page styles for clean organization in src/app/features/account/account-page.component.scss
- [X] T025 [US2] Wire the top-right profile action to the account/profile route in src/app/layout/app-shell.component.html and src/app/app.routes.ts
- [X] T026 [US2] Reuse existing auth facade methods for logoff and profile data on the account page in src/app/core/auth/auth.facade.ts

**Checkpoint**: US1 and US2 are independently functional and testable.

---

## Phase 5: User Story 3 - Improve Welcome and Home Messaging (Priority: P3)

**Goal**: Make welcome and home pages friendly, funny, and auth-aware with clear demo copy.

**Independent Test**: Visit welcome as anonymous and home as authenticated user, and verify each page shows the intended tone and context-aware message.

### Tests for User Story 3

- [X] T027 [P] [US3] Add welcome page message tests for anonymous/demo copy in src/app/features/welcome/welcome-page.component.spec.ts
- [X] T028 [P] [US3] Add home page message tests for authenticated/fun copy in src/app/features/home/home-page.component.spec.ts
- [X] T029 [P] [US3] Add route tests for the welcome-to-home auth redirect flow in src/app/app.routes.spec.ts

### Implementation for User Story 3

- [X] T030 [US3] Update welcome page copy and messaging state in src/app/features/welcome/welcome-page.component.html
- [ ] T031 [US3] Update welcome page supporting styles to match the friendly demo tone in src/app/features/welcome/welcome-page.component.scss
- [X] T032 [US3] Update home page copy and messaging state for logged-in users in src/app/features/home/home-page.component.html
- [ ] T033 [US3] Update home page supporting styles to match the positive logged-in tone in src/app/features/home/home-page.component.scss
- [X] T034 [US3] Ensure welcome/home pages remain auth-aware and responsive in src/app/features/welcome/welcome-page.component.ts and src/app/features/home/home-page.component.ts

**Checkpoint**: All user stories should now be independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening and validation across stories.

- [X] T035 [P] Update quickstart verification notes with the implemented profile/header behavior in specs/005-organize-auth-pages/quickstart.md
- [X] T036 [P] Align the contract wording with the implemented account/profile and messaging behavior in specs/005-organize-auth-pages/contracts/ui-contract.md
- [X] T037 Run feature validation commands and capture status notes in specs/005-organize-auth-pages/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies.
- Foundational (Phase 2): Depends on Setup completion and blocks all user stories.
- User Stories (Phases 3-5): Depend on Foundational completion.
- Polish (Phase 6): Depends on completion of desired user stories.

### User Story Dependencies

- US1 (P1): Starts after Phase 2, no dependency on other stories.
- US2 (P2): Starts after Phase 2, reuses the shared header/profile surface created in US1.
- US3 (P3): Starts after Phase 2, depends on existing shell/auth and can be validated independently of US2.

### Within Each User Story

- Add tests first at the lowest-cost layer that proves behavior.
- Apply typed contracts before dependent UI behavior.
- Implement UI and route wiring before broader integration validation.

### Parallel Opportunities

- T012, T013, and T014 can run in parallel.
- T019, T020, and T021 can run in parallel.
- T027, T028, and T029 can run in parallel.
- T035 and T036 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "T012 [US1] Add component tests for authenticated/anonymous profile header rendering in src/app/layout/app-shell.component.spec.ts"
Task: "T013 [US1] Add auth facade regression tests for login/logoff state transitions in src/app/core/auth/auth.facade.spec.ts"
Task: "T014 [US1] Add route integration tests for header-driven account navigation in src/app/app.routes.spec.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T019 [US2] Add component tests for account page rendering and logoff action visibility in src/app/features/account/account-page.component.spec.ts"
Task: "T020 [US2] Add route tests for authenticated access to the account page in src/app/app.routes.spec.ts"
Task: "T021 [US2] Add header/menu interaction tests for opening the account entry point in src/app/layout/app-shell.component.spec.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T027 [US3] Add welcome page message tests for anonymous/demo copy in src/app/features/welcome/welcome-page.component.spec.ts"
Task: "T028 [US3] Add home page message tests for authenticated/fun copy in src/app/features/home/home-page.component.spec.ts"
Task: "T029 [US3] Add route tests for the welcome-to-home auth redirect flow in src/app/app.routes.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently before moving on.

### Incremental Delivery

1. Deliver US1 for authenticated header identity.
2. Deliver US2 for organized profile/account navigation.
3. Deliver US3 for demo-friendly landing page messaging.
4. Finish with Phase 6 polish and verification notes.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. After foundation is complete:
- Developer A: US1 header identity and tests.
- Developer B: US2 account/profile page and tests.
- Developer C: US3 welcome/home messaging and tests.
3. Merge and validate with Phase 6 tasks.

---

## Notes

- [P] tasks indicate parallelizable work on different files or independent scopes.
- [US#] labels preserve traceability from tasks to user stories.
- Every task includes a target file path and can be executed by an implementation agent without additional context.
