# AI Backend Architecture: The Multiverse Gateway

This document outlines the cutting-edge backend architecture for all AI-powered features within the GROW YouR NEED Super App. Our vision is to create a model-agnostic, cost-effective, high-performance, and resilient AI backbone. To achieve this, we introduce the **"AI Multiverse Gateway"**.

## 1. Vision: The AI Multiverse

The "Multiverse" concept is our strategic approach to AI integration. Instead of being locked into a single AI provider, we treat each one—**Google Gemini, OpenAI, Anthropic (Claude), Groq, localhost Ollama, and aggregators like OpenRouter**—as a distinct "universe" of intelligence. Each universe has unique strengths in terms of speed, cost, reasoning capability, modality (text, image, video), and specialization.

The **AI Multiverse Gateway** is a sophisticated routing and abstraction layer that sits between our application and these AI universes. Its prime directive is to select the optimal model from the best universe for any given task, based on a dynamic ruleset.

This architecture ensures our application is:
- **Future-Proof**: We can seamlessly integrate new, state-of-the-art models as they are released.
- **Cost-Effective**: We can route tasks to cheaper models for simple requests and reserve expensive models for complex ones.
- **Resilient**: If one provider has an outage, the gateway can automatically reroute requests to another.
- **Flexible**: We can leverage specialized models for specific tasks (e.g., Groq for low-latency chat, Gemini for multi-modal analysis, a local Ollama instance for development or data-sensitive tasks).

---

## 2. Core Architectural Principles

1.  **Abstraction**: A single, unified internal API for all AI services. A request to `summarize(text)` in our backend code works identically, whether it's ultimately fulfilled by Gemini, GPT-4o, or a local Llama3 model.
2.  **Strategic Routing**: An intelligent router that dynamically selects the best model based on:
    -   **Task Type**: (e.g., `chat`, `summarization`, `code_generation`, `image_analysis`).
    -   **Performance Needs**: Prioritizing low latency (Groq) vs. high quality (GPT-4o, Claude Opus).
    -   **Cost Constraints**: Using cost-effective models (Gemini 2.5 Flash) for high-volume, low-complexity tasks.
    -   **User Tier**: Allowing premium users access to more powerful models.
    -   **Provider Health**: Rerouting away from providers experiencing downtime.
3.  **Orchestration**: The ability to chain multiple AI calls or combine models to solve complex problems. For example, using Gemini Vision to describe an image and then feeding that description to Claude for a creative story.
4.  **Robust Caching**: A centralized caching layer (Redis) to store results of deterministic AI requests, dramatically reducing latency and cost for repeated queries.
5.  **Observability**: Detailed logging, tracing, and monitoring for every AI call. We track cost per request, latency, provider, model used, and error rates.
6.  **Security & Privacy**: Centralized management of all provider API keys in a secure vault. The gateway also performs prompt sanitization, PII redaction, and guards against prompt injection attacks.
7.  **Local-First Development**: Full integration with **Ollama** allows developers to run and test the AI system locally using open-source models without incurring API costs or requiring an internet connection.

---

## 3. Technology Stack

-   **Language/Framework**: **Node.js with Express**. Express provides a minimal and flexible framework that is well-suited for building this custom gateway.
-   **AI Gateway Service**: A custom-built service containing the core logic.
    -   **Provider SDKs**: Official SDKs for major providers (`@google/genai`, `openai`, `@anthropic-ai/sdk`).
    -   **Aggregator Integration**: **OpenRouter** will be a primary provider within the gateway. Its standardized API format simplifies access to a vast range of models from different providers, reducing the number of direct integrations we need to maintain.
    -   **Local Model Integration**: A dedicated client for communicating with a local **Ollama** REST API.
-   **Caching**: **Redis** for its speed and versatility in caching AI responses and session data.
-   **Logging & Monitoring**: **Winston** or **Pino** for structured logging, **Prometheus** for metrics, and **Grafana** for dashboards.
-   **API Key Management**: **HashiCorp Vault** or cloud-provider solutions (e.g., AWS Secrets Manager, Google Secret Manager).
-   **Deployment**: **Docker** for containerization and **Kubernetes** for orchestration and scalability.

---

## 4. Service Breakdown & Diagram

The AI Multiverse Gateway is composed of several key services that work in concert.

