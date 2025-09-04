import { Router } from 'express';
import authRouter from './auth.routes';
import aiRouter from './ai.routes';
import dataRouter from './data.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/concierge', aiRouter); // Matches frontend's conciergeApi path
router.use('/', dataRouter); // Catch-all for mock data routes

export default router;