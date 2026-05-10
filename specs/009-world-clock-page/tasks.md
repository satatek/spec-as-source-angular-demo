# Tasks: World Clock Page Implementation

**Feature**: `009-world-clock-page`  
**Generated**: May 9, 2026  
**Status**: Ready for Implementation  
**Reference**: [plan.md](plan.md), [spec.md](spec.md), [data-model.md](data-model.md)

## Overview

This task list executes the World Clock feature in three user story phases (P1 → P1 → P2), with setup and foundational tasks preceding them. Each task is independently actionable with explicit file paths.

**Total Tasks**: 42  
**Task Dependency Graph**: Setup → Foundational → US1 → US2 → US3 → Polish  
**MVP Scope**: Complete US1 + US2 (P1 stories) = core feature  
**Total Estimated Time**: 3.5–4.5 hours

---

## Phase 0: Setup & Project Initialization

### Project Structure
- [x] T001 Create feature module directory structure at `src/app/features/world-clock/` with subdirectories: `models/`, `services/`, `contracts/`
- [x] T002 Create subdirectory `src/app/features/world-clock/contracts/` (for TypeScript type definitions exported from models)

---

## Phase 1: Foundational — Models, Contracts & Service

### Models & Constants
- [x] T003 Create `src/app/features/world-clock/models/world-clock.models.ts` with `ClockFormat` type and `WorldClockEntry` interface (readonly fields, validation rules from data-model.md)
- [x] T004 Create `src/app/features/world-clock/models/world-clock.models.ts` (continued) with `WorldClockPageState` interface (readonly entries array, currentFormat, isLoading, error, lastUpdated fields)
- [x] T005 Create `src/app/features/world-clock/models/world-clock.models.ts` (continued) with `TimeZoneConfig` internal interface for constant configuration
- [x] T006 Create `src/app/features/world-clock/models/timezones.constants.ts` with `TIMEZONE_CONFIGS` array containing Brazil/UK/China configurations (region, city, timeZoneId: America/Sao_Paulo/Europe/London/Asia/Shanghai, locale: pt-BR/en-GB/zh-CN)

### Time Service (RxJS-based)
- [x] T007 [P] Create `src/app/features/world-clock/services/world-clock-time.service.ts` with `getCurrentTimes()` method returning `Observable<ReadonlyArray<WorldClockEntry>>` using RxJS `interval(1000)` + `startWith(0)`
- [x] T008 [P] Implement `world-clock-time.service.ts` with private `resolveCurrentTimes()` method that maps `TIMEZONE_CONFIGS` to `WorldClockEntry` objects with current `Date` and computed `utcOffset`
- [x] T009 [P] Implement `world-clock-time.service.ts` with private `getUTCOffset(timeZoneId)` method using `Intl.DateTimeFormat` to calculate current UTC offset in minutes for timezone
- [x] T010 Create `src/app/features/world-clock/services/world-clock-time.service.spec.ts` with unit tests for `getCurrentTimes()` returns exactly 3 entries, all with valid `WorldClockEntry` structure
- [x] T011 Add test case to `world-clock-time.service.spec.ts`: times update every 1000ms (use fakeAsync/tick to verify interval emission)
- [x] T012 Add test case to `world-clock-time.service.spec.ts`: UTC offsets are correct for Brazil/UK/China (known values for test date)
- [x] T013 Add test case to `world-clock-time.service.spec.ts`: invalid timezone ID throws diagnostic error

---

## Phase 2: User Story 1 (P1) — View Multiple Country Times

**Story Goal**: Display Brazil, UK, and China times together, clearly labeled, supporting side-by-side comparison

**Independent Test Criteria**:
- All three region times visible on single screen
- Each time clearly labeled with region and city name
- Layout supports visual side-by-side or sequential comparison without scrolling on desktop

**Implementation Tasks**:

