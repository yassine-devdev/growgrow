import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import config from "../../config";
import { Role } from "types";

/**
 * The shape of the user object attached to the request by the `authenticate` middleware.
 */
export interface AuthenticatedUser {
  id: string;
  role: Role;
}
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
    const decoded = jwt.verify(token, config.jwt.secret) as AuthenticatedUser;
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
 * A predicate function for custom authorization logic.
 * @param user The authenticated user object from the request.
 * @returns `true` if the user is authorized, otherwise `false`.
 */
type PermissionCheck = (user: AuthenticatedUser) => boolean;

/**
 * Middleware factory to authorize requests based on user roles.
 * Must be used after the `authenticate` middleware.
 * @param ...args - Either a list of allowed roles (e.g., 'Admin', 'Teacher')
 * or a single custom permission check function.
 */
export const permit = (...args: Role[] | [PermissionCheck]): RequestHandler => {
  return (req, res, next) => {
    const user = req.user as AuthenticatedUser | undefined;
    if (!user) {
      return res
        .status(403)
        .json({ message: "Forbidden: User role not found." });
    }

    const isAuthorized =
      typeof args[0] === "function"
        ? (args[0] as PermissionCheck)(user)
        : (args as Role[]).includes(user.role);

    if (isAuthorized) {
      return next();
    } else {
      return res.status(403).json({
        message:
          "Forbidden: You do not have permission to access this resource.",
      });
    }
  };
};
