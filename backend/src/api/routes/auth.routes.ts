import { Router } from 'express';
import { loginController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { loginSchema } from '../schemas/validation.schemas';

const router = Router();

// FIX: Cast loginController to `any` to resolve RequestHandler overload issue.
router.post('/login', validate(loginSchema) as any, loginController as any);

export default router;