### Clock Entry Component (Reusable Display)
- [x] T014 [US1] Create `src/app/features/world-clock/world-clock-entry.component.ts` as standalone component with @Input entry: WorldClockEntry, @Input format: ClockFormat
- [x] T015 [US1] Implement `world-clock-entry.component.ts` with computed `formattedTime` signal using `Intl.DateTimeFormat` with `entry.locale` and `entry.timeZoneId`
- [x] T016 [US1] Implement `world-clock-entry.component.ts` with computed `ariaLabel` signal for accessibility (e.g., "Brazil: Brasília time 15:45:23")
- [x] T017 [US1] Create `src/app/features/world-clock/world-clock-entry.component.html` template rendering mat-card with region name (h3), city name (p), formatted time (div with aria-live="polite"), and UTC offset
- [x] T018 [US1] Create `src/app/features/world-clock/world-clock-entry.component.scss` with Material tokens for colors: background `--mat-sys-surface-container-low`, text `--mat-sys-on-surface`, secondary text `--mat-sys-on-surface-variant`
- [x] T019 [US1] Add responsive typography to `world-clock-entry.component.scss`: region name uses `--mat-sys-title-medium`, city uses `--mat-sys-body-medium`, offset uses `--mat-sys-label-small`
- [x] T020 [US1] Add digital clock styling to `world-clock-entry.component.scss`: font-family Roboto Mono, font-size clamp(2rem, 10vw, 3.5rem), center-aligned, letter-spacing 0.1em
- [x] T021 [US1] Create `src/app/features/world-clock/world-clock-entry.component.spec.ts` with test: renders region name, city name, and formatted time correctly
- [x] T022 [US1] Add test case to `world-clock-entry.component.spec.ts`: ARIA labels present and accessible (aria-live, aria-label)
- [x] T023 [US1] Add test case to `world-clock-entry.component.spec.ts`: formatted time updates when entry.currentTime changes (use signal change detection)

### Page Component (Container & Layout)
- [x] T024 [US1] Create `src/app/features/world-clock/world-clock-page.component.ts` standalone component with state signal: `WorldClockPageState` initialized with empty entries, isLoading: true
- [x] T025 [US1] Implement `world-clock-page.component.ts` with `toSignal()` wrapper for `timeService.getCurrentTimes()` observable, auto-subscription on init
- [x] T026 [US1] Implement `world-clock-page.component.ts` with effect that subscribes to time updates and mutates state signal: entries, isLoading → false, lastUpdated
- [x] T027 [US1] Implement `world-clock-page.component.ts` with imports: CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, BreakpointObserver from CDK
- [x] T028 [US1] Create `src/app/features/world-clock/world-clock-page.component.html` with page structure: header (h1 "World Clock", p subtitle), clock-grid div, three WorldClockEntryComponent instances bound to state().entries
- [x] T029 [US1] Add Material card styling to `world-clock-page.component.html` via `<mat-card>` wrapper for header and `<mat-card-content>` for grid
- [x] T030 [US1] Create `src/app/features/world-clock/world-clock-page.component.scss` with page-level styles: padding `clamp(1rem, 5%, 3rem)`, max-width 1400px, margin auto
- [x] T031 [US1] Add responsive grid layout to `world-clock-page.component.scss`: CSS Grid with `gap: clamp(0.5rem, 3%, 2rem)`, `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`
- [x] T032 [US1] Add Material typography tokens to `world-clock-page.component.scss`: h1 uses `--mat-sys-title-large`, subtitle uses `--mat-sys-body-medium` with color `--mat-sys-on-surface-variant`
- [x] T033 [US1] Create `src/app/features/world-clock/world-clock-page.component.spec.ts` with test: all three clock entries rendered with correct region labels
- [x] T034 [US1] Add test case to `world-clock-page.component.spec.ts`: page displays "Loading..." spinner initially (isLoading: true)
- [x] T035 [US1] Add test case to `world-clock-page.component.spec.ts`: page header has region comparison subtitle text
- [x] T036 [US1] Add test case to `world-clock-page.component.spec.ts`: semantic structure with role="region" and aria-labels on page and clock grid

