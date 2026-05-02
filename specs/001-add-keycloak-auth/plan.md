# Implementation Plan: Keycloak Authentication Flow

**Branch**: `[001-add-keycloak-auth]` | **Date**: 2026-05-02 | **Spec**: [specs/001-add-keycloak-auth/spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-add-keycloak-auth/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build an Angular 21 single-page application that integrates with Keycloak 26.6.1
through `keycloak-angular` to provide a public welcome page, a Keycloak-driven
login flow, and a protected home page that renders personalized identity data.
The plan uses Angular standalone architecture, route-level auth protection,
Angular Material for presentation, and `provideKeycloak` with `check-sso`
initialization so the app can restore existing sessions without forcing login on
the public entry route.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, Angular 21.x  
**Primary Dependencies**: Angular Router, Angular Material, RxJS, `keycloak-angular` 21.x, `keycloak-js` 26.6.1  
**Storage**: N/A; authentication tokens remain in Keycloak adapter memory and identity data is session-scoped in the SPA  
**Testing**: Angular unit/component tests, router/auth integration tests, optional e2e smoke coverage for login redirect boundaries  
**Target Platform**: Modern desktop and mobile browsers in a responsive web SPA
**Project Type**: Angular web app  
**Performance Goals**: Public welcome route interactive under 2 seconds locally; authenticated home view renders profile state within 3 seconds after successful Keycloak return  
**Constraints**: Must use `keycloak-angular`, Angular Material UI, the local Keycloak server at `http://localhost:8080/`, realm `local-demo`, client `angular-local-demo`, strict typing, accessible UI, and a public welcome route that does not force login on initial load  
**Scale/Scope**: One SPA with two primary routes, one authentication integration surface, and one protected personalized home experience

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec First, Always**: PASS. The welcome route, login initiation, authenticated
  redirect, profile display, and failure handling each map directly to FR-001
  through FR-010 and User Stories 1 through 3 in `spec.md`.
- **Angular-Idiomatic by Default**: PASS. The design uses standalone components,
  `ApplicationConfig`, `provideKeycloak`, Angular router guards, and Angular
  Material components without introducing framework-agnostic wrappers.
- **Strong Typing and Contracts**: PASS. Explicit types will be defined for auth
  session state, Keycloak profile view data, route access decisions, and UI view
  states.
- **Test at the Right Level**: PASS. Component tests cover welcome/home rendering,
  integration tests cover route protection and auth handoff behavior, and e2e is
  reserved for optional redirect smoke validation.
- **Architectural Simplicity**: PASS. A single feature-local auth facade plus
  route guard is sufficient; no global state library or additional abstraction
  layer is justified.

**Post-Design Recheck**: PASS. The design artifacts preserve route-local behavior,
keep Keycloak integration within Angular-native providers and guards, and define
only the typed surfaces necessary for this feature.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   └── keycloak/
│   ├── features/
│   │   ├── home/
│   │   └── welcome/
│   ├── shared/
│   │   ├── layout/
│   │   └── ui/
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
│   └── silent-check-sso.html
└── styles/

e2e/
```

**Structure Decision**: Use a single Angular application rooted at `src/` with a
small `core/auth` integration layer for Keycloak setup and route protection,
feature-local pages under `src/app/features/`, and a static `silent-check-sso.html`
asset required by the `check-sso` initialization path.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
