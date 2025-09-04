import { RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import logger from '../../utils/logger';

/**
 * A middleware factory that creates a validation handler for a given Zod schema.
 * This middleware validates the request's `body`, `query`, and `params` against the provided schema.
 *
 * If validation succeeds, it calls `next()` to pass control to the next middleware.
 * If validation fails, it sends a 400 Bad Request response with a structured error object.
 *
 * @param schema - The Zod schema to validate the request against.
 * @returns An Express RequestHandler middleware function.
 *
 * @example
 * // In a route file:
 * import { validate } from '../middlewares/validation.middleware';
 * import { loginSchema } from '../schemas/validation.schemas';
 *
 * router.post('/login', validate(loginSchema), loginController);
 */
export const validate = (schema: ZodSchema): RequestHandler => {
    return (req, res, next): void => {
        try {
            // Zod's `parse` method will throw an error if validation fails.
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // If we reach here, validation was successful.
            next();
        } catch (error) {
            // Check if the error is from Zod
            if (error instanceof ZodError) {
                // Map Zod's error issues to a more user-friendly format.
                const errors = error.issues.map(err => ({
                    field: err.path.join('.'), // e.g., "body.email"
                    message: err.message,
                }));
                
                // Log the detailed validation error for debugging.
                logger.error('Validation failed', {
                    path: req.path,
                    errors,
                });
                
                // Send a 400 response with the validation details.
                res.status(400).json({
                    message: 'Validation Error',
                    details: errors,
                });
                return; // Stop further execution
            }

            // For non-validation errors, pass them to the global error handler.
            next(error);
        }
    };
};
