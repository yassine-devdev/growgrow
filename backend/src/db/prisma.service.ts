// FIX: Changed to an import statement to resolve module type issues.
import { PrismaClient } from '@prisma/client';

// PrismaClient is instantiated once and used across the application.
// This is a best practice for performance and connection management.
export const prisma = new PrismaClient();