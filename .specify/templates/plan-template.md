# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., TypeScript 5.x, Angular 20.x or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., Angular, RxJS, Angular Router, Angular Forms or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., Angular unit/component tests, integration tests, Playwright or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., modern web browsers, responsive web app or NEEDS CLARIFICATION]
**Project Type**: [e.g., Angular web app, Angular library, Angular + API system or NEEDS CLARIFICATION]  
**Performance Goals**: [domain-specific, e.g., first route interactive under 2s, route transitions under 200ms or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., strict typing, accessible interactions, SSR compatibility or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10 feature areas, 30 routes, 3 user roles or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec First, Always**: Link every planned implementation slice to at least one
  requirement or scenario from `spec.md`.
- **Angular-Idiomatic by Default**: Confirm the design uses Angular-native
  primitives before introducing custom wrappers or framework mixing.
- **Strong Typing and Contracts**: List the explicit contracts that will need types
  such as DTOs, route data, form models, and service interfaces.
- **Test at the Right Level**: Identify the lowest-cost test layer that proves each
  critical behavior and note any required regression coverage.
- **Architectural Simplicity**: Record any added layers, shared state, or
  abstractions and justify them in Complexity Tracking if they are not the
  simplest viable option.

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
# [REMOVE IF UNUSED] Option 1: Angular single application (DEFAULT)
src/
├── app/
│   ├── core/
│   ├── features/
│   ├── shared/
│   └── app.routes.ts
├── assets/
└── styles/

e2e/

# [REMOVE IF UNUSED] Option 2: Angular frontend + API
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   ├── features/
│   │   ├── shared/
│   │   └── app.routes.ts
│   └── assets/
└── e2e/

backend/
├── src/
└── tests/

# [REMOVE IF UNUSED] Option 3: Angular workspace with shared library
projects/
├── app-shell/
└── shared-ui/
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
