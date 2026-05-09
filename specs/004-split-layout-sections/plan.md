# Implementation Plan: Split Application Layout Sections

**Branch**: `[004-feature-branch-hook]` | **Date**: 2026-05-08 | **Spec**: [specs/004-split-layout-sections/spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-split-layout-sections/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Introduce a shared Angular Material app shell that splits the screen into header,
content, and footer sections while keeping page components focused on route
content only. The shell will use Material toolbar and sidenav patterns,
responsive behavior through Angular CDK breakpoints, and router child routes to
ensure shared layout reuse without duplicating markup across pages.

## Technical Context

**Language/Version**: TypeScript 5.9.x, Angular 21.2.x  
**Primary Dependencies**: Angular standalone APIs, Angular Router, Angular Material (`mat-toolbar`, `mat-sidenav`, `mat-list`, `mat-icon`, `mat-button`), Angular CDK Layout, RxJS  
**Storage**: N/A (UI layout only, no persistence changes)  
**Testing**: Angular unit/component tests via `ng test`, focused route integration checks, optional Playwright smoke for responsive behavior  
**Target Platform**: Modern desktop/mobile browsers, responsive SPA
**Project Type**: Angular web app  
**Performance Goals**: Keep first route interactive within current baseline; avoid layout shift spikes during route transitions; sidenav toggle perceived response under 100 ms locally  
**Constraints**: Preserve existing auth guard behavior, keep strict typing, maintain semantic landmarks (`header`, `main`, `footer`, `nav`), avoid feature-page layout duplication  
**Scale/Scope**: One root shell component, two existing primary routes (`/`, `/home`), one guarded route, one reusable layout contract

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec First, Always**: PASS. Planned slices map to FR-001 through FR-010,
  with shell structure, route scoping, responsiveness, and reuse behavior all
  traceable to the approved specification.
- **Angular-Idiomatic by Default**: PASS. Design uses standalone components,
  router child composition, Angular CDK breakpoints, and Angular Material
  primitives rather than custom layout wrappers.
- **Strong Typing and Contracts**: PASS. The plan defines typed contracts for
  layout sections, shell navigation items, and route scope consumed by the shell.
- **Test at the Right Level**: PASS. Layout structure and interactions are proven
  at component/integration level; optional e2e smoke remains narrow and focused.
- **Architectural Simplicity**: PASS. A single app shell and route nesting is the
  smallest viable approach; no global state layer is introduced.

**Post-Design Recheck**: PASS. Phase 1 artifacts keep layout concerns local to
shell and routing boundaries, preserving existing feature business logic.

## Project Structure

### Documentation (this feature)

```text
specs/004-split-layout-sections/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── app.component.html
│   ├── app.component.ts
│   ├── app.routes.ts
│   ├── core/
│   │   └── auth/
│   ├── features/
│   │   ├── home/
│   │   └── welcome/
│   └── layout/
│       ├── app-shell.component.ts
│       ├── app-shell.component.html
│       ├── app-shell.component.scss
│       └── shell-navigation.models.ts
├── assets/
└── styles.scss

e2e/
```

**Structure Decision**: Keep the existing Angular single-app structure and add a
dedicated `layout/` slice under `src/app/` for the shared Material shell. Route
definitions in `src/app/app.routes.ts` become the source of truth for shell
scope by nesting current pages as shell children.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