### Route Integration
- [x] T037 [US1] Update `src/app/app.routes.ts` to add world-clock route: path `/world-clock`, component `WorldClockPageComponent`, data: { title: 'World Clock', icon: 'schedule' }
- [x] T038 [US1] Update `public/config/sidebar-menu.json` to add World Clock menu item: id "world-clock", label "World Clock", icon "schedule", route "world-clock", requiresAuth: false, visibleWhenAuthenticated: null

### E2E Tests (US1 acceptance)
- [x] T039 [US1] Create `e2e/world-clock.spec.ts` with test: navigate to /world-clock and verify three clock cards visible with Brazil, UK, China labels
- [x] T040 [US1] Add test case to `e2e/world-clock.spec.ts`: page title and header text match specification ("World Clock", comparison subtitle)

---

## Phase 2.5: User Story 2 (P1) — Keep Clock Information Current

**Story Goal**: Times update live while page remains open, without manual refresh

**Independent Test Criteria**:
- Each clock time advances by 1 second every ~1000ms
- Updates persist for 5+ minutes without staleness or errors
- Page requires no manual refresh to maintain current times

**Implementation Tasks**:

### Live Update Verification & Format Toggle
- [ ] T041 [P] [US2] Add "Switch Format" button to `world-clock-page.component.html` as mat-icon-button with refresh icon, aria-label "Toggle between digital and analog clock formats", tooltip "Switch Format"
- [ ] T042 [US2] Implement `toggleFormat()` method in `world-clock-page.component.ts` that updates state signal: currentFormat toggles between 'digital' ↔ 'analog', lastUpdated: new Date()
- [ ] T043 [US2] Add test case to `world-clock-entry.component.spec.ts`: seconds digit increments every 1000ms (fakeAsync/tick 1000ms, verify time changed by 1s)
- [ ] T044 [US2] Add test case to `world-clock-page.component.spec.ts`: format toggle button disabled while isLoading true
- [ ] T045 [US2] Add e2e test to `e2e/world-clock.spec.ts`: times update every second (capture initial time, wait 1100ms, verify time advanced by 1s)
- [ ] T046 [US2] Add e2e test to `e2e/world-clock.spec.ts`: times remain current for 5-minute observation (loop: check time every 30s, verify no stale values)

---

## Phase 3: User Story 3 (P2) — Polished Design & Responsive Readability

**Story Goal**: Page remains readable and usable on narrow (mobile) and wide (desktop) screens; polished Material design

**Independent Test Criteria**:
- Desktop (>1024px): All three clocks visible in single row without scrolling
- Tablet (768-1024px): Two clocks per row or responsive stacking
- Mobile (<768px): Single clock per row, full width, no truncation
- All labels and times readable with no overlap

**Implementation Tasks**:

### Responsive Layout & Design Polish
- [ ] T047 [P] [US3] Implement `isSmallScreen` computed signal in `world-clock-page.component.ts` using `BreakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall])`
- [ ] T048 [US3] Implement `cardGridClass` computed signal in `world-clock-page.component.ts` returning CSS class based on breakpoint: 'grid-cols-1' for mobile, 'grid-cols-3' for desktop
- [ ] T049 [US3] Update `world-clock-page.component.html` grid div: add `[ngClass]="cardGridClass()"` binding for responsive grid layout
- [ ] T050 [US3] Add Material elevation to `world-clock-entry.component.scss`: card box-shadow level 1 (subtle), hover box-shadow level 2 (lift effect), using Material elevation tokens
- [ ] T051 [US3] Add responsive spacing to `world-clock-entry.component.scss`: mat-card padding `clamp(1rem, 4%, 2rem)`, margins use clamp for responsive adjustment
- [ ] T052 [US3] Update `world-clock-page.component.scss` header: add Material spacing between title and format button using flexbox justify-content: space-between
- [ ] T053 [US3] Add color contrast check to `world-clock-page.component.spec.ts`: verify computed color contrast >= 4.5:1 for all text elements against background
- [ ] T054 [US3] Add responsive layout test to `world-clock-page.component.spec.ts`: verify grid changes layout based on BreakpointObserver mock
- [ ] T055 [US3] Add e2e test to `e2e/world-clock.spec.ts`: set mobile viewport (375px), verify single clock per row with full width
- [ ] T056 [US3] Add e2e test to `e2e/world-clock.spec.ts`: set desktop viewport (1400px), verify three clocks per row

