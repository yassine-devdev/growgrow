# Gemini API Usage Guidelines

This document provides the official guidelines for interacting with the Google Gemini API within the GROW YouR NEED ecosystem. All backend AI services must adhere to these principles to ensure security, performance, and maintainability.

## 📜 Core Principle: Backend-Only Integration

**The Google Gemini API key (`API_KEY`) MUST NEVER be exposed on the frontend.**

All interactions with the Gemini API must be proxied through our dedicated backend service, the **AI Multiverse Gateway**. The frontend makes requests to our internal API endpoints (e.g., `/api/concierge/chat`), and the backend securely manages the API key and communicates with Google's servers.

-   **Reference**: [AI Backend Architecture](../../docs/backend_ai.md)

---

## 🔑 API Key Management

-   The API key is managed **exclusively** through the `API_KEY` environment variable in the backend's `.env` file.
-   Do not hardcode the key anywhere in the source code.
-   The key is loaded via `process.env.API_KEY` in the backend configuration (`backend/src/config/index.ts`).

---

## 🤖 Initialization & Model Usage (Backend)

### Correct Initialization

Always initialize the `GoogleGenAI` client within the backend services as follows:

```typescript
import { GoogleGenAI } from "@google/genai";
import config from '../../config'; // Your project's config file

const ai = new GoogleGenAI({ apiKey: config.apiKey });
```

### Approved Models

Only use the models specified by the **AI Multiverse Gateway**'s routing rules. The primary model for general tasks is:

-   **General Text/Chat**: `'gemini-2.5-flash'`
-   **Embedding/RAG**: `'text-embedding-004'`

---

## ✨ API Call Best Practices (Backend)

### Standard Text Generation

For simple, non-streaming text generation, use `generateContent`.

```typescript
// Correct Example
const prompt = "Summarize this document...";
const result = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt
});

// Access the response text directly
const summary = result.text;
```

### Streaming Responses

For real-time features like the AI Concierge, use `generateContentStream` to provide a responsive user experience.

```typescript
// Correct Example
const resultStream = await ai.models.generateContentStream({
  model: 'gemini-2.5-flash',
  contents: prompt
});

for await (const chunk of resultStream) {
  // Process each text chunk
  const textChunk = chunk.text;
  // stream textChunk to the client
}
```

### Requesting JSON Output

To ensure structured, reliable data from the model, use the `responseSchema` configuration. This is the preferred method for tasks that require a specific output format.

```typescript
import { Type } from "@google/genai";

const response = await ai.models.generateContent({
   model: "gemini-2.5-flash",
   contents: "Categorize this expense: 'Team lunch at Pizza Palace'",
   config: {
     responseMimeType: "application/json",
     responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: 'The expense category.',
          },
          vendor: {
            type: Type.STRING,
            description: 'The name of the vendor.',
          }
        },
      },
   },
});

const jsonData = JSON.parse(response.text);
// jsonData = { category: "Food & Dining", vendor: "Pizza Palace" }
```

## 🛡️ RAG (Retrieval-Augmented Generation)

The AI Concierge uses a RAG system to provide contextually-aware answers based on our internal documentation.

-   **Embedding**: New documents are chunked and vectorized using the `'text-embedding-004'` model.
-   **Retrieval**: User prompts are vectorized, and the most similar document chunks are retrieved via cosine similarity from our in-memory vector store (`vector.service.ts`).
-   **Augmentation**: The retrieved chunks are injected into the prompt as context before being sent to `'gemini-2.5-flash'`.

This ensures the AI's responses are grounded in our project's specific knowledge base.
