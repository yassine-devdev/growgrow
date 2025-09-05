import { RequestHandler } from "express";
import { authenticateUser } from "../../services/auth.service";

export const loginController: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await authenticateUser(email, password);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      domain: isProd ? undefined : "localhost",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
