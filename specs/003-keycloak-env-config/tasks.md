# Tasks: Environment-Specific Keycloak Configuration

**Input**: Design documents from `/specs/003-keycloak-env-config/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are expected for each user story because this feature changes bootstrap configuration, authentication initialization, redirect behavior, and startup failure handling.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Angular single app**: `src/app/` with colocated `*.spec.ts` files and optional `e2e/`
- This feature extends the existing single Angular application rooted at `src/` and uses deployer-owned runtime config files under `public/config/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the runtime-config file layout and the regression surfaces that will change during bootstrap and authentication setup

- [X] T001 Create the runtime-config asset layout in `public/config/keycloak.development.json`, `public/config/keycloak.staging.json`, `public/config/keycloak.production.json`, and `public/config/keycloak.json`
- [X] T002 [P] Prepare runtime-config regression targets in `src/main.ts`, `src/app/app.config.ts`, `src/app/core/keycloak/keycloak.config.ts`, `src/app/core/auth/auth.facade.spec.ts`, and `e2e/auth-flow.spec.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the typed runtime-config and bootstrap wiring that every environment-specific auth story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create typed runtime-config contracts in `src/app/core/config/runtime-config.models.ts`
- [X] T004 Implement runtime-config loading and validation helpers in `src/app/core/config/runtime-config.loader.ts`
- [X] T005 [P] Add foundational validation coverage for runtime-config parsing and failure states in `src/app/core/config/runtime-config.loader.spec.ts`
- [X] T006 Refactor Angular bootstrap and provider composition to accept validated runtime settings in `src/main.ts`, `src/app/app.config.ts`, and `src/app/core/keycloak/keycloak.config.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Deploy The Application In Any Supported Environment (Priority: P1) 🎯 MVP

**Goal**: Let deployment owners supply development, staging, or production Keycloak settings without changing application source code

**Independent Test**: Serve one target environment's `/config/keycloak.json`, start the app, and verify the bootstrap flow uses that environment's Keycloak URL, realm, and client ID instead of embedded defaults.

### Tests for User Story 1

- [X] T007 [P] [US1] Add loader coverage for complete development, staging, and production payloads in `src/app/core/config/runtime-config.loader.spec.ts`
- [X] T008 [P] [US1] Add provider composition coverage for runtime-owned Keycloak settings in `src/app/core/keycloak/keycloak.config.spec.ts`

### Implementation for User Story 1

- [X] T009 [P] [US1] Populate deployer-owned Keycloak config examples in `public/config/keycloak.development.json`, `public/config/keycloak.staging.json`, and `public/config/keycloak.production.json`
- [X] T010 [US1] Implement runtime-config fetch at startup and pass validated settings into Angular bootstrap in `src/main.ts` and `src/app/app.config.ts`
- [X] T011 [US1] Replace hardcoded Keycloak URL, realm, and client settings with validated runtime values in `src/app/core/keycloak/keycloak.config.ts`
- [X] T012 [US1] Document the deployment handoff for selecting and serving `public/config/keycloak.json` in `README.md` and `specs/003-keycloak-env-config/quickstart.md`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Sign In With Environment-Appropriate Redirects (Priority: P2)

**Goal**: Ensure Keycloak sign-in and return redirects stay on the active environment origin instead of falling back to localhost assumptions

**Independent Test**: Open the app on a non-localhost origin, start sign-in, and verify the Keycloak request and return redirect stay on that same environment origin.

### Tests for User Story 2

- [X] T013 [P] [US2] Add redirect-URI derivation coverage for active-origin login, logout, and silent-check behavior in `src/app/core/keycloak/keycloak.config.spec.ts`
- [X] T014 [P] [US2] Add regression coverage for current-origin auth redirects in `src/app/core/auth/auth.facade.spec.ts` and `e2e/auth-flow.spec.ts`

### Implementation for User Story 2

- [X] T015 [P] [US2] Extend validated runtime settings with derived origin-bound redirect URIs in `src/app/core/config/runtime-config.models.ts` and `src/app/core/config/runtime-config.loader.ts`
- [X] T016 [US2] Compose Keycloak init options from active-origin runtime redirects in `src/app/core/keycloak/keycloak.config.ts`
- [X] T017 [US2] Remove localhost-only redirect assumptions from auth-flow fixtures and validation guidance in `e2e/auth-flow.spec.ts`, `README.md`, and `specs/003-keycloak-env-config/contracts/runtime-config-contract.md`

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Fail Clearly When Environment Settings Are Missing Or Invalid (Priority: P3)

**Goal**: Surface a clear startup configuration failure when runtime Keycloak settings are missing or invalid, instead of silently attempting the wrong environment

**Independent Test**: Serve an incomplete or invalid `/config/keycloak.json`, start the app, and verify the app shows a clear configuration failure outcome rather than redirecting to localhost.

### Tests for User Story 3

