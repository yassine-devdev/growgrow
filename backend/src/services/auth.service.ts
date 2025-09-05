import * as jwt from "jsonwebtoken";
import config from "../config";
import { Role, User } from "../../../types";
import { prisma } from "../db/prisma.service";
import * as bcrypt from "bcrypt";

// A local type to represent the user object from Prisma, avoiding `any`.
type PrismaUser = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  password?: string | null; // Password can be null or not selected
  schoolId: string | null;
};

const mapPrismaUserToAppUser = (prismaUser: PrismaUser): User => {
  const fullName = prismaUser.lastName
    ? `${prismaUser.name} ${prismaUser.lastName}`.trim()
    : prismaUser.name;
  return {
    id: prismaUser.id,
    name: fullName,
    email: prismaUser.email,
    role: prismaUser.role as Role,
    avatarUrl: prismaUser.avatarUrl || undefined,
  };
};

export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: User }> => {
  const dbUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!dbUser) {
    throw new Error("Invalid credentials.");
  }

  const isPasswordValid = await bcrypt.compare(password, dbUser.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials.");
  }

  const user = mapPrismaUserToAppUser(dbUser);

  const payload = {
    id: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 1 day
  };

  const token = jwt.sign(payload, config.jwt.secret);

  return { token, user };
};