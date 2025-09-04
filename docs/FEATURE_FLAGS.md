# Feature Flag System

The application includes a feature flag system to enable dynamic control over features, allowing for A/B testing, gradual rollouts, and enabling/disabling functionality without deploying new code.

## 1. How It Works

The system is designed around a React Context that provides flag data to all components.

-   **Mock Service (`services/featureFlagService.ts`)**: This file simulates fetching feature flags from a third-party service like LaunchDarkly or Optimizely. It contains the master list of all flags and includes targeting logic based on the user's role.
-   **Context Provider (`context/FeatureFlagContext.tsx`)**:
    -   The `FeatureFlagProvider` wraps the application in `App.tsx`.
    -   When the user logs in or changes, it calls `getFeatureFlags` from the service to fetch the correct set of flags for that user.
    -   It makes the flags available to all descendant components via the `useFeatureFlag` hook.

## 2. Using Feature Flags in Components

The `useFeatureFlag` hook is the primary way to interact with the system within a component. You provide it with the key of the flag you want to access.

```typescript
import { useFeatureFlag } from '../../context/FeatureFlagContext';
```

### Checking if a Flag is Enabled (Boolean Flags)

For simple on/off flags, use the `isEnabled` property returned by the hook.

**Example from `ConciergeView.tsx`:**

```typescript
const AiAssistantTool: React.FC = () => {
    const { isEnabled } = useFeatureFlag('conciergeAiAssistant');

    if (!isEnabled) {
        return null;
    }

    return (
        // ... render the AI Assistant tool
    );
};
```

### Getting a Variant (Multivariate Flags)

For A/B tests or flags with multiple possible values (e.g., strings, numbers), use the `getVariant` function.

**Example from `NewSchoolForm.tsx`:**

```typescript
const NewSchoolForm: React.FC = () => {
    const { getVariant } = useFeatureFlag('newSchoolButtonTest');
    const buttonVariant = getVariant(); // Returns 'control' or 'treatment'

    const getButtonStyles = () => {
        if (buttonVariant === 'treatment') {
            return 'bg-brand-accent ...';
        }
        return 'bg-brand-primary ...'; // Control styles
    };

    return (
        <button className={getButtonStyles()}>
            {buttonVariant === 'treatment' ? "Let's Go!" : "Create School"}
        </button>
    );
};
```

## 3. Adding a New Feature Flag

1.  **Define the Flag**: Add a new entry to the `ALL_FLAGS` object in `services/featureFlagService.ts`. Define its `key`, default `value`, and `description`.
2.  **Add Targeting Logic**: Inside the `getFeatureFlags` function in the same file, add logic to change the flag's value based on user attributes (like `role`).
3.  **Use the Hook**: In the component where you want to control a feature, call `useFeatureFlag('your-new-flag-key')` and use `isEnabled` or `getVariant` to alter the component's rendering or behavior.
