/**
 * World Clock E2E Tests (T039-T040)
 * Tests for User Story 1: View multiple country times
 */

import { test, expect } from '@playwright/test';

test.describe('World Clock Page - US1 (View Multiple Country Times)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to World Clock page
    await page.goto('/world-clock', { waitUntil: 'networkidle' });
  });

  test('T039: Navigate to /world-clock and verify three clock cards visible with Brazil, UK, China labels', async ({
    page,
  }) => {
    // Verify page loads without errors
    const heading = page.locator('h1');
    await expect(heading).toContainText('World Clock');

    // Verify three clock entries rendered
    const clockCards = page.locator('app-world-clock-entry');
    await expect(clockCards).toHaveCount(3);

    // Verify region labels present
    const regionNames = page.locator('.region-name');
    await expect(regionNames).toHaveCount(3);

    const regions = await regionNames.allTextContents();
    expect(regions).toContain('Brazil');
    expect(regions).toContain('United Kingdom');
    expect(regions).toContain('China');

    // Verify city names
    const cityNames = page.locator('.city-name');
    const cities = await cityNames.allTextContents();
    expect(cities).toContain('Brasília');
    expect(cities).toContain('London');
    expect(cities).toContain('Shanghai');
  });

  test('T040: Page title and header text match specification', async ({ page }) => {
    // Verify page title
    const heading = page.locator('h1');
    await expect(heading).toContainText('World Clock');

    // Verify subtitle is present
    const subtitle = page.locator('.subtitle');
    await expect(subtitle).toBeVisible();
    const subtitleText = await subtitle.textContent();
    expect(subtitleText).toContain('clock');
  });

  test('US1 Acceptance: All three region times visible on single screen', async ({ page }) => {
    // Verify all three clock cards are in viewport
    const clockCards = page.locator('app-world-clock-entry');
    
    for (let i = 0; i < 3; i++) {
      const card = clockCards.nth(i);
      await expect(card).toBeVisible();
    }

    // Verify formatted time (HH:MM:SS) is displayed for each
    const digitalClocks = page.locator('.digital-clock');
    const times = await digitalClocks.allTextContents();
    expect(times.length).toBe(3);
    
    // Each time should match HH:MM:SS format
    times.forEach((time) => {
      expect(time).toMatch(/\d{2}:\d{2}:\d{2}/);
    });
  });

  test('US1 Acceptance: Each time clearly labeled with region and city name', async ({ page }) => {
    const clockCards = page.locator('app-world-clock-entry');
    
    const expectedLabels = [
      { region: 'Brazil', city: 'Brasília' },
      { region: 'United Kingdom', city: 'London' },
      { region: 'China', city: 'Shanghai' },
    ];

    for (let i = 0; i < expectedLabels.length; i++) {
      const card = clockCards.nth(i);
      const regionName = card.locator('.region-name');
      const cityName = card.locator('.city-name');

      await expect(regionName).toContainText(expectedLabels[i].region);
      await expect(cityName).toContainText(expectedLabels[i].city);
    }
  });
});
