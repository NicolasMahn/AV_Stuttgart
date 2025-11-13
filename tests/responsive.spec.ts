import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('language', 'de'));
  });

  test('should display correctly on mobile (portrait)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Menu should be visible
    const menu = page.locator('.menu');
    await expect(menu).toBeVisible();
    
    // Logo should be visible (wide enough for mobile)
    const logo = page.locator('.menu-logo');
    await expect(logo).toBeVisible();
    
    // Scroll buttons should not be visible on mobile
    const scrollButtons = page.locator('.scroll-button');
    await expect(scrollButtons.first()).not.toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Menu should be visible
    const menu = page.locator('.menu');
    await expect(menu).toBeVisible();
    
    // Logo should be visible
    const logo = page.locator('.menu-logo');
    await expect(logo).toBeVisible();
  });

  test('should display correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Menu should be visible
    const menu = page.locator('.menu');
    await expect(menu).toBeVisible();
    
    // Logo should be visible with full text
    const logo = page.locator('.menu-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('src', /AV_Logo_Text_Querformat_weiss\.svg/);
  });

  test('should hide logo on very narrow screens', async ({ page }) => {
    await page.setViewportSize({ width: 140, height: 600 });
    await page.reload();
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Logo should not be visible
    const logo = page.locator('.menu-logo');
    await expect(logo).not.toBeVisible();
  });

  test('should switch logo on medium-small screens', async ({ page }) => {
    await page.setViewportSize({ width: 250, height: 600 });
    await page.reload();
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Logo should be visible but with simple version
    const logo = page.locator('.menu-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('src', /AV_Logo_weiss\.svg/);
  });

  test('should handle viewport resize', async ({ page }) => {
    // Start with desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.reload();
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Logo should show full version
    const logo = page.locator('.menu-logo');
    await expect(logo).toHaveAttribute('src', /AV_Logo_Text_Querformat_weiss\.svg/);
    
    // Resize to tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    // Logo should still be visible (might change version)
    await expect(logo).toBeVisible();
    
    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Logo should still be visible
    await expect(logo).toBeVisible();
  });

  test('should allow horizontal scrolling on mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    const menuTabs = page.locator('.menu-tabs');
    
    // Check if menu is scrollable
    const isScrollable = await page.evaluate(() => {
      const menuElement = document.querySelector('.menu-tabs');
      if (!menuElement) return false;
      return menuElement.scrollWidth > menuElement.clientWidth;
    });
    
    if (isScrollable) {
      // Scroll the menu
      await page.evaluate(() => {
        const menuElement = document.querySelector('.menu-tabs');
        if (menuElement) {
          menuElement.scrollLeft = 100;
        }
      });
      
      await page.waitForTimeout(100);
      
      // Check that scroll position changed
      const scrollLeft = await page.evaluate(() => {
        const menuElement = document.querySelector('.menu-tabs');
        return menuElement ? menuElement.scrollLeft : 0;
      });
      
      expect(scrollLeft).toBeGreaterThan(0);
    }
  });

  test('should maintain functionality across different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' },
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.reload();
      await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
      
      // Menu should be visible
      await expect(page.locator('.menu')).toBeVisible();
      
      // Language toggle should be functional
      await expect(page.locator('.language-toggle')).toBeVisible();
      
      // Tabs should be clickable
      const firstTab = page.locator('.tab-item').first();
      await expect(firstTab).toBeVisible();
      await firstTab.click();
      await page.waitForTimeout(300);
      await expect(firstTab).toHaveClass(/active/);
    }
  });
});

