# GROW YouR NEED — SaaS Super App

This document serves as the main entry point for the project documentation. It provides a high-level overview of the application, its core features, and how to get started with both the frontend and the new backend.

## Project Overview

The SaaS Super App is an all-in-one platform designed for schools and individuals. It unifies education, media, creative tools, gamification, a marketplace, and more into a single, cohesive ecosystem. The application is built as a multi-tenant SaaS platform with a highly dynamic and role-based user interface, now powered by a dedicated Node.js backend.

### Key Features

- **Role-Based UI & Navigation**: The entire user experience, from the available modules to the navigation links, is tailored to the logged-in user's role. All roles (Provider, Admin, Teacher, Student, Parent, Admissions, Individual) are fully implemented with dedicated views.
- **Dedicated Role Dashboards**: Each user role has a unique, feature-rich dashboard presenting the most relevant statistics, charts, action items, and information for their specific needs.
- **Multi-Module Architecture**: The app is divided into distinct modules like Dashboard, Schools, Tools, Communication, etc., which are dynamically loaded based on user permissions.
- **Overlay Window System**: A desktop-like experience where users can open, minimize, move, resize, and interact with multiple "apps" (like Studio, Media, Marketplace) in floating windows.
- **Command Palette**: A fast, keyboard-driven interface (Ctrl/Cmd+K) for searching and navigating to any page within the user's permission scope.
- **AI-Powered Backend**: The new backend features an "AI Omni-Verse" gateway, integrating with Google's Gemini API for features like the AI Concierge, report summary generation, and a Retrieval-Augmented Generation (RAG) system that can answer questions about the platform itself.
- **Real-time Notifications**: A fully-functional notification center and real-time monitoring dashboards powered by a WebSocket-based service.
- **Feature Flagging**: Allows for A/B testing and gradual rollout of new features.
- **Internationalization (i18n)**: The application supports multiple languages (English, Spanish, French, Arabic), with translations managed in JSON files.

## Tech Stack

### Frontend
- **Framework**: React 19 & TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (UI), TanStack Query v5 (Server)
- **Routing**: React Router v6

### Backend
- **Framework**: Node.js & Express with TypeScript
- **Authentication**: JWTs with HttpOnly cookies
- **AI Integration**: Google Gemini API via `@google/genai`
- **Architecture**: Custom "AI Omni-Verse" gateway with RAG capabilities.

## Documentation Index

- **[Getting Started](./GETTING_STARTED.md)**: How to set up and run the project (frontend and backend).
- **[Architecture (Frontend)](./ARCHITECTURE.md)**: A deep dive into the frontend's structure.
- **[Architecture (Backend)](../backend/docs/ARCHITECTURE.md)**: A deep dive into the AI Omni-Verse backend architecture.
- **[Backend Integration](./BACKEND_INTEGRATION.md)**: How the frontend connects to the backend.
- **[API Reference](./API_REFERENCE.md)**: Information about the application's API endpoints.
- **[Component Library](./COMPONENTS.md)**: An overview of the reusable React components.
- **[State Management](./STATE_MANAGEMENT.md)**: How global and server state are handled.
- **[Routing](./ROUTING.md)**: Details on the application's routing system.
- **[Internationalization](./INTERNATIONALIZATION.md)**: Guide to adding and using translations.
- **[Testing Guide](./TESTING.md)**: How to run and write tests.
- **[Feature Flags](./FEATURE_FLAGS.md)**: How to use the feature flagging system.
- **[Design & Layout Guides](./design-layout/provider.md)**: A collection of guides detailing the design system for each user role.
- **[Our Vision (GROW YouR NEED)](./growyourneed.md)**: The mission and philosophy behind the product.
