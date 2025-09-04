import { RequestHandler } from "express";

export const validate =
  (schema: any): RequestHandler =>
  (req, res, next) => {
    // No-op in build; a real implementation would validate with zod/ajv and return 400 on errors
    next();
  };
