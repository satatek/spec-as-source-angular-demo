# Implementation Plan: Organize Auth Header and Landing Pages

**Branch**: `[005-create-feature-branch]` | **Date**: 2026-05-09 | **Spec**: [specs/005-organize-auth-pages/spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-organize-auth-pages/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Organize the shared shell header so authenticated users see a top-right profile
area with icon and email, and account actions are surfaced through a small,
maintainable Angular Material interaction pattern. The plan keeps the component
count intentionally small by using a focused shell header profile trigger, a
dedicated account/profile page, and lightweight page messaging updates for the
welcome and home pages.

## Technical Context

**Language/Version**: TypeScript 5.9.x, Angular 21.2.x  
**Primary Dependencies**: Angular standalone APIs, Angular Router, Angular Material (`mat-toolbar`, `mat-menu`, `mat-icon`, `mat-button`, `mat-list`), Angular CDK Layout, RxJS, keycloak-angular/keycloak-js  
**Storage**: N/A (UI composition and auth-session projection only)  
**Testing**: Angular unit/component tests via `ng test`, route integration tests for profile/account navigation and guard behavior, optional Playwright smoke checks for mobile/desktop profile usability  
**Target Platform**: Responsive web application on modern mobile and desktop browsers
**Project Type**: Angular web app  
**Performance Goals**: Keep top-header rendering aligned with current first-paint baseline and avoid visible layout shifts during auth state changes; keep profile interaction immediate in local validation (<100 ms perceived response)  
**Constraints**: Preserve existing auth behavior and protected-route outcomes, maintain strict typing, keep keyboard/a11y semantics for profile controls, and avoid unnecessary abstraction layers  
**Scale/Scope**: One shared shell header extension, one account/profile route surface, one typed top-profile view-model contract, and targeted updates to welcome/home messaging

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec First, Always**: PASS. Planned slices map directly to FR-001 through FR-010 and all user stories in `spec.md`.
- **Angular-Idiomatic by Default**: PASS. Design uses Angular standalone components, router composition, and Angular Material primitives without custom framework-agnostic wrappers.
- **Strong Typing and Contracts**: PASS. The plan defines typed contracts for top-profile display state, profile action items, and account-page view state.
- **Test at the Right Level**: PASS. Header/profile interactions are validated at component level; routing, auth-state, and responsive behavior are validated at integration level.
- **Architectural Simplicity**: PASS. The feature stays local to shell header/account page surfaces and avoids new global state layers.

**Post-Design Recheck**: PASS. The design keeps responsibility boundaries small and maintainable while meeting mobile/web requirements.

## Project Structure

### Documentation (this feature)

```text
specs/005-organize-auth-pages/
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
│   ├── app.routes.ts
│   ├── core/
│   │   └── auth/
│   ├── features/
│   │   ├── home/
│   │   ├── welcome/
│   │   └── account/
│   └── layout/
│       ├── app-shell.component.ts
│       ├── app-shell.component.html
│       ├── app-shell.component.scss
│       ├── shell-navigation.models.ts
│       └── shell-profile.models.ts
├── assets/
└── styles.scss

e2e/
```

**Structure Decision**: Keep the existing single Angular app structure and add a
small profile-focused contract/model plus a dedicated account feature surface.
This preserves maintainability by keeping the solution to a minimal set of
focused components and contracts.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
