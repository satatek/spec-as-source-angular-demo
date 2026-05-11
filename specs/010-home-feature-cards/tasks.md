# Tasks: Home Feature Cards

**Input**: Design documents from `/specs/010-home-feature-cards/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare files and scaffolding for feature-card implementation.

- [x] T001 Create Home feature-card mapper scaffold in src/app/features/home/home-feature-cards.mapper.ts
- [x] T002 Create mapper test scaffold in src/app/features/home/home-feature-cards.mapper.spec.ts
- [x] T003 [P] Create end-to-end test scaffold for Home cards in e2e/home-feature-cards.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared typed contracts and mapping behavior required by all user stories.

**⚠️ CRITICAL**: No user story work starts before this phase is complete.

- [x] T004 Define HomeFeatureCard, HomeFeatureGroup, and HomeFeatureCollectionState contracts in src/app/features/home/home-page.models.ts
- [x] T005 Implement typed mapper entry points for direct cards and grouped cards in src/app/features/home/home-feature-cards.mapper.ts
- [x] T006 [P] Implement empty and error state constructors for card collection state in src/app/features/home/home-page.models.ts
- [x] T007 [P] Add mapper unit tests for top-level leaf mapping and child mapping rules in src/app/features/home/home-feature-cards.mapper.spec.ts
- [x] T008 Add mapper unit tests for ordering, empty-group removal, and metadata fallback handling in src/app/features/home/home-feature-cards.mapper.spec.ts
- [x] T009 Wire Home component to consume mapped collection state from sidebar-derived items in src/app/features/home/home-page.component.ts

**Checkpoint**: Foundation ready; user stories can now be implemented.

---

## Phase 3: User Story 1 - Discover available features from Home (Priority: P1) 🎯 MVP

**Goal**: Show available feature cards on Home and navigate when a card is activated.

**Independent Test**: Open Home route, verify direct feature cards are visible, and confirm card activation routes to destinations.

### Tests for User Story 1

- [x] T010 [P] [US1] Add component tests for direct feature-card rendering and action labels in src/app/features/home/home-page.component.spec.ts
- [x] T011 [P] [US1] Add e2e test for direct feature-card visibility on Home in e2e/home-feature-cards.spec.ts
- [x] T012 [P] [US1] Add e2e test for direct feature-card click navigation in e2e/home-feature-cards.spec.ts

### Implementation for User Story 1

- [x] T013 [US1] Replace profile-summary state with feature-card view state in src/app/features/home/home-page.component.ts
- [x] T014 [US1] Rebuild Home template to render direct feature cards with routerLink navigation in src/app/features/home/home-page.component.html
- [x] T015 [US1] Add Home card-grid and card-action styles for direct features in src/app/features/home/home-page.component.scss
- [x] T016 [US1] Implement empty-state and error-state rendering blocks in src/app/features/home/home-page.component.html
- [x] T017 [US1] Add navigation-failure message handling for card actions in src/app/features/home/home-page.component.ts

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Keep Home cards aligned with side menu (Priority: P2)

**Goal**: Guarantee Home cards mirror the same visible features and grouping model as the side menu.

**Independent Test**: Compare side menu entries with Home cards for authenticated and unauthenticated contexts and verify parent/child parity.

### Tests for User Story 2

- [x] T018 [P] [US2] Add component tests for parity between mapped sidebar items and rendered Home cards in src/app/features/home/home-page.component.spec.ts
- [x] T019 [P] [US2] Add mapper tests for auth visibility and parent-child exclusion rules in src/app/features/home/home-feature-cards.mapper.spec.ts
- [x] T020 [P] [US2] Add e2e parity test that compares side-menu visible labels to Home card labels in e2e/home-feature-cards.spec.ts

### Implementation for User Story 2

- [x] T021 [US2] Consume the same auth-filtered menu source used by shell navigation in src/app/features/home/home-page.component.ts
- [x] T022 [US2] Implement parent-feature grouping and child-card projection logic in src/app/features/home/home-feature-cards.mapper.ts
- [x] T023 [US2] Render parent features as expansion panels and child links as cards in src/app/features/home/home-page.component.html
- [x] T024 [US2] Add expansion-panel header metadata (icon and child count) and deterministic ordering in src/app/features/home/home-page.component.html
- [x] T025 [US2] Add grouped-section styles for panel-contained child cards in src/app/features/home/home-page.component.scss

**Checkpoint**: User Story 2 is independently functional and parity with side menu is validated.

---

## Phase 5: User Story 3 - Use cards on different screen sizes (Priority: P3)

**Goal**: Keep feature cards and parent panels readable and usable on mobile and desktop.

**Independent Test**: Validate card readability, actionability, and layout stability at representative mobile and desktop viewports.

### Tests for User Story 3

- [x] T026 [P] [US3] Add component tests for responsive layout classes and overflow prevention in src/app/features/home/home-page.component.spec.ts
- [x] T027 [P] [US3] Add e2e test for mobile viewport card/panel usability in e2e/home-feature-cards.spec.ts
- [x] T028 [P] [US3] Add e2e test for desktop viewport multi-column card visibility in e2e/home-feature-cards.spec.ts

### Implementation for User Story 3

- [x] T029 [US3] Implement responsive card and panel grid rules with breakpoint-aware styling in src/app/features/home/home-page.component.scss
- [x] T030 [US3] Update Home template section wrappers for mobile-first stacking and desktop grouping in src/app/features/home/home-page.component.html
- [x] T031 [US3] Add accessibility-focused focus-ring and keyboard-visible interaction styles in src/app/features/home/home-page.component.scss
- [x] T032 [US3] Add semantic landmarks and ARIA labels for direct-card and grouped-card regions in src/app/features/home/home-page.component.html

**Checkpoint**: User Story 3 is independently functional with responsive and accessible behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cleanup, and documentation updates across all stories.

- [x] T033 [P] Update integration assertions for Home route behavior in src/app/app.routes.spec.ts
- [x] T034 Run and fix targeted unit/component suites for Home cards in src/app/features/home/home-page.component.spec.ts
- [ ] T035 [P] Run and stabilize Home feature e2e coverage in e2e/home-feature-cards.spec.ts
- [x] T036 Update implementation notes and validation steps in specs/010-home-feature-cards/quickstart.md
- [x] T037 Execute final feature validation checklist in specs/010-home-feature-cards/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): starts immediately.
- Foundational (Phase 2): depends on Setup and blocks all user stories.
- User Stories (Phases 3-5): depend on Foundational completion.
- Polish (Phase 6): depends on completed user stories.

### User Story Dependencies

- US1 (P1): starts after Foundational and delivers MVP.
- US2 (P2): starts after Foundational; can proceed independently but validates parity against sidebar.
- US3 (P3): starts after Foundational; can proceed independently with responsive/a11y scope.

### Suggested Story Order

- Preferred incremental order: US1 → US2 → US3.
- Parallel team order after Foundational: US1, US2, and US3 in parallel if staffing permits.

---

## Parallel Execution Examples

### User Story 1

- Run T010, T011, and T012 in parallel (test files do not conflict).
- Run T014 and T015 in parallel, then complete T013 and T016/T017 integration.

### User Story 2

- Run T018, T019, and T020 in parallel.
- Run T024 and T025 in parallel after T023 skeleton is in place.

### User Story 3

- Run T026, T027, and T028 in parallel.
- Run T031 and T032 in parallel after T030 structure update.

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently before moving on.

### Incremental Delivery

1. Deliver US1 for immediate user value.
2. Add US2 for source-of-truth parity and parent/child mapping fidelity.
3. Add US3 for responsive and accessibility refinements.
4. Finish with Phase 6 cross-cutting validation.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. Developer A executes US1, Developer B executes US2, Developer C executes US3.
3. Merge with Phase 6 validation and cleanup.

---

## Notes

- All tasks use strict checklist format: checkbox + ID + optional [P] + optional [USx] + action with file path.
- [P] tasks target different files or non-conflicting concerns.
- Keep user stories independently testable as defined in spec.md.
