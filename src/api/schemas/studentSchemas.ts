import { z } from 'zod';

export const assignmentSubmissionSchema = z.object({
    submittedAt: z.string().datetime(),
    submittedText: z.string().optional(),
    submittedFile: z.object({
        name: z.string(),
        size: z.number(),
    }).optional(),
});
export type AssignmentSubmission = z.infer<typeof assignmentSubmissionSchema>;

export const assignmentDetailsSchema = z.object({
    id: z.string(),
    title: z.string(),
    course: z.string(),
    dueDate: z.string(),
    instructions: z.string(),
    submission: assignmentSubmissionSchema.nullable(),
});
export type AssignmentDetails = z.infer<typeof assignmentDetailsSchema>;

export const moodCheckInSchema = z.object({
    id: z.string(),
    mood: z.enum(['Happy', 'Neutral', 'Sad']),
    timestamp: z.string().datetime(),
});
export type MoodCheckIn = z.infer<typeof moodCheckInSchema>;