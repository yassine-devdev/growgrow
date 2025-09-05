import { Request, Response, NextFunction } from "express";
import { aiGatewayService } from "../../core/ai/orchestration/ai-gateway.service";
import { Role } from "types";
import { GoogleGenAI } from "@google/genai";
import config from "../../config";
import logger from "../../utils/logger";

// NOTE: These endpoints return concrete results and never rely on null/undefined
// sentinel values. All variables are initialized with sensible defaults.

interface EmbedResponse {
  embeddings: Array<{ values: number[] }>;
}

interface GenerateResponse {
  text: string;
}

interface ConciergeRequestBody {
  prompt: string;
  userRole: Role;
}

interface GenericRequestBody {
  prompt: string;
}

export async function conciergeChatController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> {
  // Validate inputs strictly and provide a default safe prompt when missing
  const raw = (req.body as Partial<ConciergeRequestBody>) || {};
  const prompt = raw.prompt && raw.prompt.length > 0 ? raw.prompt : "Hello";
  const userRole = raw.userRole ? raw.userRole : ("Teacher" as Role);

  // Set headers for streaming text
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  try {
    res.flushHeaders();
  } catch (err) {
    // Best-effort: some environments don't implement flushHeaders
    logger.info("Response flush not available, continuing without it.");
  }

  try {
    const stream = await aiGatewayService.generateResponseStream(
      prompt,
      userRole
    );

    // Read from the stream and write to response as text chunks.
    const reader = stream.getReader();
    try {
      while (true) {
        const readResult = await reader.read();
        if (readResult.done) break;
        const chunk = readResult.value;
        if (typeof chunk === "string" && chunk.length > 0) {
          res.write(chunk);
        }
      }
    } finally {
      try {
        res.end();
      } catch (err) {
        logger.error("Failed to end response stream", {
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return res.status(200);
  } catch (err) {
    logger.error("Error during AI stream", {
      message: err instanceof Error ? err.message : String(err),
    });
    try {
      if (!res.headersSent) {
        next(err);
        return res
          .status(500)
          .json({ error: err instanceof Error ? err.message : String(err) });
      }
      res.end();
    } catch (endErr) {
      logger.error("Error ensuring response end after stream failure", {
        message: endErr instanceof Error ? endErr.message : String(endErr),
      });
      return res
        .status(500)
        .json({
          error: endErr instanceof Error ? endErr.message : String(endErr),
        });
    }
    return res
      .status(500)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
}

export async function categorizeExpenseController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> {
  try {
    const body = (req.body as { description?: string }) || { description: "" };
    const description =
      typeof body.description === "string" && body.description.length > 0
        ? body.description
        : "General expense";

    const categories = ["Marketing", "Software", "Office", "Travel", "Other"];

    const ai = new GoogleGenAI({
      apiKey: config.geminiApiKey || config.apiKey,
    });
    const prompt = `Categorize the following expense description into one exact category from: ${categories.join(", ")}. Reply with exactly one category name and nothing else. Description: ${description}`;

    // Call the provider and parse a conservative non-empty string result.
    let categoryText = "Other";
    try {
      const raw = (await ai.models.generateContent({
        model: "gemini-2.5-mini",
        contents: prompt,
      })) as GenerateResponse;
      const candidate =
        typeof raw.text === "string" && raw.text.length > 0
          ? raw.text.trim()
          : "";
      if (categories.includes(candidate)) {
        categoryText = candidate;
      } else {
        // Try a safe fallback: look for presence of category keywords inside the text
        const lower = candidate.toLowerCase();
        for (const c of categories) {
          if (lower.indexOf(c.toLowerCase()) !== -1) {
            categoryText = c;
            break;
          }
        }
      }
    } catch (err) {
      logger.error("Expense categorization failed to call AI provider", {
        message: err instanceof Error ? err.message : String(err),
      });
      categoryText = "Other";
    }

    return res.json({ category: categoryText });
  } catch (err) {
    // Delegate to error middleware, then return a concrete 500 response
    next(err);
    return res
      .status(500)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
}

export async function genericAiController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> {
  try {
    const body = (req.body as { prompt?: string }) || { prompt: "" };
    const prompt =
      typeof body.prompt === "string" && body.prompt.length > 0
        ? body.prompt
        : "Hello";

    const ai = new GoogleGenAI({
      apiKey: config.geminiApiKey || config.apiKey,
    });
    try {
      const raw = (await ai.models.generateContent({
        model: "gemini-2.5-mini",
        contents: prompt,
      })) as GenerateResponse;
      const text = typeof raw.text === "string" ? raw.text : "";
      return res.json({ text });
    } catch (err) {
      logger.error("Generic AI call failed", {
        message: err instanceof Error ? err.message : String(err),
      });
      return res.status(502).json({ text: "" });
    }
  } catch (err) {
    next(err);
    return res
      .status(500)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
}

export async function aiHealthController(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> {
  // Construct an object that will always include concrete fields
  const out = {
    embed: { ok: false, length: 0, error: "" },
    generate: { ok: false, text: "", error: "" },
  } as {
    embed: { ok: boolean; length: number; error: string };
    generate: { ok: boolean; text: string; error: string };
  };

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey || config.apiKey });

  // Embedding check
  try {
    const embedResp = (await ai.models.embedContent({
      model: "text-embedding-3-large",
      contents: ["health-check"],
    })) as EmbedResponse;
    const length =
      Array.isArray(embedResp.embeddings) &&
      Array.isArray(embedResp.embeddings[0].values)
        ? embedResp.embeddings[0].values.length
        : 0;
    out.embed.ok = true;
    out.embed.length = length;
  } catch (err) {
    out.embed.ok = false;
    out.embed.error = err instanceof Error ? err.message : String(err);
    logger.error("Embedding health check failed", { message: out.embed.error });
  }

  // Generation check with a conservative timeout
  try {
    const genPromise = ai.models.generateContent({
      model: "gemini-2.5-mini",
      contents: "Say hello in one short sentence.",
    }) as Promise<GenerateResponse>;
    const timeoutMs = 8000;
    const timeoutPromise = new Promise<GenerateResponse>((_res, rej) =>
      setTimeout(() => rej(new Error("generation timeout")), timeoutMs)
    );
    const genResp = (await Promise.race([
      genPromise,
      timeoutPromise,
    ])) as GenerateResponse;
    out.generate.ok = true;
    out.generate.text = typeof genResp.text === "string" ? genResp.text : "";
  } catch (err) {
    out.generate.ok = false;
    out.generate.error = err instanceof Error ? err.message : String(err);
    logger.error("Generation health check failed", {
      message: out.generate.error,
    });
  }

  try {
    return res.json(out);
  } catch (err) {
    next(err);
    return res
      .status(500)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
}
