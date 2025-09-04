# Button Design & Implementation Guide

This document is the comprehensive guide to all button components used within the GROW YouR NEED Super App. It details their visual appearance, usage context, implementation with Tailwind CSS, and various interactive states.

## 1. Design Philosophy

Our button system is built on the principles of **Clarity**, **Consistency**, and **Accessibility**.

-   **Clarity**: The appearance of a button should clearly communicate its importance and function on the page. Primary actions are visually distinct from secondary or destructive ones.
-   **Consistency**: Buttons of the same type look and behave the same way everywhere, creating an intuitive and predictable user experience.
-   **Accessibility**: All buttons must be keyboard-focusable with a clear focus state (`focus-visible`). Icon-only buttons must have an `aria-label` to be understood by screen readers.

---

## 2. Primary Button

This is the standard button for the most important action on a page, in a view, or in a modal.

-   **Name**: Primary Action Button
-   **Usage**: Used for form submissions ("Create School", "Save Changes"), key confirmations ("Submit Assignment"), and primary calls-to-action ("Add New Admin"). There should typically be only one primary button visible at a time.
-   **Appearance**:
    -   **Background**: Solid `bg-brand-primary` (`#4f46e5`).
    -   **Text**: White, medium or semibold font weight.
    -   **Shape**: Rounded corners (`rounded-md` or `rounded-lg`).
    -   **Shadow**: A subtle drop shadow (`shadow-sm`).
-   **States**:
    -   **Hover**: Background becomes slightly lighter and brighter (`hover:bg-brand-primary-hover`).
    -   **Focus**: A highly visible outline appears (`focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary`).
    -   **Disabled**: Background is grayed out (`disabled:bg-brand-text-alt`), and the cursor changes to `not-allowed`.
-   **Implementation**:
    ```html
    <button
      type="submit"
      disabled={isSubmitting}
      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-brand-text-alt disabled:cursor-not-allowed"
    >
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Submit Action
    </button>
    ```

---

## 3. Secondary / Subtle Button

Used for secondary actions or inactive navigation elements that should not compete visually with the primary button.

-   **Name**: Secondary / Subtle Button
-   **Usage**: Inactive navigation tabs in the header, "Cancel" buttons in modals (though often omitted for simplicity), or less important actions.
-   **Appearance**:
    -   **Background**: A very light, subtle gray (`bg-black/5` or `bg-brand-surface-alt`).
    -   **Text**: `text-brand-text-alt`.
    -   **Shape**: Rounded corners (`rounded-lg`).
-   **States**:
    -   **Hover**: Background becomes slightly darker (`hover:bg-black/10`) and text becomes darker (`hover:text-brand-text`).
-   **Implementation**:
    ```html
    <button
      className="px-4 py-2 rounded-lg text-sm font-semibold text-brand-text-alt hover:bg-black/5 hover:text-brand-text transition-colors"
    >
      Secondary Action
    </button>
    ```

---

## 4. Icon-Only Button

Used for actions in constrained spaces to maintain a clean and uncluttered UI.

-   **Name**: Icon-Only Button
-   **Usage**: Table row actions (Edit, Delete), header controls (Notifications, Help), window controls (Minimize, Close).
-   **Appearance**:
    -   **Background**: Transparent by default.
    -   **Icon**: `lucide-react` icon with `text-brand-text-alt` color.
-   **States**:
    -   **Hover**: A subtle background appears (`hover:bg-black/5`), and the icon color may change to `text-brand-text` or a semantic color (e.g., red for delete).
-   **Accessibility**: **Crucially**, this button must have an `aria-label` that describes its action (e.g., `aria-label="Delete user"`).
-   **Implementation**:
    ```html
    <button
      aria-label="Delete item"
      className="p-1 text-brand-text-alt hover:text-red-500 hover:bg-red-500/10 rounded-full"
    >
      <Trash2 className="w-4 h-4" />
    </button>
    ```

---

## 5. Destructive Action Button

A variant of the Icon-Only or Secondary button used for actions with significant, often irreversible consequences.

-   **Name**: Destructive Action Button
-   **Usage**: Deleting data, logging out. These actions should always be paired with a confirmation dialog (`window.confirm` or a custom modal).
-   **Appearance**: The button signals its destructive nature on hover by turning red.
-   **Implementation**:
    ```html
    <!-- Logout button example from Footer -->
    <button
      aria-label="Logout"
      onClick={logout}
      className="p-3 bg-white/5 rounded-full border border-white/10 text-white hover:bg-red-500/80 transition-colors"
    >
      <LogOut className="w-5 h-5" />
    </button>
    ```

---

## 6. Footer / Dock Button

A special, styled button used exclusively in the main application footer for a high-end, "glassmorphism" aesthetic.

-   **Name**: Dock Button
-   **Usage**: App Launcher, minimized app icons, language switcher, logout.
-   **Appearance**:
    -   **Background**: Semi-transparent dark color (`bg-white/5`).
    -   **Text/Icon**: White (`text-white`).
    -   **Border**: Subtle white border (`border border-white/10`).
-   **States**:
    -   **Hover**: Background changes to `brand-primary` (`hover:bg-brand-primary`).
-   **Implementation**:
    ```html
    <button
      aria-label="Open Applications"
      className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-brand-primary transition-all duration-200"
    >
      <Layers className="w-5 h-5 text-white" />
    </button>
    ```

---

## 7. Status / Completed Button

A visual indicator that an action has already been taken, presented in the form of a disabled button.

-   **Name**: Status Button
-   **Usage**: To provide clear feedback after an action is completed, preventing duplicate actions. Examples include "In Cart" after adding an item, "Applied" after selecting a theme, or "Quote Requested".
-   **Appearance**:
    -   **Background**: Green (`bg-green-500`).
    -   **Text**: White.
    -   **Icon**: Often paired with a `Check` icon.
-   **State**: The button is always `disabled` and has `cursor-not-allowed`.
-   **Implementation**:
    ```html
    <button
      disabled
      className="w-full py-2 text-sm font-semibold text-white rounded-lg flex items-center justify-center gap-2 bg-green-500 cursor-not-allowed"
    >
      <Check className="w-4 h-4" />
      In Cart
    </button>
    ```

---

## 8. A/B Test Variant Button

A variant of the Primary Button used for A/B testing, controlled by a feature flag.

-   **Name**: Treatment Variant Button
-   **Usage**: Used in the `NewSchoolForm` when the `newSchoolButtonTest` feature flag returns the "treatment" variant.
-   **Appearance**:
    -   **Background**: Uses the application's accent color (`bg-brand-accent`, a bright green).
    -   **Text**: May have different copy (e.g., "Let's Go! ->").
-   **Implementation**: The button's classes and text are conditionally rendered based on the feature flag's value.
    ```javascript
    // In the component
    const { getVariant } = useFeatureFlag('newSchoolButtonTest');
    const buttonVariant = getVariant();

    const getButtonStyles = () => {
        if (buttonVariant === 'treatment') {
            return 'bg-brand-accent hover:bg-green-500';
        }
        return 'bg-brand-primary hover:bg-brand-primary-hover';
    };
    ```