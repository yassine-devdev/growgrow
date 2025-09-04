# Contributor Instructions & Ceremonial Guide for Coding with GitHub Copilot

Welcome, artisan of the digital realm. This scroll provides the ceremonial instructions for contributing to the GROW YouR NEED Super App, specifically when collaborating with our AI familiar, GitHub Copilot. Adherence to these guidelines ensures harmony, quality, and maintainability within our multiverse.

Before you begin, you must perform the setup ritual and understand our core principles. Refer to these sacred texts:

-   **[Getting Started Guide](../../docs/GETTING_STARTED.md)**: For environment setup and running the application.
-   **[The Aesthetic Scroll: Code Style](../../.github/CODE_STYLE.md)**: Defines our coding style, naming conventions, and architectural preferences. Your understanding of this scroll will guide both your hand and Copilot's suggestions.

---

## 🧿 The Pact with the Familiar (`copilot.yml`)

The behavior of GitHub Copilot within this repository is not arbitrary; it is governed by a pact defined in **[`.github/copilot.yml`](./copilot.yml)**. This scroll sets boundaries and preferences, instructing Copilot to align with our sovereign style. Familiarize yourself with its contents.

---

## ✨ The Ritual of Prompting: Guiding the AI

Copilot responds to the context you provide. To receive worthy suggestions, you must perform the Ritual of Prompting with clarity and precision.

1.  **Lead with Intent (Use Comments)**: Before writing a function or component, write a clear, descriptive comment or JSDoc block. This is the most powerful way to guide Copilot.

    -   **Weak Prompt**: `// get users`
    -   **Strong Prompt**:
        ```typescript
        /**
         * Fetches a paginated list of Admin users from the API.
         * @param options - Pagination, sorting, and filtering options.
         * @returns A promise that resolves to a PaginatedResponse of Admin objects.
         */
        ```

2.  **Be Specific and Reference Our Arcana**: Name the exact components, types, and schemas you intend to use.

    -   **Weak Prompt**: `// make a form`
    -   **Strong Prompt**: `// Create a form using the useForm hook with the adminFormSchema. The form should have InputField components for name and email.`

3.  **Work Incrementally**: Don't ask for an entire complex feature at once. Prompt for the schema first, then the API function, then the React component. This builds a rich context for Copilot to follow.

---

## 🧐 The Rite of Review: Trust, but Verify

**Treat every suggestion from GitHub Copilot as a collaboration, not a command.** You, the artisan, are the final arbiter of quality.

1.  **NEVER Accept Code You Don't Understand**: If a suggestion seems like magic, it is your duty to understand its workings before accepting it.
2.  **ALWAYS Verify Against The Aesthetic Scroll**: Does the code follow our naming conventions? Does it use Tailwind CSS for styling? Does it correctly use our state management principles (Zustand vs. TanStack Query)?
3.  **Check for Correctness**: Copilot can hallucinate. Verify that the suggested functions, props, and logic actually exist and are used correctly within our project.
4.  **Refactor and Refine**: Copilot is excellent at generating boilerplate. It is your responsibility to refactor the suggestion for clarity, efficiency, and adherence to our principles.

---

## 🔮 Incantations for Specific Domains

### API & Zod Schemas

This is a sacred boundary. Be explicit.

-   **Prompting for Schemas**: "Create a Zod schema named `courseSchema` with `id` (string), `name` (string, min 3), and `teacherId` (string)."
-   **Prompting for API Functions**: "Create an async function `getCourseById` that takes a `courseId` string. It should call the `apiClient` to fetch from `/courses/:courseId` and parse the response with `courseSchema`."

### React Components

-   **Component Structure**: "Create a React functional component `CourseCard` that accepts a `course` prop of type `Course`."
-   **Styling**: "The component should be a `div` with a `bg-brand-surface`, `border`, `rounded-lg`, and `p-4`."
-   **State & Data**: "Use the `useQuery` hook to fetch data using the `getTeacherDashboardData` function and the query key `QUERY_KEYS.teacherDashboard`."

By following these ceremonial practices, you will harness the power of our AI familiar to enhance your craft, not compromise it.