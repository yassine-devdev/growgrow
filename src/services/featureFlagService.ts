import { User, FeatureFlags } from '../types/index.ts';

// This is a mock feature flag definition. In a real application,
// this would be fetched from a service like LaunchDarkly, Optimizely, etc.
const ALL_FLAGS: FeatureFlags = {
    'conciergeAiAssistant': {
        key: 'conciergeAiAssistant',
        value: false, // Default value
        description: 'Enables the new AI Assistant tool in the Concierge view.',
    },
    'newSchoolButtonTest': {
        key: 'newSchoolButtonTest',
        value: 'control', // Default variation
        description: 'A/B test for the "Create School" button styling and text.',
    },
};

/**
 * Simulates fetching feature flags for a given user.
 * This function can contain targeting logic based on the user's role or other attributes.
 * @param user The current user object.
 * @returns A promise that resolves to a map of feature flags for the user.
 */
export const getFeatureFlags = async (user: User | null): Promise<FeatureFlags> => {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 50));

    if (!user) {
        return {};
    }

    const flagsForUser = { ...ALL_FLAGS };
    const userRole = user.role;

    // --- Targeting Logic ---

    // Enable 'conciergeAiAssistant' only for Providers and Admins
    if (userRole === 'Provider' || userRole === 'Admin') {
        flagsForUser['conciergeAiAssistant'] = { ...flagsForUser['conciergeAiAssistant'], value: true };
    }
    
    // A/B Test Logic: Split users into two groups for the button test.
    // Here, we'll just assign based on role for deterministic simulation.
    if (['Provider', 'Teacher', 'Parent'].includes(userRole)) {
         flagsForUser['newSchoolButtonTest'] = { ...flagsForUser['newSchoolButtonTest'], value: 'treatment' };
    } else {
         flagsForUser['newSchoolButtonTest'] = { ...flagsForUser['newSchoolButtonTest'], value: 'control' };
    }


    return flagsForUser;
};