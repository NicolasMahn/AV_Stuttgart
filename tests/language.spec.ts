import { test, expect } from '@playwright/test';

test.describe('Language Switching Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should default to German for German browser language', async ({ page, context }) => {
    // Set the browser language to German
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'language', {
        get: () => 'de-DE',
      });
    });
    
    await page.goto('/');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Check that German tabs are visible
    await expect(page.locator('.tab-item', { hasText: 'Ethik' })).toBeVisible();
    
    // Check that the language toggle shows English flag
    const languageToggle = page.locator('.language-toggle img');
    await expect(languageToggle).toHaveAttribute('src', /Flag_EN\.svg/);
  });

  test('should default to German for non-German browser language', async ({ page, context }) => { //TODO: Change should default to german
    // Set the browser language to English
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'language', {
        get: () => 'en-US',
      });
    });
    
    await page.goto('/');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // URL should not contain /en/
    await expect(page.locator('.tab-item', { hasText: 'Ethik' })).toBeVisible();
    
    // Check that the language toggle shows English flag
    const languageToggle = page.locator('.language-toggle img');
    await expect(languageToggle).toHaveAttribute('src', /Flag_EN\.svg/);
  });

  test('should switch from German to English', async ({ page }) => {
    // Start with German
    await page.evaluate(() => localStorage.setItem('language', 'de'));
    await page.goto('/');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Check initial German state
    await expect(page.locator('.tab-item', { hasText: 'Ethik' })).toBeVisible();
    
    // Click language toggle
    await page.locator('.language-toggle').click();
    
    // Wait for navigation to English version
    await page.waitForURL(/\/en\//);
    
    // Check that language has changed in localStorage
    const storedLanguage = await page.evaluate(() => localStorage.getItem('language'));
    expect(storedLanguage).toBe('en');
    
    // Check that the language toggle now shows German flag
    const languageToggle = page.locator('.language-toggle img');
    await expect(languageToggle).toHaveAttribute('src', /Flag_DE\.svg/);
  });

  test('should switch from English to German', async ({ page }) => {
    // Start with English
    await page.evaluate(() => localStorage.setItem('language', 'en'));
    await page.goto('/en/');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Click language toggle
    await page.locator('.language-toggle').click();
    
    // Wait for navigation to German version
    await page.waitForURL((url) => !url.pathname.includes('/en'));
    
    // Check that language has changed in localStorage
    const storedLanguage = await page.evaluate(() => localStorage.getItem('language'));
    expect(storedLanguage).toBe('de');
    
    // Check that German tabs are visible
    await expect(page.locator('.tab-item', { hasText: 'Ethik' })).toBeVisible();
  });

  // TODO: Enable this test when language persistence is implemented (cookies/localStorage)
  test.skip('should persist language selection across page reloads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Switch to English
    await page.locator('.language-toggle').click();
    await page.waitForURL(/\/en\//);
    
    // Reload the page
    await page.reload();
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Should still be in English
    expect(page.url()).toContain('/en/');
    const storedLanguage = await page.evaluate(() => localStorage.getItem('language'));
    expect(storedLanguage).toBe('en');
  });

  test.skip('should preserve hash when switching languages', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('language', 'de'));
    await page.goto('/#Ethik');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Switch language
    await page.locator('.language-toggle').click();
    await page.waitForURL(/\/en\//);
    
    // Hash should be preserved
    expect(page.url()).toContain('#Ethik');
  });
});

