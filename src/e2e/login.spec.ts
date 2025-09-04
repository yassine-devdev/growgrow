/**
 * @file End-to-end tests for user login functionality.
 * This test suite ensures that users with different roles can successfully log in
 * and are redirected to their respective dashboard views.
 * 
 * To run these tests, you would typically use the command:
 * `npx playwright test e2e/login.spec.ts`
 * (Requires Playwright to be installed and configured in the project).
 */

import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  // Before each test, navigate to the application's root URL.
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow a Provider to log in and see the provider dashboard', async ({ page }) => {
    // 1. Find and click the 'Provider' login button.
    // We use getByRole for accessibility and resilience.
    await page.getByRole('button', { name: 'Provider' }).click();

    // 2. Assert that the main dashboard heading is visible after login.
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 5000 });
    
    // 3. Assert that the user-specific view text is correct.
    await expect(page.getByText('Provider View')).toBeVisible();
  });

  test('should allow an Admin to log in and see the school dashboard', async ({ page }) => {
    // 1. Find and click the 'Admin' login button.
    await page.getByRole('button', { name: 'Admin' }).click();

    // 2. Assert that the main dashboard heading is visible.
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 5000 });

    // 3. Assert that the correct dashboard for a school role is displayed.
    await expect(page.getByText('Admin View')).toBeVisible();
    await expect(page.getByText('Admin Dashboard')).toBeVisible();
  });

  test('should allow a Student to log in and see the school dashboard', async ({ page }) => {
    // 1. Find and click the 'Student' login button.
    await page.getByRole('button', { name: 'Student' }).click();
    
    // 2. Assert that the main dashboard heading is visible.
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 5000 });
    
    // 3. Assert that the correct dashboard for a student role is displayed.
    await expect(page.getByText('Student View')).toBeVisible();
    await expect(page.getByText('Student Dashboard')).toBeVisible();
  });
});