```mermaid
graph TD
    A[Frontend App] -->|/api/concierge/chat| B(Gateway Controller);
    B --> C{AI Gateway Service};
    C --> D{Router Service};
    D -->|Selects Provider| E[Provider Services];
    subgraph Provider Services
        P1(Gemini Provider)
        P2(OpenAI Provider)
        P3(Anthropic Provider)
        P4(Groq Provider)
        P5(OpenRouter Provider)
        P6(Ollama Provider)
    end
    E --> F{API Key Vault};
    E --> G{Cache Service (Redis)};
    G --> E;
    E --> H[External AI APIs];
    H --> E;
    E --> C;
    C --> B;
    B --> A;

    C --> I{Observability};
    I --> J[Logging/Metrics/Tracing];
```

1.  **`GatewayController` (API Layer)**: Exposes endpoints like `/api/concierge/chat` or `/api/ai/generate-feedback` to the frontend. It's the public-facing entry point.
2.  **`AIGatewayService` (Core Logic)**: Receives requests from the controller. It's responsible for orchestrating the overall flow, calling the router, handling caching, and formatting the final response.
3.  **`RouterService`**: The brain of the operation. It contains the ruleset for model selection.
    -   **Input**: Task type, user context, performance requirements.
    -   **Logic**: A series of `if/else` or a more sophisticated strategy pattern to evaluate rules.
    -   **Output**: An instance of a specific `ProviderService`.
4.  **`ProviderServices` (`GeminiProvider`, `OpenAIProvider`, `OllamaProvider`, etc.)**:
    -   Each provider has its own service that implements a common `I_AIProvider` interface (e.g., `generateStream`, `generate`).
    -   This service is responsible for formatting the request payload into the specific format required by the provider's API (e.g., Gemini's `contents` vs. OpenAI's `messages`).
    -   It retrieves the appropriate API key from the Vault.
    -   It parses the provider's response back into a standardized internal format.
5.  **`CacheService`**: A wrapper for Redis that provides simple `get` and `set` methods. The `AIGatewayService` checks the cache before invoking the `RouterService`.
6.  **`SecurityService`**: Provides methods for redacting PII from prompts and sanitizing inputs.

---

## 5. Example Workflow: The AI Concierge

Let's trace a request from the Teacher user in the AI Concierge.

1.  **Request**: The frontend sends a `POST` request to `/api/concierge/chat` with the prompt: `"Suggest a creative project idea for a 10th-grade history class on the Renaissance."`
2.  **Entry**: The `GatewayController` receives the request and passes it, along with the user's role (`Teacher`), to the `AIGatewayService`.
3.  **Caching**: The `AIGatewayService` creates a unique hash of the prompt and user role and checks the `CacheService`. It's a cache miss.
4.  **Routing**: The `AIGatewayService` invokes the `RouterService` with `task: 'creative_chat'`, `role: 'Teacher'`.
5.  **Decision**: The `RouterService` evaluates its rules:
    -   The task is creative, so a high-quality model is preferred.
    -   It's not a low-latency-critical task.
    -   The user is a `Teacher`, who may have access to mid-tier models.
    -   **Rule Match**: Route to `Anthropic Claude 3.5 Sonnet` via **OpenRouter** for a great balance of creativity and cost. The `RouterService` returns an instance of the `OpenRouterProvider`.
6.  **Execution**:
    -   The `OpenRouterProvider` retrieves the OpenRouter API key from the Vault.
    -   It formats the prompt into the standard OpenAI-compatible format that OpenRouter uses.
    -   It makes the API call to OpenRouter, specifying the `anthropic/claude-3.5-sonnet` model.
7.  **Response**:
    -   OpenRouter streams the response back.
    -   The `OpenRouterProvider` transforms the streamed chunks into our standardized internal format.
    -   The `AIGatewayService` streams the response back to the `GatewayController`, which sends it to the frontend.
    -   Once the stream is complete, the `AIGatewayService` stores the full response in the `CacheService` with a 24-hour TTL.
8.  **Logging**: Throughout the process, the gateway logs the model used (`claude-3.5-sonnet`), the provider (`OpenRouter`), the latency, and the calculated cost of the request to our observability platform.

This architecture provides maximum flexibility and control, allowing GROW YouR NEED to deliver the best possible AI experience to its users in the most efficient way possible.
