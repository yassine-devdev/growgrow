import { Router, RequestHandler } from "express";
import { loginController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import { loginSchema } from "../schemas/validation.schemas";
import rateLimit from "express-rate-limit";

const router = Router();

// Apply rate limiting to the login route to prevent brute-force attacks.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { message: "Too many login attempts, please try again after 15 minutes." },
});

// Use RequestHandler casts for middleware and controller to satisfy express typing
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema) as RequestHandler,
  loginController as RequestHandler
);

export default router;
