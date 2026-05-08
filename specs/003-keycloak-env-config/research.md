# Research: Environment-Specific Keycloak Configuration

## Decision 1: Load Keycloak settings from a runtime JSON file served at a stable path

**Decision**: Serve the active environment's Keycloak settings from a stable public path such as `/config/keycloak.json`, and load that file before `bootstrapApplication` runs.

**Rationale**: This satisfies the feature's core requirement to avoid hardcoded environment values and enables one deployable SPA artifact to run in development, staging, or production by changing only the environment-owned config file. It also keeps the controlling logic in the bootstrap path that already owns application startup.

**Alternatives considered**:
- Angular file replacements or `environment.ts` per build: rejected because they still require environment-specific builds and source-level configuration changes.
- Embedding deployment variables directly in TypeScript source: rejected because it violates FR-002 and makes the artifact less portable.

## Decision 2: Derive redirect origins from the browser origin and validate config instead of falling back to localhost

**Decision**: Compute redirect URIs from `window.location.origin` at runtime, combine them with the configured silent-check path, and fail validation when required config is missing or malformed instead of silently using localhost defaults.

**Rationale**: The current failure mode comes from hardcoded localhost values in the Keycloak provider. Deriving the active origin from the running browser ensures that sign-in and sign-out return users to the environment they are actually using, while explicit validation prevents cross-environment drift and silent misconfiguration.

**Alternatives considered**:
- Store full redirect URIs for every route in the JSON payload: rejected because it duplicates the active browser origin and increases configuration drift risk.
- Keep localhost as a fallback for convenience: rejected because it violates FR-003 and can redirect staging or production users to the wrong environment.

## Decision 3: Refactor bootstrap and provider wiring, not the existing auth facade or routes

**Decision**: Refactor `src/main.ts` to await runtime config loading, change `app.config.ts` to compose providers from validated runtime settings, and keep `AuthFacade`, route guards, and page flows unchanged unless they need the new config contract directly.

**Rationale**: `src/main.ts` and `src/app/core/keycloak/keycloak.config.ts` are the narrowest code owners of the current hardcoded behavior. Keeping the change at bootstrap preserves the existing authenticated and anonymous journeys while minimizing regression risk.

**Alternatives considered**:
- Fetch runtime config inside `AuthFacade`: rejected because auth facade methods are not the bootstrap owner and would delay failure detection until after application startup.
- Wrap Keycloak behind a larger custom authentication service: rejected because it adds a new abstraction layer without solving the actual environment-configuration problem.

## Decision 4: Add focused tests for config loading, validation, and provider composition

**Decision**: Add unit tests for parsing and validation of the runtime config payload plus integration-style tests for provider creation and bootstrap failure handling.

**Rationale**: The change is configuration-driven rather than UI-driven, so the cheapest proof lives below component tests. Narrow tests protect the critical startup path and environment redirect behavior without expanding end-to-end coverage unnecessarily.

**Alternatives considered**:
- Rely only on manual environment testing: rejected because it would miss regressions in validation rules and would be slower to diagnose.
- Add a large end-to-end suite for every environment: rejected because it is expensive relative to the small bootstrap surface being changed.