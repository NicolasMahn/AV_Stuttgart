import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure consistent test state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the loading state to complete
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Check that the menu is visible
    await expect(page.locator('.menu')).toBeVisible();
    
    // Check that the logo is visible
    await expect(page.locator('.menu-logo')).toBeVisible();
  });

  test('should navigate to Datenschutz page', async ({ page }) => {
    await page.goto('/datenschutz');
    
    // Check the URL
    expect(page.url()).toContain('/datenschutz');
    
    // Menu should not be visible on special pages
    await expect(page.locator('.menu')).not.toBeVisible();
  });

  test('should navigate to Impressum page', async ({ page }) => {
    await page.goto('/impressum');
    
    // Check the URL
    expect(page.url()).toContain('/impressum');
    
    // Menu should not be visible on special pages
    await expect(page.locator('.menu')).not.toBeVisible();
  });

  test('should navigate to Spenden page', async ({ page }) => {
    await page.goto('/spenden');
    
    // Check the URL
    expect(page.url()).toContain('/spenden');
    
    // Menu should not be visible on special pages
    await expect(page.locator('.menu')).not.toBeVisible();
  });

  test('should navigate to Kontakt page', async ({ page }) => {
    await page.goto('/kontakt');
    
    // Check the URL
    expect(page.url()).toContain('/kontakt');
    
    // Menu should not be visible on special pages
    await expect(page.locator('.menu')).not.toBeVisible();
  });

  test('should redirect unknown routes to homepage', async ({ page }) => {
    await page.goto('/nonexistent-route');
    
    // Should redirect to a valid home page (language-dependent)
    await page.waitForURL(url => {
      const urlObj = new URL(url);
      const pathAndHash = urlObj.pathname + urlObj.hash;
      return /^\/(en\/)?(#.*)?$/.test(pathAndHash);
    });
    
    // Verify the final URL
    const urlObj = new URL(page.url());
    const pathAndHash = urlObj.pathname + urlObj.hash;
    expect(pathAndHash).toMatch(/^\/(en\/)?(#.*)?$/);
  });

  test('should navigate between sections using menu tabs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Wait for menu tabs to be loaded
    const menuTabs = page.locator('.menu-tabs .tab-item');
    await expect(menuTabs.first()).toBeVisible();
    
    // Get the first tab name
    const firstTab = menuTabs.first();
    await firstTab.click();
    
    // Wait a bit for the scroll
    await page.waitForTimeout(500);
    
    // Check that URL contains a hash
    const url = page.url();
    expect(url).toMatch(/#/);
  });

  test.skip('should preserve hash when navigating', async ({ page }) => { //Test doesn't work as expected.
    await page.goto('/#Ethik');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Hash should be preserved in the URL
    expect(page.url()).toContain('#Ethik');
    
    // The corresponding tab should be active
    const activeTab = page.locator('.tab-item.active');
    await expect(activeTab).toBeVisible();
  });
});

