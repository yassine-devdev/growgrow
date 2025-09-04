/**
 * @file End-to-end tests for application navigation.
 * This suite verifies that a logged-in user can navigate through the
 * main modules (L0), header navigation (L1), and sub-navigation (L2),
 * and that the correct content is displayed for each selection.
 */

import { test, expect } from '@playwright/test';

test.describe('Core Application Navigation', () => {
  // Before each test, log in as a Provider to ensure access to all navigation elements.
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Provider' }).click();
    // Wait for the main dashboard to ensure login is complete.
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('should navigate between main modules (L0)', async ({ page }) => {
    // 1. Navigate to the 'Schools' module from the right sidebar.
    await page.getByRole('button', { name: 'Schools' }).click();
    await expect(page.getByRole('heading', { name: 'Schools' })).toBeVisible();

    // 2. Navigate to the 'Tools' module.
    await page.getByRole('button', { name: 'Tools' }).click();
    await expect(page.getByRole('heading', { name: 'Tools' })).toBeVisible();

    // 3. Return to the 'Dashboard' module.
    await page.getByRole('button', { name: 'Dashboard' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('should navigate between header items (L1)', async ({ page }) => {
    // We start on the Dashboard module by default.
    // 1. Click on the 'Monitoring' tab in the header.
    await page.getByRole('button', { name: 'Monitoring' }).click();
    
    // 2. Verify that the 'Server Status' sub-view is loaded.
    await expect(page.getByRole('heading', { name: 'Service Status' })).toBeVisible();

    // 3. Click back to the 'Analytics' tab.
    await page.getByRole('button', { name: 'Analytics' }).click();

    // 4. Verify that the 'Usage Stats' sub-view is loaded.
    await expect(page.getByRole('heading', { name: 'Growth Overview' })).toBeVisible();
  });

  test('should navigate between sub-navigation items (L2)', async ({ page }) => {
    // 1. Navigate to the 'Schools' module.
    await page.getByRole('button', { name: 'Schools' }).click();
    await expect(page.getByRole('heading', { name: 'Schools' })).toBeVisible();
    
    // 2. Navigate to the 'Users' section via the header.
    await page.getByRole('button', { name: 'Users' }).click();

    // 3. Navigate to 'Teachers' in the left sub-navigation.
    await page.getByRole('button', { name: 'Teachers' }).click();

    // 4. Verify the 'Manage Teachers' view is loaded.
    await expect(page.getByRole('heading', { name: 'Manage Teachers' })).toBeVisible();

    // 5. Navigate to 'Students' in the left sub-navigation.
    await page.getByRole('button', { name: 'Students' }).click();

    // 6. Verify the 'Manage Students' view is loaded.
    await expect(page.getByRole('heading', { name: 'Manage Students' })).toBeVisible();
  });
});
