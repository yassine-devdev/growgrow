/**
 * @file End-to-end tests for the overlay application window system.
 * This suite ensures that users can open, interact with, and close the
 * floating "apps" that are part of the Super App experience.
 */

import { test, expect } from '@playwright/test';

test.describe('Overlay Window System', () => {
  // Log in as an Individual user for a clean environment.
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Individual' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('should open, minimize, restore, and close an overlay app', async ({ page }) => {
    const appLauncher = page.getByRole('button', { name: 'Open Applications' });
    const studioAppButton = page.getByRole('button', { name: 'Studio' }).nth(0); // The first button with this name
    
    // --- Open the App ---
    // 1. Click the main launcher icon in the footer.
    await appLauncher.click();
    
    // 2. Click the 'Studio' app icon from the expanded tray.
    await studioAppButton.click();
    
    // 3. Verify the Studio overlay window is now visible.
    // We locate it by its role 'dialog' and its accessible name.
    const studioWindow = page.getByRole('dialog', { name: 'Studio' });
    await expect(studioWindow).toBeVisible();

    // --- Minimize the App ---
    // 4. Find the minimize button within the Studio window and click it.
    const minimizeButton = studioWindow.locator('button').nth(0); // First button in the header
    await minimizeButton.click();
    
    // 5. Verify the window is no longer visible.
    await expect(studioWindow).not.toBeVisible();
    
    // 6. Verify the minimized icon appears in the dock area.
    const restoredStudioIcon = page.getByRole('button', { name: 'Restore Studio' });
    await expect(restoredStudioIcon).toBeVisible();

    // --- Restore the App ---
    // 7. Click the restored icon to bring the window back.
    await restoredStudioIcon.click();
    
    // 8. Verify the window is visible again.
    await expect(studioWindow).toBeVisible();
    await expect(restoredStudioIcon).not.toBeVisible();
    
    // --- Close the App ---
    // 9. Find the close button (the last one) and click it.
    const closeButton = studioWindow.locator('button').last();
    await closeButton.click();
    
    // 10. Verify the window is no longer in the DOM.
    await expect(studioWindow).not.toBeVisible();
  });
});
