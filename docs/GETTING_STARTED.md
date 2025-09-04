# Getting Started

This guide provides all the necessary steps to set up and run the SaaS Super App project for local development.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18.x or later.
- **npm**: Version 9.x or later (comes bundled with Node.js).
- A modern web browser like Chrome, Firefox, or Edge.

## Installation

1.  **Clone the Repository**:
    If you have access to the project's repository, clone it to your local machine.

2.  **Install Dependencies**:
    Navigate to the project's root directory and install the required npm packages. Note that while there is no `package-lock.json` in the provided files, a standard project would use this command. The development environment will resolve dependencies based on `package.json`.

    ```bash
    npm install
    ```

## Environment Variables

The application requires an API key to communicate with the Google Gemini API for the AI Concierge feature.

1.  **Create an Environment File**:
    In a standard project, you would create a `.env` file in the root directory.

2.  **Add the API Key**:
    Add the following line to your `.env` file, replacing `YOUR_API_KEY` with your actual Google Gemini API key.

    ```
    API_KEY=YOUR_API_KEY
    ```

    In this project's execution environment, this variable is assumed to be pre-configured and available as `process.env.API_KEY`.

## Running the Application

This project is designed to run in a web-based development environment that automatically handles the build process. To interact with the application's key development tools, use the provided npm scripts.

### Running Storybook

Storybook allows you to develop and test UI components in isolation. It's an excellent way to explore the component library.

To start the Storybook server, run:

```bash
npm run storybook
```

This will open Storybook in your browser, typically at `http://localhost:6006`.

### Running End-to-End Tests

The project uses Playwright for end-to-end (E2E) testing, which simulates real user interactions in a browser.

To run the entire test suite, use the following command:

```bash
npm test
```

This will launch the Playwright test runner in headless mode. You can view the results in the terminal. To see a detailed HTML report of the test run, you can use the command:

```bash
npx playwright show-report
```

## Development Workflow

1.  **Component Development**: When building a new UI component or modifying an existing one, start by running Storybook. Create or update the component's `.stories.tsx` file to represent its various states.
2.  **View and Feature Development**: Integrate components into views located in the `/views` directory. Use TanStack Query hooks to fetch data from the mock API.
3.  **Testing**: Write Playwright tests in the `/e2e` directory to cover new user flows and features.
4.  **Documentation**: Keep documentation in the `/docs` directory updated as the application evolves.
