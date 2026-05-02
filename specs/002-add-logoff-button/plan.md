# Implementation Plan: Add Logoff Button

**Branch**: `[002-add-logoff-button]` | **Date**: 2026-05-02 | **Spec**: [specs/002-add-logoff-button/spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-add-logoff-button/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Extend the current Angular 21 + Keycloak authentication flow by adding a log
off button to the authenticated user detail page, which is currently the
protected home page. The plan keeps logout ownership inside the existing
`AuthFacade`, uses the native `keycloak.logout()` redirect flow to return users
to the welcome page, clears in-memory profile state, and adds focused component
and integration coverage for sign-out, redirect, and post-logout protection.

## Technical Context

**Language/Version**: TypeScript 5.x, Angular 21.x  
**Primary Dependencies**: Angular Router, Angular Material, RxJS, `keycloak-angular` 21.x, `keycloak-js` 26.2.4  
**Storage**: N/A; session and profile state remain in Keycloak adapter memory plus SPA in-memory signals  
**Testing**: Angular unit/component tests, auth/router integration tests, optional Playwright smoke coverage for logout redirect boundaries  
**Target Platform**: Modern desktop and mobile browsers in a responsive web SPA
**Project Type**: Angular web app  
**Performance Goals**: Logoff interaction shows immediate button feedback on click and returns to the welcome route within 3 seconds in local validation  
**Constraints**: Must extend the current Keycloak flow rather than replacing it, keep strict typing enabled, preserve accessible Angular Material interactions, redirect to the welcome page after logout, and prevent authenticated detail content from persisting after sign-out  
**Scale/Scope**: One SPA, one authenticated detail surface (`/home`), one auth facade, one route guard, and one new user-triggered sign-out path

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec First, Always**: PASS. The planned slices map directly to FR-001 through
  FR-010: detail-page button rendering, logout initiation, redirect to welcome,
  post-logout route protection, and failure feedback.
- **Angular-Idiomatic by Default**: PASS. The design extends the existing
  standalone `HomePageComponent`, Angular Material template, `AuthFacade`, and
  route guard without adding framework-agnostic wrappers.
- **Strong Typing and Contracts**: PASS. The change will extend typed session
  state, add a typed detail-page logout view state, and define explicit logout
  redirect behavior in the UI contract.
- **Test at the Right Level**: PASS. Component tests cover button rendering and
  feedback, integration tests cover facade-driven logout and route protection,
  and optional e2e remains limited to full browser smoke coverage.
- **Architectural Simplicity**: PASS. The existing auth facade is the simplest
  viable owner for logout; no new shared state container or route layer is
  justified.

**Post-Design Recheck**: PASS. The design keeps logout behavior feature-local to
the current authenticated page and existing auth surfaces, while adding only the
minimal typed state and tests needed for sign-out correctness.

## Project Structure

### Documentation (this feature)

```text
specs/002-add-logoff-button/
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
│   ├── core/
│   │   ├── auth/
│   │   │   ├── auth.facade.ts
│   │   │   ├── auth.facade.spec.ts
│   │   │   ├── auth.guard.ts
│   │   │   ├── auth.guard.spec.ts
│   │   │   ├── auth.models.ts
│   │   │   └── profile.models.ts
│   │   └── keycloak/
│   │       └── keycloak.config.ts
│   ├── features/
│   │   ├── home/
│   │   │   ├── home-page.component.ts
│   │   │   ├── home-page.component.html
│   │   │   ├── home-page.component.scss
│   │   │   ├── home-page.component.spec.ts
│   │   │   └── home-page.models.ts
│   │   └── welcome/
│   │       ├── welcome-page.component.ts
│   │       ├── welcome-page.component.html
│   │       ├── welcome-page.component.spec.ts
│   │       └── welcome-page.facade.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
│   └── silent-check-sso.html
└── styles.scss

e2e/
```

**Structure Decision**: Keep the existing single Angular application rooted at
`src/` and implement logout within the current authenticated detail surface at
`src/app/features/home/`, with sign-out session ownership staying in
`src/app/core/auth/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
