# Implementation Plan: Environment-Specific Keycloak Configuration

**Branch**: `[003-keycloak-env-config]` | **Date**: 2026-05-08 | **Spec**: [specs/003-keycloak-env-config/spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-keycloak-env-config/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Replace the hardcoded Keycloak bootstrap settings with a typed runtime
configuration loaded before Angular bootstraps, so one deployable SPA can run in
development, staging, or production without source edits or localhost-only
defaults. The plan keeps authentication behavior in the existing Keycloak
provider and `AuthFacade`, introduces a small runtime-config loading and
validation slice, and documents a stable external contract for environment-owned
configuration.

## Technical Context

**Language/Version**: TypeScript 5.9.x, Angular 21.2.x  
**Primary Dependencies**: Angular standalone bootstrap APIs, Angular Router, Angular HttpClient, RxJS, `keycloak-angular` 21.x, `keycloak-js` 26.2.4  
**Storage**: Static runtime configuration file served with the SPA; no persistent application storage changes  
**Testing**: Angular unit/integration tests via `ng test`, focused config-loader/provider tests, optional Playwright smoke verification for non-localhost redirect behavior  
**Target Platform**: Modern desktop and mobile browsers in a responsive web SPA
**Project Type**: Angular web app  
**Performance Goals**: Runtime config load adds only one small startup request and keeps auth initialization ready within 500 ms of config availability in local validation  
**Constraints**: Must not hardcode environment-specific Keycloak values in source, must not default non-local environments to localhost, must preserve strict typing and current auth journeys, and must fail clearly when runtime config is missing or invalid  
**Scale/Scope**: One SPA, one bootstrap path, one Keycloak provider, one runtime config contract, and three named target environments (development, staging, production)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec First, Always**: PASS. The planned slices map directly to FR-001 through
  FR-010: runtime configuration ownership, startup validation, environment-safe
  redirect handling, and preserved auth journeys.
- **Angular-Idiomatic by Default**: PASS. The design uses Angular bootstrap and
  provider composition, with a small typed runtime-config utility rather than a
  framework-agnostic wrapper or custom auth shell.
- **Strong Typing and Contracts**: PASS. The plan adds explicit types for the
  environment-supplied Keycloak config payload, the validated runtime settings,
  and the bootstrap failure outcome surfaced to the app.
- **Test at the Right Level**: PASS. Pure config parsing and validation stay in
  unit tests, provider/bootstrap wiring stays in integration tests, and any
  browser redirect smoke check remains optional and narrow.
- **Architectural Simplicity**: PASS. A runtime config loader at bootstrap is the
  smallest viable abstraction that supports one deploy artifact across multiple
  environments; no new shared state container is required.

**Post-Design Recheck**: PASS. The design keeps environment awareness confined to
bootstrap and Keycloak configuration boundaries while preserving the existing
route, facade, and UI structure.

## Project Structure

### Documentation (this feature)

```text
specs/003-keycloak-env-config/
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
  └── keycloak.json

src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   │   ├── auth.facade.ts
│   │   │   └── auth.facade.spec.ts
│   │   ├── config/
│   │   │   ├── runtime-config.models.ts
│   │   │   ├── runtime-config.loader.ts
│   │   │   └── runtime-config.loader.spec.ts
│   │   └── keycloak/
│   │       ├── keycloak.config.ts
│   │       └── keycloak.config.spec.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
│   └── silent-check-sso.html
└── main.ts

e2e/
```

**Structure Decision**: Keep the existing single Angular application rooted at
`src/`, add environment-owned runtime config files under `public/config/`, and
introduce the smallest typed config-loading slice under `src/app/core/config/`.
Bootstrap in `src/main.ts` becomes the owner of loading and validating runtime
settings before `provideAppKeycloak` is composed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
