<!--
Sync Impact Report
Version change: 1.0.0 -> 1.0.1
Modified principles:
- Principle 1 title translated to English
- Principle 2 title translated to English
- Principle 3 title translated to English
- Principle 4 title translated to English
- Principle 5 title translated to English
Added sections:
- Technical Guardrails
- Workflow & Quality Gates
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
Follow-up TODOs:
- None
-->
# spec-as-source-angular-demo Constitution

## Core Principles

### I. Spec First, Always
Every feature MUST begin with a specification, implementation plan, and ordered
task list before production code is introduced. Every code change MUST map back
to at least one requirement, scenario, or task artifact. Emergency fixes may be
applied directly only when production risk requires it, and the missing spec
artifacts MUST be backfilled before the change is considered complete. Rationale:
this repository exists to prove that intent remains primary and implementation
remains subordinate.

### II. Angular-Idiomatic by Default
Application code MUST prefer Angular's native patterns over framework-agnostic
workarounds. New UI work MUST default to standalone components, explicit route
composition, dependency injection through providers, and reactive forms for
multi-field or validation-heavy input flows. Shared abstractions MUST not hide
Angular lifecycle, template flow, or dependency boundaries when built-in Angular
primitives already solve the problem. Rationale: the experiment only has value if
the generated code is recognizably Angular and maintainable by Angular teams.

### III. Strong Typing and Contracts
TypeScript strictness MUST remain enabled. Component inputs and outputs, service
interfaces, route data, API DTOs, and form models MUST be explicitly typed.
Unchecked any usage, broad type assertions, or untyped JSON traversal MUST carry
a local justification and a containment boundary. Rationale: strong contracts are
the main defense against silent regressions in AI-generated Angular code.

### IV. Test at the Right Level
Each change MUST add or update tests at the cheapest level that proves the
behavior under change. Pure logic belongs in unit tests, template interaction and
component state belong in Angular component tests, and route or service wiring
belongs in integration tests. End-to-end tests SHOULD be reserved for critical
user journeys that cannot be defended lower in the stack. Bug fixes MUST include
a regression test unless the failure mode is impossible to automate and that
exception is documented. Rationale: quality comes from precise coverage, not from
maximizing test count.

### V. Architectural Simplicity
New layers, wrappers, shared state containers, or reusable libraries MUST only be
introduced when the specification or at least two real consumers justify them.
Feature-local code is the default. Any deliberate increase in architectural
complexity MUST be recorded in the plan's Complexity Tracking section together
with the rejected simpler alternative. Rationale: the repo is a pressure test for
spec-first development, not a sandbox for speculative abstraction.

## Technical Guardrails

- The frontend stack MUST be Angular-first and TypeScript-first; framework mixing
	is not allowed unless a feature plan records the boundary and reason.
- User-facing flows MUST define loading, empty, success, and error states when
	data is fetched or mutated asynchronously.
- Accessibility is mandatory for interactive UI: semantic controls, keyboard
	navigation, visible focus treatment, and error messaging that can be perceived
	without guesswork.
- Source organization SHOULD be feature-oriented as the application grows, with
	cross-feature utilities moved to shared locations only after repeated use is
	demonstrated.

## Workflow & Quality Gates

- `/speckit.specify`, `/speckit.plan`, and `/speckit.tasks` artifacts MUST exist
	before implementation begins for a new feature.
- The Constitution Check in each plan MUST verify compliance with all five core
	principles and record any justified deviation before coding starts.
- A change is not merge-ready until the relevant build, lint, and test commands
	pass for the touched scope.
- Code review MUST verify traceability from changed files back to requirements,
	scenarios, and tasks, plus compliance with Angular and typing rules.

## Governance

This constitution overrides conflicting local habits and template defaults.
Amendments MUST be made in `.specify/memory/constitution.md`, MUST include a Sync
Impact Report, and MUST update any affected templates in the same change.

Versioning policy is semantic:

- MAJOR for removed or fundamentally redefined principles or governance rules.
- MINOR for new principles, new mandatory sections, or materially stronger rules.
- PATCH for clarifications, wording improvements, and non-semantic refinements.

Compliance review is required for every plan and every merge review. Violations
MUST either be fixed before merge or explicitly documented in the relevant plan's
Complexity Tracking section with reviewer acknowledgment.

**Version**: 1.0.1 | **Ratified**: 2026-05-02 | **Last Amended**: 2026-05-02
