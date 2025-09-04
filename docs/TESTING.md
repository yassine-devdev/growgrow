# Testing Guide

The project has a robust testing strategy that combines end-to-end tests for user flows, unit tests for business logic, and component tests for UI isolation. This ensures the application's overall functionality, the reliability of individual components, and the correctness of its logic.

## 1. End-to-End (E2E) Testing with Playwright

Playwright is used to automate browser interactions and test critical user paths from start to finish.

-   **Location**: All E2E test files are located in the `/e2e` directory and end with `.spec.ts`.
-   **Purpose**: These tests verify that different parts of the application work together correctly. They simulate real user actions like logging in, navigating, and submitting forms.
-   **Existing Suites**: `login.spec.ts`, `navigation.spec.ts`, `forms.spec.ts`, `overlays.spec.ts`.
-   **How to Run**:
    ```bash
    npm test
    # Or 'npx playwright test'
    ```
-   **View Report**:
    ```bash
    npx playwright show-report
    ```

## 2. Unit Testing with Jest

Jest is used for unit testing isolated functions, custom hooks, and services. This allows for fast, targeted testing of business logic without needing to render UI components.

-   **Location**: Unit test files are co-located with the code they are testing and end with `.test.ts`.
-   **Purpose**: To verify the correctness of individual pieces of logic, such as form validation in the `useForm` hook or targeting rules in the `featureFlagService`.
-   **Existing Suites**: `hooks/useForm.test.ts`, `services/featureFlagService.test.ts`, `api/schoolManagementApi.test.ts`.
-   **How to Run**:
    ```bash
    npm run test:unit
    # Or 'npx jest'
    ```

## 3. Component Testing with Storybook

Storybook is used for developing, documenting, and testing UI components in isolation.

-   **Location**: Story files are co-located with their components and have the extension `.stories.tsx`.
-   **Purpose**: Allows developers to view components in different states (defined as "stories") without needing to run the full application. This is essential for building a robust and reusable component library.
-   **How to Run**:
    ```bash
    npm run storybook
    ```
    Navigate to `http://localhost:6006` in your browser.

### Interaction Testing in Storybook

Storybook is also used for testing component-level interactions.

-   **`play` Function**: Stories can include a `play` function that uses `@storybook/test` utilities to simulate user events like clicks and keyboard input.
-   **Example**: The `views/LoginPage.stories.tsx` file includes a `play` function that simulates a user clicking a login button, allowing developers to see the loading state directly in Storybook and make assertions.

```typescript
// Example from LoginPage.stories.tsx
import { within, userEvent } from '@storybook/test';

export const LoggingIn: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const providerButton = await canvas.findByRole('button', { name: 'Provider' });
        await userEvent.click(providerButton);
        // Assertions can be added here
    },
};
```
