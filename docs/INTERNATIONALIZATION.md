# Internationalization (i18n)

The SaaS Super App is built with multi-language support from the ground up using the **i18next** library and its React integration, **react-i18next**.

## 1. Setup and Configuration

-   **Initialization**: The entire i18n instance is configured and initialized in the `i18n.ts` file at the project root. This file is imported once in `index.tsx` to make it available throughout the application.
-   **Provider**: The `I18nextProvider` is used in Storybook's `preview.js` to ensure components that use translations can render correctly in isolation.

## 2. Translation Files

-   **Location**: All translation strings are stored in JSON files within the `/locales` directory.
-   **Structure**: Each language has its own folder (e.g., `/en`, `/es`, `/fr`, `/ar`), which contains a `translation.json` file.
-   **Format**: The JSON files use a nested structure to organize keys logically. This makes finding and managing translations easier.

**Example from `locales/en/translation.json`:**

```json
{
  "login": {
    "title": "GROW YouR NEED",
    "subtitle": "Select your role to enter the Super App"
  },
  "nav": {
    "modules": {
      "dashboard": "Dashboard",
      "schools": "Schools"
    }
  }
}
```

## 3. Using Translations in Components

The `useTranslation` hook from `react-i18next` is the primary way to access translations within components.

-   **Import**: `import { useTranslation } from 'react-i18next';`
-   **Usage**: The hook returns a `t` function, which takes a translation key as an argument.

```typescript
// Example in a component
import React from 'react';
import { useTranslation } from 'react-i18next';

const MyComponent: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t('login.title')}</h1>
            <p>{t('nav.modules.dashboard')}</p>
        </div>
    );
};
```

### Dynamic Values (Interpolation)

You can pass dynamic values into your translation strings.

-   **JSON file**: ` "restore": "Restore {{app}}"`
-   **Component**: `t('footer.restore', { app: 'Studio' })`
-   **Output**: `"Restore Studio"`

## 4. Adding a New Language

1.  **Create a new directory** inside `/locales` (e.g., `/de` for German).
2.  **Copy `translation.json`** from an existing language folder (like `/en`) into your new directory.
3.  **Translate the values** in the new `de/translation.json` file.
4.  **Import and register** the new translation file in `i18n.ts`.
5.  **Add the language option** to the language switcher UI in `components/layout/Footer.tsx`.

## 5. Language Switching

-   The language switcher is implemented in `components/layout/Footer.tsx`.
-   It calls the `i18n.changeLanguage('lng_code')` function provided by the `useTranslation` hook to change the active language for the entire application.
