import { z } from 'zod';

/**
 * Zod schema for validating the "New School" form data.
 * It includes nested objects for school information and administrator account details.
 */
export const newSchoolFormSchema = z.object({
    schoolInfo: z.object({
        schoolName: z.string().min(3, 'School name must be at least 3 characters long.'),
        schoolDomain: z.string().refine(val => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val), {
            message: "Domain must be lowercase alphanumeric with hyphens, e.g., 'northwood-high'",
        }),
        schoolType: z.enum(['k-12', 'university', 'vocational', 'other']),
    }),
    adminInfo: z.object({
        firstName: z.string().min(2, 'First name is required.'),
        lastName: z.string().min(2, 'Last name is required.'),
        email: z.string().email('Invalid email address.'),
        password: z.string().min(8, 'Password must be at least 8 characters long.'),
    })
});

/**
 * Zod schema for validating the onboarding configuration settings.
 */
export const onboardingConfigSchema = z.object({
    autoAssignAdminRole: z.boolean(),
    sendWelcomeEmail: z.boolean(),
    defaultSubscriptionPlan: z.enum(['basic', 'pro', 'enterprise']),
    enableSSOByDefault: z.boolean(),
});
export type OnboardingConfigData = z.infer<typeof onboardingConfigSchema>;

/**
 * Zod schema for a single section within the onboarding documentation.
 */
export const onboardingDocSectionSchema = z.object({
    title: z.string(),
    content: z.string().optional(),
    code: z.string().optional(),
    checklist: z.array(z.string()).optional(),
});

/**
 * Zod schema for the entire onboarding documentation object.
 */
export const onboardingDocsSchema = z.object({
    title: z.string(),
    sections: z.array(onboardingDocSectionSchema),
});
export type OnboardingDocsData = z.infer<typeof onboardingDocsSchema>;