# The Ceremonial Scroll for the Gemini Universe

This scroll provides the official guidelines for interacting with the Google Gemini API within the GROW YouR NEED ecosystem. All backend AI services must adhere to these principles to ensure security, performance, and maintainability.

---

## 📜 Core Principle: The Backend is the Sanctum

**The Google Gemini API key (`API_KEY`) MUST NEVER be exposed on the frontend.**

This is the most sacred rule. All interactions with the Gemini API must be proxied through our dedicated backend service, the **AI Multiverse Gateway**. The frontend makes requests to our internal API endpoints (e.g., `/api/concierge/chat`), and the backend securely manages the API key and communicates with Google's servers.

-   **Reference**: [AI Backend Architecture](../../docs/backend_ai.md)

---

## 🔑 The Gateway's Will: The Source of Truth

The **`model-router.service.ts`** in the backend is the single source of truth for *which* model to use for a given task. Developers should not hardcode model names in their feature logic. Instead, call a higher-level service (like `aiGatewayService`) that uses the router to select the optimal model based on performance, cost, and quality requirements.

---

## 🤖 Initiating the Connection (Backend Only)

### Correct Initialization

Always initialize the `GoogleGenAI` client within the backend services as follows, retrieving the key from our centralized config.

```typescript
import { GoogleGenAI } from "@google/genai";
import config from '../../config'; // Your project's config file

const ai = new GoogleGenAI({ apiKey: config.apiKey });