### Analog Clock Format (Optional Polish)
- [ ] T057 [P] [US3] Create SVG analog clock rendering in `world-clock-entry.component.html` inside `*ngIf="format === 'analog'"` block
- [ ] T058 [US3] Implement analog clock with hour hand (--mat-sys-on-surface), minute hand (--mat-sys-on-surface), second hand (--mat-sys-primary) with visible rotation based on time
- [ ] T059 [US3] Add responsive SVG sizing to `world-clock-entry.component.scss`: viewBox 0 0 200 200, size `clamp(200px, 80vw, 300px)`
- [ ] T060 [US3] Add animation timing to analog second hand: smooth rotation with CSS transform-origin center, transition from 0°-360° over 60s (repeating)
- [ ] T061 [US3] Add test case to `world-clock-entry.component.spec.ts`: analog clock SVG renders when format is 'analog'

### Accessibility & Error Handling
- [ ] T062 [US3] Add semantic HTML role="region" attributes to `world-clock-page.component.html` with descriptive aria-labels on header and grid sections
- [ ] T063 [US3] Add aria-live="polite" to formatted time display in `world-clock-entry.component.html` for screen reader announcements of time updates
- [ ] T064 [US3] Implement error state rendering in `world-clock-page.component.html`: mat-alert with error message if state().error, dismissible via closable button
- [ ] T065 [US3] Implement partial entry fallback in `world-clock-page.component.ts` and service: if one timezone fails, render other entries + error badge (not crash page)
- [ ] T066 [US3] Add error handling test to `world-clock-page.component.spec.ts`: page displays error alert and dismissible button, partial entries still render
- [ ] T067 [US3] Add a11y audit test to `e2e/world-clock.spec.ts` using aXe: verify no WCAG 2.1 A/AA violations on page

---

## Phase 4: Polish & Cross-Cutting Concerns

### Comprehensive Testing & Validation
- [ ] T068 [P] Run `npm test -- --include "world-clock/**"` and verify all component/service tests pass (>90% coverage target)
- [ ] T069 [P] Run `npm run build` and verify production build succeeds with no errors (allow bundle warnings if pre-existing)
- [ ] T070 [P] Run `npm run e2e` filter on `world-clock.spec.ts` and verify all e2e tests pass
- [ ] T071 Manual test: Open page on desktop browser, verify three clocks visible, times increment every second, format toggle works
- [ ] T072 Manual test: Open page on mobile device/emulation, verify single clock per row, labels/times readable, no truncation
- [ ] T073 Manual test: Test keyboard navigation: Tab cycles through format button and clocks, Space/Enter toggles format
- [ ] T074 Manual test: Test screen reader (NVDA/JAWS/VoiceOver): Page announces "World Clock", region labels, time updates

### Documentation & Cleanup
- [ ] T075 Verify all files have clear comments on complex logic (RxJS subscriptions, timezone calculations, responsive breakpoints)
- [ ] T076 Add README.md snippet to `src/app/features/world-clock/` documenting feature entry point, usage, and troubleshooting
- [ ] T077 Update main README.md if needed to mention World Clock page feature availability

---

## Dependency Graph & Execution Strategy

### Critical Path (Sequential, Blocking)

