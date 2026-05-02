import { expect, test } from '@playwright/test';

test.describe('Keycloak authentication flow', () => {
  test('shows the public welcome page and protects the home route', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /welcome to the local demo application/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in with keycloak/i })).toBeVisible();

    await page.goto('/home');
    await expect(page).toHaveURL(/\/$/);
  });

  test('can complete a real login when Keycloak e2e credentials are provided', async ({ page }) => {
    test.skip(
      !process.env.KEYCLOAK_E2E_USERNAME || !process.env.KEYCLOAK_E2E_PASSWORD,
      'Set KEYCLOAK_E2E_USERNAME and KEYCLOAK_E2E_PASSWORD to execute the real Keycloak login smoke test.'
    );

    await page.goto('/');
    await page.getByRole('button', { name: /sign in with keycloak/i }).click();

    await page.getByLabel(/username or email/i).fill(process.env.KEYCLOAK_E2E_USERNAME!);
    await page.getByLabel(/password/i).fill(process.env.KEYCLOAK_E2E_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(page.getByRole('heading', { name: /welcome,/i })).toBeVisible();
    await expect(page.getByText(/profile details/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /log off/i })).toBeVisible();

    await page.getByRole('button', { name: /log off/i }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('button', { name: /sign in with keycloak/i })).toBeVisible();
  });
});