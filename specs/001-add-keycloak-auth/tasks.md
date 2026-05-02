# Tasks: Keycloak Authentication Flow

**Input**: Design documents from `/specs/001-add-keycloak-auth/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are expected for each user story because this feature changes route behavior, authentication handoff, and personalized rendering.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Angular single app**: `src/app/` with colocated `*.spec.ts` files and optional `e2e/`
- This feature uses a single Angular application at repository root with `src/app/core/`, `src/app/features/`, and `src/assets/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Angular 21 application and required UI/auth dependencies

- [X] T001 Initialize the Angular 21 workspace in `package.json`, `angular.json`, `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.spec.json`
- [X] T002 Create the application entry files in `src/main.ts`, `src/index.html`, and `src/styles.scss`
- [X] T003 [P] Add Keycloak and Angular Material dependencies in `package.json`
- [X] T004 [P] Configure Angular Material theme, typography, and browser animations in `src/styles.scss` and `src/app/app.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the auth integration, routing, and shared typed surfaces required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create the application shell and router outlet in `src/app/app.component.ts`, `src/app/app.component.html`, and `src/app/app.component.scss`
- [X] T006 [P] Define shared auth and profile contracts in `src/app/core/auth/auth.models.ts` and `src/app/core/auth/profile.models.ts`
- [X] T007 [P] Add the Keycloak silent check asset in `src/assets/silent-check-sso.html`
- [X] T008 Implement Keycloak provider and interceptor configuration in `src/app/core/keycloak/keycloak.config.ts` and wire it in `src/app/app.config.ts`
- [X] T009 Implement the auth facade for session bootstrap, login, logout-safe state clearing, and profile loading in `src/app/core/auth/auth.facade.ts`
- [X] T010 Implement the authenticated-route guard in `src/app/core/auth/auth.guard.ts`
- [X] T011 Create the base route map in `src/app/app.routes.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Start authentication from the welcome page (Priority: P1) 🎯 MVP

**Goal**: Give anonymous visitors a public landing page with a clear login action that starts the Keycloak flow

**Independent Test**: Visit `/` while signed out, confirm the welcome page renders, activate the login action, and verify the app starts the Keycloak login handoff.

### Tests for User Story 1

- [X] T012 [P] [US1] Add component coverage for the public welcome page in `src/app/features/welcome/welcome-page.component.spec.ts`
- [X] T013 [P] [US1] Add router/auth integration coverage for public entry and login handoff in `src/app/app.routes.spec.ts`

### Implementation for User Story 1

- [X] T014 [P] [US1] Create the welcome page component in `src/app/features/welcome/welcome-page.component.ts`
- [X] T015 [P] [US1] Create the welcome page template and styles in `src/app/features/welcome/welcome-page.component.html` and `src/app/features/welcome/welcome-page.component.scss`
- [X] T016 [US1] Implement welcome-page login action and recoverable auth-status messaging in `src/app/features/welcome/welcome-page.facade.ts`
- [X] T017 [US1] Wire the root route to the welcome page and anonymous redirect behavior in `src/app/app.routes.ts`
- [X] T018 [US1] Add accessible loading, retry, and login CTA states to the welcome page in `src/app/features/welcome/welcome-page.component.html` and `src/app/features/welcome/welcome-page.component.scss`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - See personalized home content after authentication (Priority: P2)

**Goal**: Redirect authenticated users to a protected home page that shows a personalized greeting and Keycloak profile details

**Independent Test**: Complete authentication with a valid Keycloak account and verify the application redirects to `/home` and renders personalized profile content.

### Tests for User Story 2

- [X] T019 [P] [US2] Add component coverage for personalized home rendering in `src/app/features/home/home-page.component.spec.ts`
- [X] T020 [P] [US2] Add integration coverage for successful auth redirect and profile loading in `src/app/core/auth/auth.facade.spec.ts`

### Implementation for User Story 2

- [X] T021 [P] [US2] Create normalized home view models and mappers in `src/app/features/home/home-page.models.ts`
- [X] T022 [P] [US2] Create the protected home page component in `src/app/features/home/home-page.component.ts`
- [X] T023 [P] [US2] Create the home page template and styles in `src/app/features/home/home-page.component.html` and `src/app/features/home/home-page.component.scss`
- [X] T024 [US2] Implement post-login redirect and Keycloak profile retrieval in `src/app/core/auth/auth.facade.ts`
- [X] T025 [US2] Wire the protected `/home` route with the auth guard in `src/app/app.routes.ts`
- [X] T026 [US2] Render the personalized greeting and profile details with Angular Material in `src/app/features/home/home-page.component.html` and `src/app/features/home/home-page.component.ts`

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Handle protected-route and profile retrieval failures gracefully (Priority: P3)

**Goal**: Keep the experience recoverable when sessions expire, protected routes are requested anonymously, or profile data is incomplete

**Independent Test**: Request `/home` while signed out, then simulate missing profile fields or expired sessions and verify the UI falls back cleanly.

### Tests for User Story 3