```
T001-T002: Setup directories
    ↓
T003-T006: Models & constants (type foundation)
    ↓
T007-T013: Time service (backend logic)
    ↓
T014-T023: Clock entry component (reusable UI)
    ↓
T024-T040: Page component & route (container, integration)
    ↓
T041-T046: Live update verification & format toggle
    ↓
T047-T067: Responsive design, accessibility, error handling
    ↓
T068-T077: Testing, validation, documentation
```

### Parallelizable Execution

**Independent batches** (can run concurrently after prerequisites):

- **Batch A** (after T013 passes): T014-T023 (Entry component) + T025-T026 (Page init logic) can run in parallel
- **Batch B** (after Batch A): T033-T035 (Page tests) + T037-T038 (Route integration) can run in parallel
- **Batch C** (after Route integration): T039-T040 (E2E setup) can start while component tests finish
- **Batch D** (after T046): T047-T067 (Responsive + accessibility) can run in parallel (independent CSS + logic)

### Recommended Execution Order (Fastest Path)

1. **Phase 0**: T001-T002 (5 min) — Setup
2. **Phase 1**: T003-T013 (45 min) — Models + Service (sequential, foundation)
3. **Phase 2**: 
   - T014-T023 (30 min) — Entry component
   - T024-T040 (60 min) — Page component + Route (can start T025 after T013)
4. **Phase 2.5**: T041-T046 (30 min) — Format toggle + live update tests
5. **Phase 3**: T047-T067 (90 min) — Responsive + accessibility (mostly parallel after T048)
6. **Phase 4**: T068-T077 (30 min) — Testing + documentation

**Total Time**: ~3.5–4.5 hours (sequential path)

---

## Acceptance Criteria

### Per-User-Story

**US1 Completion** (PASS when):
- ✅ All three region times visible on single page desktop view
- ✅ Each time clearly labeled (region + city + time)
- ✅ Page loads in <1s, no loading spinner on fast networks
- ✅ Tests pass: T021-T022, T033-T035, T039-T040

**US2 Completion** (PASS when):
- ✅ Times advance 1 second every ~1000ms
- ✅ Format toggle button works (digital ↔ analog)
- ✅ Tests pass: T043-T046
- ✅ No page refresh required for 5+ minutes observation

**US3 Completion** (PASS when):
- ✅ Mobile (<768px): Single clock/row, no truncation, readable
- ✅ Desktop (>1024px): Three clocks/row, optimal layout
- ✅ WCAG 2.1 AA color contrast compliant
- ✅ Keyboard navigable, screen reader compatible
- ✅ Tests pass: T051-T067
- ✅ aXe audit: 0 violations

### MVP Definition

**Minimum Viable Product** = US1 + US2 (P1 priorities)
- Users can view three country times
- Times update live without manual refresh
- Polished digital clock display
- Accessible basic interaction

**Nice-to-Have** = US3 additions
- Analog clock format
- Responsive mobile layout
- Advanced accessibility features

---

## Testing Summary

| Layer | Count | Tools | Passing Threshold |
|-------|-------|-------|-------------------|
| Unit (service) | 4 | Vitest, fakeAsync | 100% |
| Component | 12 | Vitest, TestBed | 100% |
| E2E | 6+ | Playwright | 100% |
| Accessibility | 1 | aXe audit | 0 violations |
| **Total** | **23+** | | **All Pass** |

---

## References

- **Specification**: [spec.md](spec.md) (FR-001 through FR-007, acceptance scenarios)
- **Implementation Plan**: [plan.md](plan.md) (technical stack, Constitution check, research findings)
- **Data Model**: [data-model.md](data-model.md) (entity definitions, validation rules)
- **Contracts**: [contracts/](contracts/) (UI, state, entry interfaces)
- **Quickstart**: [quickstart.md](quickstart.md) (phase-by-phase implementation guide)
- **Research**: [research.md](research.md) (R1-R6 unknowns resolved, proven patterns)
