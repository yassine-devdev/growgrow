import { Router, RequestHandler } from "express";
import {
  conciergeChatController,
  categorizeExpenseController,
  genericAiController,
  aiHealthController,
} from "../controllers/ai.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  chatSchema,
  categorizeExpenseSchema,
  genericAiSchema,
} from "../schemas/validation.schemas";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Public health check (no auth) so we can verify provider connectivity quickly.
router.get("/health", aiHealthController as RequestHandler);

// All other AI routes should be authenticated
router.use(authenticate as RequestHandler);

// FIX: Cast controller to `any` to resolve RequestHandler overload issue.
router.post(
  "/chat",
  validate(chatSchema) as RequestHandler,
  conciergeChatController as RequestHandler
);

// FIX: Cast controller to `any` to resolve RequestHandler overload issue.
router.post(
  "/categorize-expense",
  validate(categorizeExpenseSchema) as RequestHandler,
  categorizeExpenseController as RequestHandler
);

// FIX: Cast controller to `any` to resolve RequestHandler overload issue.
router.post(
  "/generate",
  validate(genericAiSchema) as RequestHandler,
  genericAiController as RequestHandler
);

export default router;
