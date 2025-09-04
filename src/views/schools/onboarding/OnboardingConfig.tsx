import React, { useState } from 'react';
import { useForm } from '@/hooks/useForm';
import { onboardingConfigSchema, type OnboardingConfigData } from '@/api/schemas/schoolOnboardingSchemas';
import { getOnboardingConfig, saveOnboardingConfig } from '@/api/schoolOnboardingApi';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

/**
 * The core form component for managing onboarding configurations.
 * It is initialized with data fetched from the API.
 * @param {object} props - Component props.
 * @param {OnboardingConfigData} props.initialData - The initial data to populate the form with.
 * @returns {JSX.Element} The rendered configuration form.
 */
const OnboardingConfigForm: React.FC<{ initialData: OnboardingConfigData }> = ({ initialData }) => {
    const queryClient = useQueryClient();
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const mutation = useMutation({
        mutationFn: saveOnboardingConfig,
        onSuccess: (data) => {
            setSubmitStatus({ type: 'success', message: data.message });
            queryClient.invalidateQueries({ queryKey: ['onboardingConfig'] });
        },
        onError: (error: Error) => {
            setSubmitStatus({ type: 'error', message: error.message || 'Failed to save configuration.' });
        }
    });

    /**
     * Handles the form submission logic.
     * @param {object} values - The validated form values.
     */
    const handleFormSubmit = async (values: OnboardingConfigData) => {
        setSubmitStatus(null);
        await mutation.mutateAsync(values);
    };

    const { values, isSubmitting, handleChange, handleSubmit } = useForm(
        initialData,
        onboardingConfigSchema,
        handleFormSubmit
    );

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
            <div className="space-y-6">
                <ToggleSwitch
                    name="autoAssignAdminRole"
                    label="Auto-assign Admin Role"
                    description="Automatically assign the 'Admin' role to the creator account."
                    checked={values.autoAssignAdminRole}
                    onChange={handleChange}
                />
                 <ToggleSwitch
                    name="sendWelcomeEmail"
                    label="Send Welcome Email"
                    description="Send a welcome email to the new administrator upon creation."
                    checked={values.sendWelcomeEmail}
                    onChange={handleChange}
                />
                <ToggleSwitch
                    name="enableSSOByDefault"
                    label="Enable SSO by Default"
                    description="New schools will have Single Sign-On enabled by default."
                    checked={values.enableSSOByDefault}
                    onChange={handleChange}
                />
                <div>
                    <label htmlFor="defaultSubscriptionPlan" className="block text-sm font-medium text-brand-text">Default Subscription Plan</label>
                    <select
                        id="defaultSubscriptionPlan"
                        name="defaultSubscriptionPlan"
                        value={values.defaultSubscriptionPlan}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-brand-surface border border-brand-border focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
                    >
                        <option value="basic">Basic</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                </div>
            </div>
             <div className="mt-8 pt-5 border-t border-brand-border">
                <div className="flex justify-end items-center gap-4">
                     {submitStatus && (
                        <div className={`flex items-center gap-2 text-sm ${submitStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {submitStatus.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertTriangle className="w-5 h-5"/>}
                            {submitStatus.message}
                        </div>
                     )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-brand-text-alt"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
    );
};

/**
 * The main component for the Onboarding Configuration page.
 * It fetches the current configuration and renders the form to edit it.
 *
 * @returns {JSX.Element} The rendered onboarding configuration page.
 */
const OnboardingConfig: React.FC = () => {
    const { data: config, isLoading } = useQuery<OnboardingConfigData>({ 
        queryKey: ['onboardingConfig'], 
        queryFn: getOnboardingConfig 
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-text mb-6">Onboarding Configuration</h1>
            {config && <OnboardingConfigForm initialData={config} />}
        </div>
    );
};

export default OnboardingConfig;