- [X] T027 [P] [US3] Add component coverage for home-page fallback and warning states in `src/app/features/home/home-page.component.spec.ts`
- [X] T028 [P] [US3] Add guard/session integration coverage for anonymous and expired-session redirects in `src/app/core/auth/auth.guard.spec.ts`

### Implementation for User Story 3

- [X] T029 [P] [US3] Extend auth failure and fallback contracts in `src/app/core/auth/auth.models.ts` and `src/app/features/home/home-page.models.ts`
- [X] T030 [US3] Implement expired-session recovery and anonymous redirect handling in `src/app/core/auth/auth.guard.ts` and `src/app/core/auth/auth.facade.ts`
- [X] T031 [US3] Implement partial-profile fallback messaging in `src/app/features/home/home-page.component.ts` and `src/app/features/home/home-page.component.html`
- [X] T032 [US3] Surface cancelled-login and retry guidance on the welcome page in `src/app/features/welcome/welcome-page.component.ts` and `src/app/features/welcome/welcome-page.component.html`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, documentation, and scenario validation across the full flow

- [X] T033 [P] Document local Keycloak setup, redirect URIs, and run steps in `README.md` and `specs/001-add-keycloak-auth/quickstart.md`
- [X] T034 [P] Add focused e2e smoke coverage for the anonymous-to-login and authenticated-home journeys in `e2e/auth-flow.spec.ts`
- [X] T035 Harden Keycloak config boundaries and redirect handling in `src/app/core/keycloak/keycloak.config.ts` and `src/app/core/auth/auth.guard.ts`
- [X] T036 Run the quickstart validation and capture any required adjustments in `specs/001-add-keycloak-auth/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion and consumes the login/session behavior established by US1
- **User Story 3 (Phase 5)**: Depends on Foundational completion and extends the session/profile behavior built in US1 and US2
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - delivers the MVP public entry and login handoff
- **User Story 2 (P2)**: Can start after Foundational, but is best done after US1 so the login path already exists end-to-end
- **User Story 3 (P3)**: Can start after Foundational, but depends on the home-page and auth-path behavior from US1 and US2 to validate fallback handling realistically

### Within Each User Story

- Tests MUST be added at the lowest-cost layer that proves the change
- Component shells before route wiring and state integration
- Facade/guard logic before broader UI fallback work
- Story complete before moving to the next priority

### Parallel Opportunities

- T003 and T004 can run in parallel once Angular workspace files exist
- T006 and T007 can run in parallel in the Foundational phase
- T012 and T013 can run in parallel for User Story 1
- T019 and T020 can run in parallel for User Story 2
- T021, T022, and T023 can run in parallel for User Story 2
- T027 and T028 can run in parallel for User Story 3
- T033 and T034 can run in parallel in the Polish phase

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 test work together:
Task: "Add component coverage for the public welcome page in src/app/features/welcome/welcome-page.component.spec.ts"
Task: "Add router/auth integration coverage for public entry and login handoff in src/app/app.routes.spec.ts"

# Launch User Story 1 UI scaffolding together:
Task: "Create the welcome page component in src/app/features/welcome/welcome-page.component.ts"
Task: "Create the welcome page template and styles in src/app/features/welcome/welcome-page.component.html and src/app/features/welcome/welcome-page.component.scss"
```

## Parallel Example: User Story 2

```bash
# Launch User Story 2 view work together:
Task: "Create normalized home view models and mappers in src/app/features/home/home-page.models.ts"
Task: "Create the protected home page component in src/app/features/home/home-page.component.ts"
Task: "Create the home page template and styles in src/app/features/home/home-page.component.html and src/app/features/home/home-page.component.scss"
```

## Parallel Example: User Story 3

```bash
# Launch User Story 3 validation work together:
Task: "Add component coverage for home-page fallback and warning states in src/app/features/home/home-page.component.spec.ts"
Task: "Add guard/session integration coverage for anonymous and expired-session redirects in src/app/core/auth/auth.guard.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate anonymous entry, login CTA visibility, and login handoff

### Incremental Delivery

1. Deliver Setup + Foundational to establish the Angular and Keycloak baseline
2. Deliver User Story 1 to prove the public entry and authentication trigger
3. Deliver User Story 2 to prove authenticated redirect and personalized rendering
4. Deliver User Story 3 to harden failure handling and recovery
5. Finish with Polish tasks to document and smoke-test the end-to-end flow

### Parallel Team Strategy

1. One developer establishes Setup and Foundational auth infrastructure
2. A second developer can prepare welcome-page tests and UI once routes exist
3. A third developer can prepare the protected home UI and view-model work once shared contracts are in place

---

## Notes

- [P] tasks target separate files and avoid unresolved dependencies
- Each user story remains independently testable from the routes and states defined in the spec
- The task order follows the planned Angular structure in `src/app/core/`, `src/app/features/`, and `src/assets/`
- `keycloak-angular` initialization, route guards, and profile normalization are treated as first-class implementation surfaces rather than hidden wrappers