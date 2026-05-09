# Quickstart: Organize Auth Header and Landing Pages

## Prerequisites

- Node.js and npm installed
- Dependencies installed via `npm install`
- Existing auth/session integration available in the application shell

## Implementation Steps

1. Extend the shared shell header with a top-right profile entry point using Angular Material menu patterns.
2. Introduce typed contracts for profile state, profile actions, and account page view state.
3. Reuse the existing auth facade/session/profile sources to drive header email display and action visibility.
4. Add a dedicated account/profile page for organized login, logoff, and profile details.
5. Update welcome and home page copy to reflect demo and logged-in states with a friendly tone.
6. Ensure responsive behavior preserves profile discoverability on mobile and desktop.
7. Apply accessible labels and keyboard-friendly interactions for the profile trigger and menu actions.

## Validation Steps

1. Run `npm test -- --watch=false` and verify header/profile and messaging tests pass.
2. Run `npm start` and manually verify:
   - Top-right profile area appears for authenticated users
   - Anonymous state hides auth-only actions
   - The profile menu opens the account page and exposes logoff
   - Account navigation and sign-out flows behave correctly
   - Mobile and desktop layouts keep the profile reachable
   - Welcome/home messaging matches auth state
3. Run `npm run build` and confirm no build regressions in touched scope.

## Expected Outcome

- Top-right profile entry point is consistent across shell routes.
- Auth-related information is organized in a maintainable way.
- Welcome and home pages feel friendly, demo-oriented, and auth-aware.
- The account page centralizes profile details and sign-out access.

## Validation Notes

- `npm test -- --watch=false` passed with 44 tests across 11 test files.
- `npm run build` passed with one initial bundle budget warning for the main bundle.
