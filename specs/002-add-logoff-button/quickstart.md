# Quickstart: Add Logoff Button

## Setup

1. Install dependencies with `npm install`.
2. Ensure the local Keycloak server is running at `http://localhost:8080/` with realm `local-demo` and public client `angular-local-demo`.
3. Start the Angular application with `npm start`.

## Run

1. Open `http://localhost:4200/`.
2. Sign in from the welcome page.
3. Wait for the application to return to the authenticated detail page at `/home`.
4. Confirm that the page displays profile details and a visible `Log off` button.
5. Select `Log off` and confirm the application returns to the welcome page.

## Validation

1. While authenticated on `/home`, verify the `Log off` button is visible and keyboard reachable.
2. Activate `Log off` and verify the welcome page appears with the sign-in action visible.
3. After logging out, navigate to `/home` manually and verify the application does not render authenticated detail content.
4. Simulate or mock a logout failure and verify a retryable error message is shown on the detail page.
5. Retry the `Log off` action after a simulated failure and verify the page does not require a reload before the next attempt.
6. Run `npm run build` and `npm test -- --watch=false`.
7. Optionally run `npm run test:e2e` after `npx playwright install` to confirm browser-level login and logout redirect boundaries.