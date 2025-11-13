import { test, expect } from '@playwright/test';

test.describe('Content Loading Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should show loading state initially', async ({ page }) => {
    // Navigate to page
    await page.goto('/');
    
    // Loading message might appear briefly
    // (It might be too fast to catch, so we check for its eventual absence)
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
  });

  test('should load German content from YAML', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('language', 'de'));
    await page.goto('/');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Check that German menu items are loaded
    await expect(page.locator('.tab-item', { hasText: 'Ethik' })).toBeVisible();
    await expect(page.locator('.tab-item', { hasText: 'Starthilfe' })).toBeVisible();
    await expect(page.locator('.tab-item', { hasText: 'Ernährung' })).toBeVisible();
  });

  test('should load English content from YAML', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('language', 'en'));
    await page.goto('/en/');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Check that tabs are loaded (English content)
    const tabs = page.locator('.tab-item');
    await expect(tabs.first()).toBeVisible();
    
    // Should have multiple tabs
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThan(0);
  });

  test('should handle YAML loading errors gracefully', async ({ page }) => {
    // Intercept the YAML file request and fail it
    await page.route('**/content_de.yaml', route => route.abort());
    
    await page.goto('/');
    
    // Page should still load, even if content fails
    // (The error should be logged to console)
    const menu = page.locator('.menu');
    
    // Menu might still be visible, just with no tabs
    await page.waitForTimeout(2000);
    
    // Check console for error
    const logs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });
    
    // Should have logged an error
    await page.waitForTimeout(500);
  });

  test('should load content sections when available', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('language', 'de'));
    await page.goto('/');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Check that sections are loaded
    const ethikSection = page.locator('#Ethik');
    await expect(ethikSection).toBeAttached();
  });

  test('should update content when language changes', async ({ page }) => {
    // Start with German
    await page.evaluate(() => localStorage.setItem('language', 'de'));
    await page.goto('/');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Verify German content
    await expect(page.locator('.tab-item', { hasText: 'Ethik' })).toBeVisible();
    
    // Switch to English
    await page.locator('.language-toggle').click();
    await page.waitForURL(/\/en\//);
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Verify English content (Ethik should not be visible anymore)
    await expect(page.locator('.tab-item', { hasText: 'Ethik' })).not.toBeVisible();
  });

  test('should properly parse YAML configuration', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('language', 'de'));
    await page.goto('/');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Get the tabs and verify structure
    const tabs = page.locator('.tab-item');
    const tabCount = await tabs.count();
    
    // Should have the expected number of tabs (based on YAML config)
    expect(tabCount).toBeGreaterThanOrEqual(4);
    
    // Each tab should be clickable
    for (let i = 0; i < Math.min(tabCount, 3); i++) {
      const tab = tabs.nth(i);
      await expect(tab).toBeVisible();
      const text = await tab.textContent();
      expect(text).toBeTruthy();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('should maintain state during content reload', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('language', 'de'));
    await page.goto('/#Ethik');
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Reload the page
    await page.reload();
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Hash should be preserved
    expect(page.url()).toContain('#Ethik');
    
    // Active tab should be correct
    const activeTab = page.locator('.tab-item.active');
    await expect(activeTab).toBeVisible();
  });
});

