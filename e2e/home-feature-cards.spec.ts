import { expect, test } from '@playwright/test';

const hasKeycloakCredentials =
  Boolean(process.env.KEYCLOAK_E2E_USERNAME) && Boolean(process.env.KEYCLOAK_E2E_PASSWORD);

test.describe('Home feature cards', () => {
  test('shows direct and grouped feature cards after login', async ({ page }) => {
    test.skip(!hasKeycloakCredentials, 'Set KEYCLOAK_E2E_USERNAME and KEYCLOAK_E2E_PASSWORD to run authenticated Home checks.');

    await page.goto('/');
    await page.getByRole('button', { name: /sign in with keycloak/i }).click();

    await page.getByLabel(/username or email/i).fill(process.env.KEYCLOAK_E2E_USERNAME!);
    await page.getByLabel(/password/i).fill(process.env.KEYCLOAK_E2E_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/home$/);

    await expect(page.locator('[data-testid="home-feature-card"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="home-feature-group-panel"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="home-group-child-card"]').first()).toBeVisible();
  });

  test('navigates when clicking a direct feature card', async ({ page }) => {
    test.skip(!hasKeycloakCredentials, 'Set KEYCLOAK_E2E_USERNAME and KEYCLOAK_E2E_PASSWORD to run authenticated Home checks.');

    await page.goto('/');
    await page.getByRole('button', { name: /sign in with keycloak/i }).click();

    await page.getByLabel(/username or email/i).fill(process.env.KEYCLOAK_E2E_USERNAME!);
    await page.getByLabel(/password/i).fill(process.env.KEYCLOAK_E2E_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/home$/);

    await page.locator('[data-testid="home-feature-card"]').first().click();
    await expect(page).not.toHaveURL(/\/home$/);
  });

  test('keeps home cards aligned with side-menu labels when authenticated', async ({ page }) => {
    test.skip(!hasKeycloakCredentials, 'Set KEYCLOAK_E2E_USERNAME and KEYCLOAK_E2E_PASSWORD to run authenticated Home checks.');

    await page.goto('/');
    await page.getByRole('button', { name: /sign in with keycloak/i }).click();

    await page.getByLabel(/username or email/i).fill(process.env.KEYCLOAK_E2E_USERNAME!);
    await page.getByLabel(/password/i).fill(process.env.KEYCLOAK_E2E_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/home$/);

    const navLabels = await page
      .locator('nav[aria-label="Primary navigation"] [matlistitemtitle]')
      .allTextContents();

    const homeLabels = await page
      .locator('[data-testid="home-feature-card"] .feature-card__title, [data-testid="home-group-child-card"] .feature-card__title')
      .allTextContents();

    const normalizedHomeLabels = homeLabels.map((label) => label.trim()).filter((label) => label.length > 0);
    for (const navLabel of navLabels.map((label) => label.trim())) {
      if (navLabel.length === 0 || navLabel === 'Home') {
        continue;
      }

      expect(normalizedHomeLabels.some((label) => label.includes(navLabel))).toBe(true);
    }
  });

  test('keeps cards readable in mobile viewport', async ({ page }) => {
    test.skip(!hasKeycloakCredentials, 'Set KEYCLOAK_E2E_USERNAME and KEYCLOAK_E2E_PASSWORD to run authenticated Home checks.');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: /sign in with keycloak/i }).click();

    await page.getByLabel(/username or email/i).fill(process.env.KEYCLOAK_E2E_USERNAME!);
    await page.getByLabel(/password/i).fill(process.env.KEYCLOAK_E2E_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(page.locator('[data-testid="home-feature-card"]').first()).toBeVisible();
  });

  test('keeps multi-column visibility in desktop viewport', async ({ page }) => {
    test.skip(!hasKeycloakCredentials, 'Set KEYCLOAK_E2E_USERNAME and KEYCLOAK_E2E_PASSWORD to run authenticated Home checks.');

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.getByRole('button', { name: /sign in with keycloak/i }).click();

    await page.getByLabel(/username or email/i).fill(process.env.KEYCLOAK_E2E_USERNAME!);
    await page.getByLabel(/password/i).fill(process.env.KEYCLOAK_E2E_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/home$/);

    const cards = page.locator('[data-testid="home-feature-card"]');
    await expect(cards.first()).toBeVisible();
    await expect(cards.nth(1)).toBeVisible();
  });
});
