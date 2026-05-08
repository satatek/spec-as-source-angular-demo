# Data Model: Environment-Specific Keycloak Configuration

## EnvironmentConfigurationProfile

**Purpose**: Represents the deployer-owned Keycloak configuration supplied for a named target environment.

**Fields**:
- `environmentName`: `'development' | 'staging' | 'production'`
- `keycloakUrl`: string
- `realm`: string
- `clientId`: string
- `silentCheckSsoPath`: string
- `postLoginRoute`: string
- `postLogoutRoute`: string

**Validation Rules**:
- `environmentName` MUST be one of the supported environment labels.
- `keycloakUrl`, `realm`, and `clientId` MUST be present and non-empty.
- `silentCheckSsoPath` MUST be an app-relative path beginning with `/`.
- `postLoginRoute` and `postLogoutRoute` MUST be safe app-relative routes.
- Non-local environments MUST not depend on localhost-derived values.

## KeycloakRuntimeSettings

**Purpose**: Represents the validated runtime settings consumed by Angular bootstrap and the Keycloak provider.

**Fields**:
- `environmentName`: `'development' | 'staging' | 'production'`
- `keycloakUrl`: string
- `realm`: string
- `clientId`: string
- `appOrigin`: string
- `silentCheckSsoRedirectUri`: string
- `postLoginRedirectUri`: string
- `postLogoutRedirectUri`: string

**Validation Rules**:
- `appOrigin` MUST be derived from the active browser origin.
- `silentCheckSsoRedirectUri`, `postLoginRedirectUri`, and `postLogoutRedirectUri` MUST be derived from `appOrigin` plus validated app-relative paths.
- Derived redirect URIs MUST stay on the active application origin.

## ConfigurationValidationOutcome

**Purpose**: Represents whether startup configuration is ready for authentication initialization.

**Fields**:
- `status`: `'ready' | 'missing' | 'invalid'`
- `message`: string | null
- `settings`: `KeycloakRuntimeSettings | null`

**Validation Rules**:
- `settings` MUST be present only when `status` is `ready`.
- `message` MUST be present when `status` is `missing` or `invalid`.

**State Transitions**:
- `missing -> ready` when a complete environment config becomes available.
- `invalid -> ready` when malformed config is corrected.
- `ready -> invalid` when a later validation step detects a route or origin mismatch during bootstrap.