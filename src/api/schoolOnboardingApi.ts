
import { z } from 'zod';
import { newSchoolFormSchema, onboardingConfigSchema, onboardingDocsSchema, type OnboardingDocsData } from '@/api/schemas/schoolOnboardingSchemas';
import { apiClient } from './apiClient';

type NewSchoolFormData = z.infer<typeof newSchoolFormSchema>;
type OnboardingConfigData = z.infer<typeof onboardingConfigSchema>;

// --- API FUNCTIONS ---

/**
 * Submits the new school creation form to the backend.
 * @param {NewSchoolFormData} data - The validated form data.
 * @returns {Promise<{success: true; message: string}>} A promise that resolves with a success message.
 */
export const submitNewSchoolForm = (data: NewSchoolFormData): Promise<{ success: true; message: string }> => {
    return apiClient('/onboarding/new-school', { method: 'POST', body: JSON.stringify(data) });
};


/**
 * Fetches the onboarding documentation content from the backend.
 * @returns {Promise<OnboardingDocsData>} A promise that resolves with the documentation object.
 */
export const getOnboardingDocs = async (): Promise<OnboardingDocsData> => {
    const data = await apiClient<OnboardingDocsData>('/onboarding/docs');
    return onboardingDocsSchema.parse(data);
};

/**
 * Fetches the current onboarding configuration settings from the backend.
 * @returns {Promise<OnboardingConfigData>} A promise that resolves with the current config object.
 */
export const getOnboardingConfig = async (): Promise<OnboardingConfigData> => {
    const data = await apiClient<OnboardingConfigData>('/onboarding/config');
    return onboardingConfigSchema.parse(data);
};

/**
 * Saves the updated onboarding configuration to the backend.
 * @param {OnboardingConfigData} data - The validated configuration data.
 * @returns {Promise<{success: true; message: string}>} A promise that resolves with a success message.
 */
export const saveOnboardingConfig = (data: OnboardingConfigData): Promise<{ success: true; message: string }> => {
    return apiClient('/onboarding/config', { method: 'POST', body: JSON.stringify(data) });
};
