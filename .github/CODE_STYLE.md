# The Aesthetic Scroll: Sovereign Style Guide

This document defines the coding style, naming conventions, and architectural preferences for the GROW YouR NEED Super App. It is the blueprint for our multiverse, guiding all contributions—human and AI—to ensure our codebase is clean, consistent, and maintainable. Adherence to this scroll is not optional; it is ceremonial.

## 📜 General Principles

1.  **Clarity Over Clevverness**: Code should be easy to read and understand. Avoid overly complex one-liners or "magic" code.
2.  **TypeScript is Law**: All new code must be written in TypeScript with strict typing. The `any` type is forbidden except in unavoidable circumstances, which must be justified.
3.  **Single Responsibility**: Components, functions, and modules should do one thing and do it well.
4.  **Dry (Don't Repeat Yourself)**: Abstract reusable logic into hooks, helpers, or services.
5.  **Accessibility First**: All UI components must be accessible. Use semantic HTML, ARIA attributes, and ensure keyboard navigability.

---

## 📁 File & Directory Structure

-   **Component Naming**: Components should be `PascalCase` (e.g., `StatCard.tsx`).
-   **Co-location**: Stories (`.stories.tsx`) and tests (`.test.ts`) should be co-located with their corresponding components or services.
-   **Barrel Files**: Use `index.ts` barrel files to simplify imports from a directory (e.g., `types/index.ts`).
-   **Directory Casing**: All directories should be `lowercase`.

---

## 🎨 React & Component Style

-   **Functional Components**: All components must be functional components using React Hooks.
-   **Props**: Define component props with TypeScript `interface` or `type`. Props should be destructured.
-   **Styling**: Use **Tailwind CSS** for all styling. Avoid custom CSS files unless absolutely necessary for complex animations or global styles.
-   **State Management**:
    -   Use **Zustand** (`useAppStore`) for global UI state.
    -   Use **TanStack Query** for all server state. Do not store server data in the global Zustand store.
    -   Use `useState` for local component state.
-   **Icons**: Use the `Icon` component for dynamic Lucide icons and `CustomIcon` for our custom multi-color SVGs.

---

## 🛡️ Sovereign Style Guide for API & Schemas

This is the most sacred part of the scroll. The boundary between our frontend and the backend must be guarded by strict types and clear conventions.

### Zod Schemas (`api/schemas/`)

-   **Naming Convention**:
    -   Schema variables must be `camelCase` and end with `Schema` (e.g., `userSchema`).
    -   Inferred types must be `PascalCase` and exported (e.g., `export type User = z.infer<typeof userSchema>;`).
-   **Validation Messages**: All validations should have clear, user-friendly error messages (e.g., `z.string().min(3, 'School name must be at least 3 characters long.')`).
-   **Coercion**: For data coming from forms or URL params, use `z.coerce` to ensure correct types (e.g., `z.coerce.number()` for a number input).
-   **Reusability**: Define base schemas and extend them. Do not repeat schema definitions. For example, a `userUpdateSchema` should extend or pick from the base `userSchema`.

**Example:**

```typescript
// api/schemas/userSchemas.ts
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
});

export type User = z.infer<typeof userSchema>;

export const userFormSchema = userSchema.omit({ id: true });
export type UserFormData = z.infer<typeof userFormSchema>;
```

### API Client Functions (`api/`)

-   **File Structure**: Group related API functions into their own files (e.g., `authApi.ts`, `schoolApi.ts`).
-   **Function Naming**: Functions should be named descriptively based on what they do (e.g., `getAdmins`, `updateSchool`, `deleteUser`).
-   **Type Safety**:
    -   All functions must have explicit `Promise<T>` return types.
    -   The response from `apiClient` must be parsed with the corresponding Zod schema before being returned.
-   **Parameter Handling**:
    -   For `GET` requests with pagination/sorting, accept a single `options` object. Use the `buildApiUrl` helper.
    -   For `POST`/`PUT` requests, accept the data object (`T`) as a parameter.

**Example:**

```typescript
// api/schoolApi.ts
import { apiClient } from './apiClient';
import { adminSchema, type Admin } from './schemas/schoolManagementSchemas';
import { PaginatedResponse } from '@/types';

/**
 * Fetches a paginated list of administrators.
 * @param options - Pagination, sorting, and filtering options.
 * @returns A promise that resolves to a paginated response of Admin objects.
 */
export const getAdmins = async (options: {...}): Promise<PaginatedResponse<Admin>> => {
    const data = await apiClient<PaginatedResponse<Admin>>(buildApiUrl('/users/admins', options));
    // A more robust implementation might parse data.rows with adminSchema.array().
    return data;
};
```
