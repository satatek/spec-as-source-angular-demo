# Quickstart: Environment-Specific Keycloak Configuration

## Prerequisites

- Node.js and npm installed locally
- Angular CLI compatible with Angular 21
- Keycloak environments available for development, staging, and production
- A deployment mechanism that can serve the active runtime config file at `/config/keycloak.json`

## Setup

1. Install dependencies with `npm install`.
2. Create environment-specific runtime config files for development, staging, and production under `public/config/`.
3. Copy or publish the selected environment config as `public/config/keycloak.json` for the target deployment.
4. Configure each Keycloak client with valid redirect URIs and web origins for the corresponding environment origin.
5. Keep `silent-check-sso.html` available under `/assets/` for all environments.

## Example Runtime Configs

Development example:

```json
{
  "environmentName": "development",
  "keycloakUrl": "https://sso.dev.example.com",
  "realm": "demo-dev",
  "clientId": "angular-demo-web",
  "silentCheckSsoPath": "/assets/silent-check-sso.html",
  "postLoginRoute": "/home",
  "postLogoutRoute": "/"
}
```

Staging example:

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

Production example:

```json
{
  "environmentName": "production",
  "keycloakUrl": "https://sso.example.com",
  "realm": "demo-prod",
  "clientId": "angular-demo-web",
  "silentCheckSsoPath": "/assets/silent-check-sso.html",
  "postLoginRoute": "/home",
  "postLogoutRoute": "/"
}
```

## Run

1. Serve the desired environment's config as `/config/keycloak.json`.
2. Start the Angular app with `npm start` for local verification or deploy the built app to the target environment.
3. Open the app and verify the welcome page loads without attempting to use a localhost Keycloak origin.
4. Trigger login and confirm the redirect returns to the same application origin.

## Validation

1. Run `npm test -- --watch=false` and verify config-loader and provider tests pass.
2. Run `npm run build` and verify the app builds with the runtime config approach.
3. Replace `/config/keycloak.json` with an invalid payload and verify the app reports an application configuration error instead of redirecting to localhost.
4. Verify development, staging, and production each return users to their own environment origin after login.