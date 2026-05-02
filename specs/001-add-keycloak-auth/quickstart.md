# Quickstart: Keycloak Authentication Flow

## Prerequisites

- Node.js and npm installed locally
- Angular CLI compatible with Angular 21
- Keycloak server available at `http://localhost:8080/`
- Realm `local-demo` configured
- Public OIDC client `angular-local-demo` configured with valid redirect URIs and web origins for the Angular dev server

## Setup

1. Install dependencies with `npm install`.
2. Configure the application's `ApplicationConfig` to call `provideKeycloak` with:
   - URL `http://localhost:8080/`
   - realm `local-demo`
   - client ID `angular-local-demo`
   - `initOptions.onLoad = 'check-sso'`
   - `silentCheckSsoRedirectUri = window.location.origin + '/assets/silent-check-sso.html'`
3. Add `silent-check-sso.html` to `src/assets/`.
4. Create a public welcome route and a protected `/home` route.
5. Add Angular Material UI components for the welcome and home screens.
6. Ensure the Keycloak client `angular-local-demo` is configured as a public OIDC client with valid redirect URIs such as `http://localhost:4200/*` and web origins that include `http://localhost:4200`.
7. If you want to run the Playwright smoke tests locally, install a browser once with `npx playwright install`.

## Run

1. Start Keycloak and verify the realm and client are available.
2. Start the Angular development server with `npm start`.
3. Open the application root route.
4. Confirm the public welcome page appears for anonymous users.
5. Trigger login and complete authentication in Keycloak.
6. Confirm the application redirects to `/home` and displays personalized profile details.

## Validation

1. Open `/` without a session and verify the login action is visible.
2. Open `/home` without a session and verify the user is redirected to `/`.
3. Sign in and refresh the `/home` page while the Keycloak session remains valid; verify the authenticated experience is restored.
4. Simulate missing profile fields and verify the home page shows fallback messaging instead of failing.
5. Run `npm run build` and `npm test -- --watch=false` to validate the Angular build and unit tests.
6. Optionally run `npm run test:e2e` for browser smoke coverage. The real Keycloak login scenario runs only when `KEYCLOAK_E2E_USERNAME` and `KEYCLOAK_E2E_PASSWORD` are set.