# Quickstart: Keycloak Authentication Flow

## Prerequisites

- Node.js and npm installed locally
- Angular CLI compatible with Angular 21
- Keycloak server available at `http://localhost:8080/`
- Realm `local-demo` configured
- Public OIDC client `angular-local-demo` configured with valid redirect URIs and web origins for the Angular dev server

## Setup

1. Install Angular 21 application dependencies, including `keycloak-angular`, `keycloak-js`, and Angular Material.
2. Configure the application's `ApplicationConfig` to call `provideKeycloak` with:
   - URL `http://localhost:8080/`
   - realm `local-demo`
   - client ID `angular-local-demo`
   - `initOptions.onLoad = 'check-sso'`
   - `silentCheckSsoRedirectUri = window.location.origin + '/silent-check-sso.html'`
3. Add `silent-check-sso.html` to the app's static assets.
4. Create a public welcome route and a protected `/home` route.
5. Add Angular Material UI components for the welcome and home screens.

## Run

1. Start Keycloak and verify the realm and client are available.
2. Start the Angular development server.
3. Open the application root route.
4. Confirm the public welcome page appears for anonymous users.
5. Trigger login and complete authentication in Keycloak.
6. Confirm the application redirects to `/home` and displays personalized profile details.

## Validation

1. Open `/` without a session and verify the login action is visible.
2. Open `/home` without a session and verify the user is redirected to `/`.
3. Sign in and refresh the `/home` page while the Keycloak session remains valid; verify the authenticated experience is restored.
4. Simulate missing profile fields and verify the home page shows fallback messaging instead of failing.