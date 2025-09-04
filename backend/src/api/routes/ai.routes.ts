import { Router } from 'express';
import { conciergeChatController, categorizeExpenseController, genericAiController } from '../controllers/ai.controller';
import { validate } from '../middlewares/validation.middleware';
import { chatSchema, categorizeExpenseSchema, genericAiSchema } from '../schemas/validation.schemas';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All AI routes should be authenticated
router.use(authenticate as any);

// FIX: Cast controller to `any` to resolve RequestHandler overload issue.
router.post('/chat', validate(chatSchema) as any, conciergeChatController as any);

// FIX: Cast controller to `any` to resolve RequestHandler overload issue.
router.post('/categorize-expense', validate(categorizeExpenseSchema) as any, categorizeExpenseController as any);

// FIX: Cast controller to `any` to resolve RequestHandler overload issue.
router.post('/generate', validate(genericAiSchema) as any, genericAiController as any);

export default router;