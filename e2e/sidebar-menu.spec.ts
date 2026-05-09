import { expect, test } from '@playwright/test';

test.describe('Dynamic sidebar menu', () => {
  test('shows and hides the sidebar with the shared header toggle', async ({ page }) => {
    await page.goto('/');

    const sidebar = page.locator('mat-sidenav');
    await expect(sidebar).toBeVisible();

    const toggle = page.getByRole('button', { name: /toggle sidebar navigation/i });
    await toggle.click();
    await expect(sidebar).toBeHidden();

    await toggle.click();
    await expect(sidebar).toBeVisible();
  });

  test('renders runtime-loaded top-level navigation for anonymous visitors', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: /primary navigation/i });
    await expect(nav).toContainText('Welcome');
    await expect(nav).not.toContainText('Home');
  });
});
