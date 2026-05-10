import { expect, test } from '@playwright/test';

test.describe('Header digital clock', () => {
  test('shows digital clock on tablet and desktop widths', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/');

    const clock = page.getByTestId('header-clock');
    await expect(clock).toBeVisible();
    await expect(clock).toContainText(/\d{2}:\d{2}:\d{2}/);
  });

  test('hides digital clock on mobile widths', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto('/');

    await expect(page.getByTestId('header-clock')).toHaveCount(0);
  });

  test('keeps clock centered in top toolbar on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const clock = page.getByTestId('header-clock');
    await expect(clock).toBeVisible();

    const box = await clock.boundingBox();
    expect(box).not.toBeNull();

    const viewportCenter = 1280 / 2;
    const clockCenter = (box?.x ?? 0) + (box?.width ?? 0) / 2;
    expect(Math.abs(viewportCenter - clockCenter)).toBeLessThan(24);
  });
});
