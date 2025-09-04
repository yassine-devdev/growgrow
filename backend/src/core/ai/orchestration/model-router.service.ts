import { GeminiProvider } from "../providers/gemini.provider";
import { IAIProvider } from "../providers/provider.interface";
import { OllamaProvider } from "../providers/ollama.provider";
import { OpenRouterProvider } from "../providers/openrouter.provider";
import { GroqProvider } from "../providers/groq.provider";
import { AnthropicProvider } from "../providers/anthropic.provider";
import { OpenAIProvider } from "../providers/openai.provider";
import logger from "../../../utils/logger";

/**
 * Defines the criteria for selecting an AI model.
 */
interface RoutingCriteria {
  taskType:
    | "chat"
    | "summarization"
    | "data_analysis"
    | "image_generation"
    | "code_generation";
  intent?: "low_latency" | "high_quality" | "low_cost" | "balanced";
}

/**
 * Represents a single routing rule in our rules engine.
 */
interface Route {
  criteria: Partial<RoutingCriteria>;
  provider: IAIProvider;
  description: string;
}

interface ProviderHealth {
  isHealthy: boolean;
  latency: number; // in ms
}

class ModelRouter {
  private geminiProvider: GeminiProvider;
  private ollamaProvider: OllamaProvider;
  private openRouterProvider: OpenRouterProvider;
  private groqProvider: GroqProvider;
  private anthropicProvider: AnthropicProvider;
  private openAIProvider: OpenAIProvider;
  private providerHealth: Map<IAIProvider, ProviderHealth>;
  private routes: Route[];

  constructor() {
    this.geminiProvider = new GeminiProvider();
    this.ollamaProvider = new OllamaProvider();
    this.openRouterProvider = new OpenRouterProvider();
    this.groqProvider = new GroqProvider();
    this.anthropicProvider = new AnthropicProvider();
    this.openAIProvider = new OpenAIProvider();

    this.providerHealth = new Map();
    this.initializeHealthChecks();

    this.routes = [
      {
        criteria: { taskType: "chat", intent: "low_latency" },
        provider: this.groqProvider,
        description: "Prioritize speed for real-time chat.",
      },
      {
        criteria: { taskType: "data_analysis", intent: "high_quality" },
        provider: this.anthropicProvider,
        description: "Use high-quality model for complex data analysis.",
      },
      {
        criteria: { taskType: "summarization", intent: "low_cost" },
        provider: this.geminiProvider,
        description: "Use cost-effective model for summarization.",
      },
      {
        criteria: { taskType: "code_generation" },
        provider: this.openAIProvider,
        description: "Use OpenAI for code generation tasks.",
      },
    ];
  }

  private initializeHealthChecks() {
    // In a real app, this would ping provider status endpoints periodically.
    this.providerHealth.set(this.geminiProvider, {
      isHealthy: true,
      latency: 1500,
    });
    this.providerHealth.set(this.openAIProvider, {
      isHealthy: true,
      latency: 2000,
    });
    this.providerHealth.set(this.anthropicProvider, {
      isHealthy: true,
      latency: 2200,
    });
    this.providerHealth.set(this.groqProvider, {
      isHealthy: true,
      latency: 300,
    });
    this.providerHealth.set(this.openRouterProvider, {
      isHealthy: true,
      latency: 2500,
    });
    // Simulate an outage for a provider to test resilience
    this.providerHealth.set(this.ollamaProvider, {
      isHealthy: false,
      latency: 99999,
    });
  }

  selectModel(criteria: RoutingCriteria): IAIProvider {
    logger.info(`Routing AI request with criteria`, { criteria });

    const matchingRoutes = this.routes.filter((route) => {
      return Object.entries(route.criteria).every(
        ([key, value]) => criteria[key as keyof RoutingCriteria] === value
      );
    });

    const eligibleProviders = matchingRoutes
      .map((route) => route.provider)
      .filter((provider) => this.providerHealth.get(provider)?.isHealthy);

    if (eligibleProviders.length > 0) {
      eligibleProviders.sort((a, b) => {
        const healthA = this.providerHealth.get(a)!;
        const healthB = this.providerHealth.get(b)!;
        return healthA.latency - healthB.latency;
      });

      const bestProvider = eligibleProviders[0];
      logger.info(
        `Routing decision: Matched rule. Selected provider by performance.`,
        {
          provider: bestProvider.constructor.name,
          latency: this.providerHealth.get(bestProvider)?.latency,
        }
      );
      return bestProvider;
    }

    if (
      process.env.USE_OLLAMA === "true" &&
      this.providerHealth.get(this.ollamaProvider)?.isHealthy
    ) {
      logger.info(
        "Routing decision (Fallback): Using Ollama for local development."
      );
      return this.ollamaProvider;
    }

    logger.info(
      `Routing decision (Fallback): No specific rule matched or provider unhealthy. Using default provider: GeminiProvider`
    );
    return this.geminiProvider;
  }
}

export const modelRouter = new ModelRouter();
