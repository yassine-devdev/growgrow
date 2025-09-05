# GROW YouR NEED - AI Omni-Verse Backend

This is the backend service for the GROW YouR NEED Super App. It implements the "AI Omni-Verse" architecture, providing a scalable, model-agnostic gateway for all AI features, along with authentication and data services.

## Prerequisites

- Node.js (v18 or later)
- pnpm or yarn
- Docker (optional, for containerization)

## Getting Started

### 1. Installation

Navigate into the `backend` directory and install the dependencies:

```bash
cd backend
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory by copying the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in the required environment variables:

-   `PORT`: The port the server will run on (defaults to 3001).
-   `API_KEY`: Your Google Gemini API key. This is required for all AI features.
-   `JWT_SECRET`: A long, random string used to sign authentication tokens.

### 3. Running the Development Server

To start the backend in development mode with hot-reloading, run:

```bash
npm run dev
```

The server will be available at `http://localhost:3001`. The frontend application is configured to proxy API requests to this address.

### 4. Building for Production

To compile the TypeScript code into JavaScript for production, run:

```bash
npm run build
```

The output will be in the `/dist` directory.

### 5. Running in Production

After building, you can start the production server with:

```bash
npm start
```

## Docker

A `Dockerfile` is included for containerizing the backend application.

To build the Docker image:

```bash
docker build -t grow-your-need-backend .
```

To run the Docker container (make sure to pass your environment variables):

```bash
docker run -p 3001:3001 --env-file .env grow-your-need-backend
```
