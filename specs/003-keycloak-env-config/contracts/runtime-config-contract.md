# Runtime Configuration Contract: Keycloak Environment Settings

## Endpoint

### `GET /config/keycloak.json`

**Purpose**: Provides the active environment's Keycloak settings to the SPA at runtime before Angular bootstraps.

**Behavior**:
- Returns one JSON document describing the current environment's Keycloak settings.
- Is owned by the target deployment environment, not by user interaction inside the app.
- Must be available before authentication initialization begins.

## Payload

```json
{
  "environmentName": "staging",
  "keycloakUrl": "https://sso.staging.example.com",
  "realm": "demo-staging",
  "clientId": "angular-demo-web",
  "silentCheckSsoPath": "/assets/silent-check-sso.html",
  "postLoginRoute": "/home",
  "postLogoutRoute": "/"
}
```

## Field Rules

- `environmentName`: Required. One of `development`, `staging`, or `production`.
- `keycloakUrl`: Required. Absolute URL to the Keycloak server for the active environment.
- `realm`: Required. Non-empty Keycloak realm identifier.
- `clientId`: Required. Non-empty client identifier configured for the SPA.
- `silentCheckSsoPath`: Required. App-relative path used to build the silent SSO redirect URI.
- `postLoginRoute`: Required. App-relative route used after successful authentication.
- `postLogoutRoute`: Required. App-relative route used after logout.

## Validation Expectations

- The application must reject payloads with missing required fields.
- The application must reject payloads whose route fields are not app-relative.
- The application must derive redirect URIs from the active browser origin instead of trusting hardcoded origin values from the payload.
- The application must surface a clear configuration error when this contract cannot be loaded or validated.