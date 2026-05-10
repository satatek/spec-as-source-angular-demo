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

  test('T039: Navigate to /world-clock and verify nine clock cards visible with key country labels', async ({
    page,
  }) => {
    // Verify page loads without errors
    const heading = page.locator('h1');
    await expect(heading).toContainText('World Clock');

    // Verify nine clock entries rendered
    const clockCards = page.locator('app-world-clock-entry');
    await expect(clockCards).toHaveCount(9);

    // Verify region labels present
    const regionNames = page.locator('.region-name');
    await expect(regionNames).toHaveCount(9);

    const regions = await regionNames.allTextContents();
    expect(regions).toContain('Brazil');
    expect(regions).toContain('United Kingdom');
    expect(regions).toContain('China');
    expect(regions).toContain('United States');
    expect(regions).toContain('India');
    expect(regions).toContain('Japan');
    expect(regions).toContain('Germany');
    expect(regions).toContain('Australia');
    expect(regions).toContain('United Arab Emirates');

    // Verify city names
    const cityNames = page.locator('.city-name');
    const cities = await cityNames.allTextContents();
    expect(cities).toContain('Brasília');
    expect(cities).toContain('London');
    expect(cities).toContain('Shanghai');
    expect(cities).toContain('New York');
    expect(cities).toContain('New Delhi');
    expect(cities).toContain('Tokyo');
    expect(cities).toContain('Berlin');
    expect(cities).toContain('Sydney');
    expect(cities).toContain('Dubai');
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

  test('US1 Acceptance: Multiple region times visible on screen', async ({ page }) => {
    // Verify the first three clock cards are visible
    const clockCards = page.locator('app-world-clock-entry');
    
    for (let i = 0; i < 3; i++) {
      const card = clockCards.nth(i);
      await expect(card).toBeVisible();
    }

    // Verify formatted time (HH:MM:SS) is displayed for each
    const digitalClocks = page.locator('.digital-clock');
    const times = await digitalClocks.allTextContents();
    expect(times.length).toBe(9);
    
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
      { region: 'United States', city: 'New York' },
      { region: 'India', city: 'New Delhi' },
      { region: 'Japan', city: 'Tokyo' },
      { region: 'Germany', city: 'Berlin' },
      { region: 'Australia', city: 'Sydney' },
      { region: 'United Arab Emirates', city: 'Dubai' },
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
