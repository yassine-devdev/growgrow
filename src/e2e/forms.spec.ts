/**
 * @file End-to-end tests for form submissions.
 * This suite focuses on testing critical data entry workflows, starting
 * with the 'Onboard New School' form.
 */

import { test, expect } from '@playwright/test';

test.describe('Form Submission: New School', () => {
  // Log in as a Provider and navigate to the form before each test.
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Provider' }).click();
    await page.getByRole('button', { name: 'Schools' }).click();
    // Default view is 'Onboarding' > 'New School', so no further navigation is needed.
    await expect(page.getByRole('heading', { name: 'Onboard New School' })).toBeVisible();
  });

  test('should successfully submit the form with valid data', async ({ page }) => {
    // --- Fill School Information ---
    await page.locator('input[name="schoolInfo.schoolName"]').fill('Playwright Academy');
    await page.locator('input[name="schoolInfo.schoolDomain"]').fill('playwright-academy');
    await page.locator('select[name="schoolInfo.schoolType"]').selectOption('university');

    // --- Fill Administrator Account Information ---
    await page.locator('input[name="adminInfo.firstName"]').fill('Test');
    await page.locator('input[name="adminInfo.lastName"]').fill('User');
    await page.locator('input[name="adminInfo.email"]').fill('test.user@playwright.dev');
    await page.locator('input[name="adminInfo.password"]').fill('password123');

    // --- Submit the Form ---
    await page.getByRole('button', { name: 'Create School' }).click();

    // --- Verify Success ---
    // Check for the success message to appear.
    const successMessage = page.locator('text=School "Playwright Academy" created successfully!');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    // --- Attempt to Submit an Empty Form ---
    await page.getByRole('button', { name: 'Create School' }).click();
    
    // --- Verify Validation Errors ---
    // Check for a few key error messages to confirm validation is working.
    await expect(page.getByText('School name must be at least 3 characters long.')).toBeVisible();
    await expect(page.getByText("Domain must be lowercase alphanumeric with hyphens, e.g., 'northwood-high'")).toBeVisible();
    await expect(page.getByText('First name is required.')).toBeVisible();
    await expect(page.getByText('Invalid email address.')).toBeVisible();
    await expect(page.getByText('Password must be at least 8 characters long.')).toBeVisible();
  });
});
