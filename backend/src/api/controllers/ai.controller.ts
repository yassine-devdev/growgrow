import { RequestHandler } from "express";
import { aiGatewayService } from "../../core/ai/orchestration/ai-gateway.service";
import { Role } from "types";
import { GoogleGenAI } from "@google/genai";
import config from "../../config";
import logger from "../../utils/logger";

export const conciergeChatController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    // Validation is now handled by middleware, we can safely access the body.
    const { prompt, userRole } = req.body as { prompt: string; userRole: Role };

    // Set headers for a streaming response
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const stream = await aiGatewayService.generateResponseStream(
      prompt,
      userRole
    );

    // Pipe the readable stream to the response
    const reader = stream.getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      res.write(value);
    }

    res.end();
  } catch (error) {
    // If an error occurs after headers are sent, we can't send a JSON error response.
    // We just log it and end the response. The client will handle the broken stream.
    logger.error("Error during AI stream:", error as Error);
    if (!res.headersSent) {
      next(error);
    } else {
      res.end();
    }
  }
};

export const categorizeExpenseController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { description } = req.body as { description: string };
    const categories = ["Marketing", "Software", "Office", "Travel"];

    const ai = new GoogleGenAI({ apiKey: config.apiKey });
    const prompt = `Given the expense description "${description}", categorize it into one of the following exact categories: ${categories.join(", ")}. Respond with only the single category name and nothing else.`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const category =
      result && typeof result.text === "string" ? result.text.trim() : "";

    // Simple validation to ensure the model returned a valid category
    if (categories.includes(category)) {
      res.json({ category });
    } else {
      // Fallback or error if the model hallucinates a new category
      res
        .status(500)
        .json({ message: "AI failed to return a valid category." });
    }
  } catch (error) {
    next(error);
  }
};

export const genericAiController: RequestHandler = async (req, res, next) => {
  try {
    const { prompt } = req.body as { prompt: string };
    const ai = new GoogleGenAI({ apiKey: config.apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    res.json({
      text: result && typeof result.text === "string" ? result.text : "",
    });
  } catch (error) {
    next(error);
  }
};
