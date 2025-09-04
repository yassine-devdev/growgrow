import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import config from "../../config";
import { Role } from "types";

/**
 * Middleware to authenticate requests by verifying the JWT from cookies.
 * Attaches the decoded user payload to `req.user`.
 */
export const authenticate: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication required: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      role: Role;
    };
    req.user = decoded;
    next();
  } catch (error) {
    // Clear cookie if token is invalid
    res.clearCookie("token");
    return res
      .status(401)
      .json({ message: "Authentication failed: Invalid token." });
  }
};

/**
 * Middleware factory to authorize requests based on user roles.
 * Must be used after the `authenticate` middleware.
 * @param allowedRoles - A list of roles that are permitted to access the route.
 */
export const permit = (...allowedRoles: Role[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Forbidden: User role not found." });
    }

    const { role } = req.user;
    if (allowedRoles.length > 0 && allowedRoles.includes(role)) {
      next();
    } else {
      res
        .status(403)
        .json({
          message:
            "Forbidden: You do not have permission to access this resource.",
        });
    }
  };
};