- [X] T018 [P] [US3] Add coverage for missing and invalid runtime-config payloads in `src/app/core/config/runtime-config.loader.spec.ts`
- [X] T019 [P] [US3] Add bootstrap regression coverage for user-visible runtime-config failure handling in `src/main.ts` and `src/app/core/keycloak/keycloak.config.spec.ts`

### Implementation for User Story 3

- [X] T020 [P] [US3] Extend configuration validation outcomes for recoverable bootstrap errors in `src/app/core/config/runtime-config.models.ts`
- [X] T021 [US3] Implement user-visible runtime-config failure handling during bootstrap in `src/main.ts`
- [X] T022 [US3] Document troubleshooting for missing or invalid runtime config in `README.md`, `specs/003-keycloak-env-config/quickstart.md`, and `specs/003-keycloak-env-config/contracts/runtime-config-contract.md`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, cleanup, and end-to-end validation across all supported environments

- [X] T023 [P] Sweep remaining localhost-only Keycloak configuration references in `src/`, `e2e/`, `README.md`, and `specs/003-keycloak-env-config/`
- [X] T024 [P] Align example config assets and documentation wording across `public/config/` and `specs/003-keycloak-env-config/quickstart.md`
- [X] T025 Run runtime-config quickstart validation and capture any required adjustments in `specs/003-keycloak-env-config/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion and is best validated after US1 because it extends the runtime-config pipeline with environment-safe redirect behavior
- **User Story 3 (Phase 5)**: Depends on Foundational completion and is best validated after US1 because it hardens the same startup configuration flow with explicit failure handling
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - delivers the MVP runtime-config loading and environment-owned Keycloak settings
- **User Story 2 (P2)**: Can start after Foundational, but is best done after US1 because it validates redirect behavior built on the runtime-config bootstrap path
- **User Story 3 (P3)**: Can start after Foundational, but is best done after US1 because it adds failure handling to the same config-loading slice

### Within Each User Story

- Tests MUST be added at the lowest-cost layer that proves the runtime-config behavior
- Typed contracts before loader and provider wiring that consume them
- Bootstrap and provider changes before broader auth-flow regression coverage
- Story complete before moving to the next priority

### Parallel Opportunities

- T002 can run in parallel across the listed regression surfaces
- T005 can run in parallel with T003 and T004 once the target contract shape is agreed
- T007 and T008 can run in parallel for User Story 1
- T009 can run in parallel with T007 and T008 for User Story 1
- T013 and T014 can run in parallel for User Story 2
- T018 and T019 can run in parallel for User Story 3
- T023 and T024 can run in parallel in the Polish phase

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 runtime-config checks together:
Task: "Add loader coverage for complete development, staging, and production payloads in src/app/core/config/runtime-config.loader.spec.ts"
Task: "Add provider composition coverage for runtime-owned Keycloak settings in src/app/core/keycloak/keycloak.config.spec.ts"
Task: "Populate deployer-owned Keycloak config examples in public/config/keycloak.development.json, public/config/keycloak.staging.json, and public/config/keycloak.production.json"
```

## Parallel Example: User Story 2

```bash
# Launch User Story 2 redirect regressions together:
Task: "Add redirect-URI derivation coverage for active-origin login, logout, and silent-check behavior in src/app/core/keycloak/keycloak.config.spec.ts"
Task: "Add regression coverage for current-origin auth redirects in src/app/core/auth/auth.facade.spec.ts and e2e/auth-flow.spec.ts"
```

## Parallel Example: User Story 3

```bash
# Launch User Story 3 failure-path checks together:
Task: "Add coverage for missing and invalid runtime-config payloads in src/app/core/config/runtime-config.loader.spec.ts"
Task: "Add bootstrap regression coverage for user-visible runtime-config failure handling in src/main.ts and src/app/core/keycloak/keycloak.config.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate one environment-specific `public/config/keycloak.json` end to end before expanding scope

### Incremental Delivery

1. Deliver Setup + Foundational to establish typed runtime-config loading and bootstrap composition
2. Deliver User Story 1 to prove environment-owned Keycloak settings work without source edits
3. Deliver User Story 2 to prove sign-in redirects stay on the active environment origin
4. Deliver User Story 3 to harden startup failure handling for missing or invalid config
5. Finish with Polish tasks to remove residual localhost assumptions and validate the documented setup

### Parallel Team Strategy

1. One developer can own typed contracts and loader validation in Phase 2
2. A second developer can prepare provider and auth-flow regressions once the runtime-config shape is agreed
3. A third developer can prepare environment-owned config assets and documentation in parallel with User Story 1

---

## Notes

- [P] tasks target different files or disjoint validation surfaces and avoid unresolved dependencies
- Each user story remains independently testable through the bootstrap and auth-flow surfaces already present in `src/main.ts`, `src/app/core/`, and `e2e/`
- The task order follows the current Angular structure and the runtime-config contract documented in `specs/003-keycloak-env-config/contracts/runtime-config-contract.md`
- The bootstrap path remains the single owner of environment selection unless implementation reveals a constitution-level complexity justification