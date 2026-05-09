# Implementation Plan: Dynamic JSON Sidebar Menu

**Branch**: `[006-pre-spec-hook-repo]` | **Date**: 2026-05-09 | **Spec**: [specs/006-toggle-json-sidebar/spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-toggle-json-sidebar/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Replace static shell navigation constants with a runtime-loaded JSON menu that
supports two levels, keeping the existing left sidebar toggle behavior and
rendering navigation with Angular Material sidenav/list patterns. Menu JSON will
live in the same public runtime-config folder style already used by Keycloak
configuration so deployment can adjust navigation content without rebuilding the
application.

## Technical Context

**Language/Version**: TypeScript 5.9.x, Angular 21.2.x  
**Primary Dependencies**: Angular standalone APIs, Angular Router, Angular HttpClient, Angular Material (`mat-sidenav`, `mat-nav-list`, `mat-list-item`, `mat-icon`, `mat-expansion-panel` or `mat-nested-tree` pattern), RxJS  
**Storage**: JSON runtime file served from `public/config` (no database changes)  
**Testing**: Angular unit/component tests via `ng test`, integration tests for JSON-loading and navigation wiring, optional Playwright smoke for mobile/desktop interaction  
**Target Platform**: Responsive web application on modern desktop and mobile browsers
**Project Type**: Angular web app  
**Performance Goals**: Sidebar menu content should appear without perceptible lag after shell render (<150 ms after config fetch resolves); toggle interaction remains immediate (<100 ms perceived)  
**Constraints**: Preserve strict typing, keep keyboard/a11y semantics for nested navigation, keep feature-local implementation, and ensure graceful fallback when JSON is missing/invalid  
**Scale/Scope**: One shell sidebar enhancement, one runtime menu JSON contract, one menu-loading service, and focused updates to shell tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec First, Always**: PASS. Planned slices map to FR-001 through FR-010 and the three prioritized user stories in `spec.md`.
- **Angular-Idiomatic by Default**: PASS. Design uses Angular standalone component patterns, RouterLink composition, HttpClient data loading, and Angular Material primitives for navigation.
- **Strong Typing and Contracts**: PASS. Typed contracts are defined for runtime menu payload, two-level entry model, and sidebar UI view state.
- **Test at the Right Level**: PASS. Component tests cover toggle and nested rendering; integration tests cover JSON loading, fallback behavior, and navigation events.
- **Architectural Simplicity**: PASS. A feature-local loader + typed model replaces static constants without introducing new global state containers.

**Post-Design Recheck**: PASS. Research and design keep the solution Angular-idiomatic and minimal while satisfying dynamic JSON and two-level requirements.

## Project Structure

### Documentation (this feature)

```text
specs/006-toggle-json-sidebar/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
public/
└── config/
    ├── keycloak.development.json
    ├── keycloak.staging.json
    ├── keycloak.production.json
    ├── keycloak.json
    └── sidebar-menu.json            # New runtime menu configuration source

src/
├── app/
│   ├── layout/
│   │   ├── app-shell.component.ts
│   │   ├── app-shell.component.html
│   │   ├── app-shell.component.scss
│   │   ├── app-shell.component.spec.ts
│   │   ├── shell-navigation.models.ts
│   │   ├── shell-menu-config.loader.ts      # New feature-local runtime loader
│   │   └── shell-menu.models.ts             # New typed JSON menu contracts
│   └── app.routes.ts
├── assets/
└── styles.scss

e2e/
```

**Structure Decision**: Keep the existing single Angular app layout and store the
menu JSON in `public/config` to mirror existing runtime configuration patterns.
This keeps deployment-time configurability while limiting implementation impact
to shell-local files.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
