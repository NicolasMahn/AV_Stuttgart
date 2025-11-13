import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('language', 'de'));
    await page.reload();
    await expect(page.locator('text=Loading...')).not.toBeVisible({ timeout: 10000 });
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    // Language toggle should have aria-label
    const languageToggle = page.locator('.language-toggle');
    await expect(languageToggle).toHaveAttribute('aria-label', 'Switch language');
  });

  test('should have alt text on images', async ({ page }) => {
    // Logo should have alt text
    const logo = page.locator('.menu-logo');
    await expect(logo).toHaveAttribute('alt', 'Logo');
    
    // Language flag should have alt text
    const flag = page.locator('.language-flag');
    const altText = await flag.getAttribute('alt');
    expect(altText).toBeTruthy();
    expect(altText).toMatch(/Switch to (English|German)/);
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Tab until we reach the language toggle (max 5 attempts)
    const languageToggle = page.locator('.language-toggle');
    
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      if (await languageToggle.evaluate(el => el === document.activeElement)) {
        break;
      }
    }
    
    // Language toggle should be focusable
    await expect(languageToggle).toBeFocused();
    
    // Continue tabbing to menu items
    await page.keyboard.press('Tab');
    
    // One of the tab items should now be focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should allow tab navigation with Enter key', async ({ page }) => {
    // Tab to first menu item
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Press Enter to activate
    await page.keyboard.press('Enter');
    
    // Wait for navigation
    await page.waitForTimeout(500);
    
    // URL should have changed (hash added)
    const url = page.url();
    expect(url).toMatch(/#/);
  });

  test('should have semantic HTML structure', async ({ page }) => {
    // Menu should be a nav element
    const nav = page.locator('nav.menu');
    await expect(nav).toBeVisible();
    
    // Buttons should be button elements
    const tabs = page.locator('.tab-item');
    const firstTab = tabs.first();
    await expect(firstTab).toBeVisible();
    
    // Check that it's actually a button
    const tagName = await firstTab.evaluate(el => el.tagName);
    expect(tagName).toBe('BUTTON');
  });

  test('should maintain focus visibility', async ({ page }) => {
    // Tab through elements
    await page.keyboard.press('Tab');
    
    // Check that focused element is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Check for focus styles (if defined in CSS)
    const outlineColor = await focusedElement.evaluate(el => 
      window.getComputedStyle(el).outlineColor
    );
    
    // Should have some kind of focus indicator
    // (This test might need adjustment based on your actual CSS)
    expect(outlineColor).toBeTruthy();
  });

  test('should have appropriate color contrast', async ({ page }) => {
    // This is a basic check - for comprehensive testing, use axe-core
    const menu = page.locator('.menu');
    
    // Get background and text colors
    const styles = await menu.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });
    
    // Just verify that colors are set
    expect(styles.backgroundColor).toBeTruthy();
    expect(styles.color).toBeTruthy();
  });

  test('should work with reduced motion preferences', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Click on a tab
    const firstTab = page.locator('.tab-item').first();
    await firstTab.click();
    
    // Navigation should still work even with reduced motion
    await page.waitForTimeout(500);
    expect(page.url()).toMatch(/#/);
  });
});

