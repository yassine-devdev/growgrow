import { z } from "zod";
import { ROLES } from "@/constants/navigation";

/**
 * Schema for validating the login request body.
 */
export const loginSchema = z.object({
  body: z.object({
    role: z.enum(ROLES as [string, ...string[]], {
      message: "Invalid role specified.",
    }),
  }),
});

/**
 * Schema for validating the chat request body.
 */
export const chatSchema = z.object({
  body: z.object({
    prompt: z.string().min(1, "Prompt cannot be empty."),
    userRole: z.enum(ROLES as [string, ...string[]]),
  }),
});

/**
 * Schema for validating AI feedback request body.
 */
export const aiFeedbackSchema = z.object({
  body: z.object({
    studentName: z.string().min(1),
    assignmentTitle: z.string().min(1),
    score: z.number().nullable(),
    maxPoints: z.number().positive(),
  }),
});

/**
 * Schema for validating a schoolId URL parameter.
 */
export const schoolIdParamSchema = z.object({
  params: z.object({
    schoolId: z.string().min(1, "School ID is required."),
  }),
});

/**
 * Schema for validating the AI expense categorization request body.
 */
export const categorizeExpenseSchema = z.object({
  body: z.object({
    description: z
      .string()
      .min(3, "Description must be at least 3 characters."),
  }),
});

/**
 * Schema for validating generic AI requests.
 */
export const genericAiSchema = z.object({
  body: z.object({
    prompt: z.string().min(1, "Prompt cannot be empty."),
  }),
});

/**
 * Schema for validating lesson plan creation/update.
 */
export const lessonPlanSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    title: z.string().min(3),
    course: z.string().min(1),
    date: z.string().refine((val) => !isNaN(Date.parse(val))),
    objectives: z.string().min(10),
    materials: z.string(),
    activities: z.string().min(10),
  }),
});

/**
 * Schema for validating AI lesson plan generation.
 */
export const aiLessonPlanSchema = z.object({
  body: z.object({
    topic: z.string().min(3),
    objective: z.string().min(10),
  }),
});
