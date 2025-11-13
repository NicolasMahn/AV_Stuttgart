import { test, expect } from '@playwright/test';

test.describe('Menu Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('language', 'de'));
    await page.reload();
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
  });

  test('should display menu with all tabs', async ({ page }) => {
    // Check that the menu exists
    const menu = page.locator('.menu');
    await expect(menu).toBeVisible();
    
    // Check that there are multiple tab items
    const tabs = page.locator('.menu-tabs .tab-item');
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThan(0);
    
    // Check for expected German tabs
    await expect(page.locator('.tab-item', { hasText: 'Ethik' })).toBeVisible();
    await expect(page.locator('.tab-item', { hasText: 'Starthilfe' })).toBeVisible();
  });

  test('should highlight active tab on click', async ({ page }) => {
    const firstTab = page.locator('.tab-item').first();
    await firstTab.click();
    
    // Wait for the active class to be applied
    await expect(firstTab).toHaveClass(/active/);
  });

  test('should scroll to section when tab is clicked', async ({ page }) => {
    // Click on a tab
    const ethikTab = page.locator('.tab-item', { hasText: 'Ethik' });
    await ethikTab.click();
    
    // Wait for URL to update with hash
    await page.waitForTimeout(500);
    expect(page.url()).toContain('#Ethik');
    
    // Check that the section exists in the page
    const section = page.locator('#Ethik');
    await expect(section).toBeVisible();
  });

  test('should show/hide gradient indicators based on scroll position', async ({ page }) => {
    // Get the menu tabs container
    const menuTabs = page.locator('.menu-tabs');
    
    // Initially, right gradient should be visible if there's overflow
    const rightGradient = page.locator('#right-gradient');
    
    // Check if scrolling is needed
    const isScrollable = await page.evaluate(() => {
      const menuElement = document.querySelector('.menu-tabs');
      if (!menuElement) return false;
      return menuElement.scrollWidth > menuElement.clientWidth;
    });
    
    if (isScrollable) {
      // Right gradient should be visible at start
      await expect(rightGradient).toBeVisible();
      
      // Scroll to the right
      await page.evaluate(() => {
        const menuElement = document.querySelector('.menu-tabs');
        if (menuElement) {
          menuElement.scrollLeft = menuElement.scrollWidth;
        }
      });
      
      // Wait for gradient update
      await page.waitForTimeout(100);
      
      // Left gradient should now be visible
      const leftGradient = page.locator('#left-gradient');
      await expect(leftGradient).toBeVisible();
    }
  });

  test('should display correct logo based on screen width', async ({ page }) => {
    // Check that logo is visible on desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.reload();
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    const logo = page.locator('.menu-logo');
    await expect(logo).toBeVisible();
    
    // Check logo source for desktop
    await expect(logo).toHaveAttribute('src', /AV_Logo_Text_Querformat_weiss\.svg/);
  });

  test('should show scroll buttons on desktop when menu overflows', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 800, height: 600 });
    await page.reload();
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Check if scrolling is needed
    const isScrollable = await page.evaluate(() => {
      const menuElement = document.querySelector('.menu-tabs');
      if (!menuElement) return false;
      return menuElement.scrollWidth > menuElement.clientWidth;
    });
    
    if (isScrollable) {
      // Right scroll button should be visible
      const rightButton = page.locator('.scroll-button.right');
      await expect(rightButton).toBeVisible();
      
      // Click right scroll button
      await rightButton.click();
      await page.waitForTimeout(500);
      
      // Left scroll button should now be visible
      const leftButton = page.locator('.scroll-button.left');
      await expect(leftButton).toBeVisible();
    }
  });

  test('should not show menu on special pages', async ({ page }) => {
    // Navigate to Datenschutz
    await page.goto('/datenschutz');
    
    // Menu should not be visible
    const menu = page.locator('.menu');
    await expect(menu).not.toBeVisible();
  });

  test('should change language toggle icon based on current language', async ({ page }) => {
    // In German, should show English flag
    const languageToggle = page.locator('.language-toggle img');
    await expect(languageToggle).toHaveAttribute('src', /Flag_EN\.svg/);
    
    // Switch to English
    await page.locator('.language-toggle').click();
    await page.waitForURL(/\/en\//);
    
    // Should now show German flag
    await expect(languageToggle).toHaveAttribute('src', /Flag_DE\.svg/);
  });
});

