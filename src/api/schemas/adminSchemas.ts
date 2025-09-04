import { z } from 'zod';
import { statSchema } from './commonSchemas';

export const academicHealthSchema = z.object({
    stats: z.array(statSchema),
    enrollmentTrend: z.array(z.object({
        month: z.string(),
        enrollment: z.number(),
    })),
    subjectPerformance: z.array(z.object({
        subject: z.string(),
        averageScore: z.number(),
        passRate: z.number(),
    })),
});

export type AcademicHealthData = z.infer<typeof academicHealthSchema>;