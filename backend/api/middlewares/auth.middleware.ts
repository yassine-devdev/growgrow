import { RequestHandler } from "express";

export const authenticate: RequestHandler = (req, res, next) => {
  // Minimal auth guard for build: expects req.headers.authorization = 'Bearer <token>'
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Unauthorized" });
  // In production this will verify JWT; here we attach a minimal user object
  (req as any).user = { id: "system", role: "Provider" };
  next();
};

export const permit = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    const userRole = req.user?.role;
    if (!roles.includes(userRole))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
};
