import { Role } from '@/types/index.ts';
import type { Stat } from '@/api/schemas/commonSchemas';
import { apiClient } from './apiClient';
import { statSchema } from './schemas/commonSchemas';
import { z } from 'zod';

const schoolPerformanceSchema = z.array(z.object({
    name: z.string(),
    attendance: z.number(),
    performance: z.number(),
}));
export type SchoolPerformanceData = z.infer<typeof schoolPerformanceSchema>;

/**
 * Fetches a set of key statistics relevant to the specified user role from the backend.
 *
 * @param {Role | null} role - The role of the user for whom to fetch stats.
 * @returns {Promise<Stat[]>} A promise that resolves to an array of stat objects for the given role.
 */
export const getSchoolStats = async (role: Role | null): Promise<Stat[]> => {
    if (!role) return [];
    const data = await apiClient<Stat[]>(`/school/stats?role=${role}`);
    return statSchema.array().parse(data);
};

/**
 * Fetches performance and attendance data for the school dashboard chart.
 * @returns {Promise<SchoolPerformanceData>} A promise that resolves to chart data.
 */
export const getSchoolPerformanceData = async (): Promise<SchoolPerformanceData> => {
    const data = await apiClient<SchoolPerformanceData>('/school/performance');
    return schoolPerformanceSchema.parse(data);
};