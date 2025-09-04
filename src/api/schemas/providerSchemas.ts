import { z } from 'zod';
import { statSchema } from './commonSchemas';

export const schoolHealthSchema = z.object({
    id: z.string(),
    name: z.string(),
    healthScore: z.number().min(0).max(100),
    keyStats: z.array(z.object({
        label: z.string(),
        value: z.string(),
    })),
});

export const commandCenterSchema = z.object({
    overallStats: z.array(statSchema),
    schools: z.array(schoolHealthSchema),
});

export const providerSchoolDetailSchema = z.object({
    id: z.string(),
    name: z.string(),
    stats: z.array(statSchema),
    healthHistory: z.array(z.object({
        date: z.string(),
        score: z.number(),
    })),
});

export const providerProfileSchema = z.object({
    companyName: z.string(),
    contactEmail: z.string().email(),
    website: z.string().url().optional().or(z.literal('')),
});
export type ProviderProfile = z.infer<typeof providerProfileSchema>;

export const providerProfileFormSchema = z.object({
    companyName: z.string().min(3, "Company name is required."),
    contactEmail: z.string().email("A valid contact email is required."),
    website: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});
export type ProviderProfileFormData = z.infer<typeof providerProfileFormSchema>;


export type ProviderSchoolDetailData = z.infer<typeof providerSchoolDetailSchema>;
export type CommandCenterData = z.infer<typeof commandCenterSchema>;
export type SchoolHealth = z.infer<typeof schoolHealthSchema];