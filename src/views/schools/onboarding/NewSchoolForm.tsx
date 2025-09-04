import React, { useState } from 'react';
import { useForm } from '@/hooks/useForm';
import { newSchoolFormSchema } from '@/api/schemas/schoolOnboardingSchemas';
import { submitNewSchoolForm } from '@/api/schoolOnboardingApi';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useFeatureFlag } from '@/context/FeatureFlagContext';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';

/**
 * Renders the form for onboarding a new school tenant.
 * It uses the generic `useForm` hook for state management and validation.
 * It also demonstrates an A/B test on the submit button using a feature flag.
 *
 * @returns {JSX.Element} The rendered new school form.
 */
const NewSchoolForm: React.FC = () => {
    const { t } = useTranslation();
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const { getVariant } = useFeatureFlag('newSchoolButtonTest');
    const buttonVariant = getVariant();
    
    const mutation = useMutation({
        mutationFn: submitNewSchoolForm,
        onSuccess: (data) => {
            setSubmitStatus({ type: 'success', message: data.message });
        },
        onError: (error: Error) => {
            setSubmitStatus({ type: 'error', message: error.message || 'An unknown error occurred.' });
        }
    });
    
    const initialState = {
        schoolInfo: { schoolName: '', schoolDomain: '', schoolType: 'k-12' },
        adminInfo: { firstName: '', lastName: '', email: '', password: '' },
    };

    /**
     * Handles the form submission logic after successful validation.
     * @param {object} values - The validated form values.
     */
    const handleFormSubmit = async (values) => {
        setSubmitStatus(null);
        await mutation.mutateAsync(values);
    };
    
    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(initialState, newSchoolFormSchema, handleFormSubmit);

    /**
     * Returns the appropriate CSS classes for the submit button based on the A/B test variant.
     * @returns {string} Tailwind CSS classes.
     */
    const getButtonStyles = () => {
        if (buttonVariant === 'treatment') {
            return 'bg-brand-accent hover:bg-green-500 focus:ring-brand-accent';
        }
        return 'bg-brand-primary hover:bg-brand-primary-hover focus:ring-brand-primary'; // Control
    };
    
    /**
     * Returns the appropriate text for the submit button based on submission state and A/B test variant.
     * @returns {string} The button text.
     */
    const getButtonText = () => {
         if (isSubmitting) return t('views.newSchoolForm.submittingButton');
         if (buttonVariant === 'treatment') {
             return t('views.newSchoolForm.submitButtonTreatment');
         }
         return t('views.newSchoolForm.submitButton');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-text mb-6">{t('views.newSchoolForm.title')}</h1>

            {submitStatus && (
                <div className={`p-4 mb-6 rounded-md flex items-start gap-3 ${submitStatus.type === 'success' ? 'bg-green-500/10 text-green-800' : 'bg-red-500/10 text-red-800'}`}>
                    {submitStatus.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <AlertTriangle className="w-5 h-5 mt-0.5" />}
                    <div>
                        <h3 className="font-semibold">{submitStatus.type === 'success' ? 'Success!' : 'Error'}</h3>
                        <p className="text-sm">{submitStatus.message}</p>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-8">
                    {/* School Information Section */}
                    <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
                        <h2 className="text-lg font-semibold text-brand-text mb-4">{t('views.newSchoolForm.schoolInfo')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField name="schoolInfo.schoolName" label="School Name" value={values.schoolInfo.schoolName} onChange={handleChange} error={errors['schoolInfo.schoolName']} placeholder="e.g., Northwood High School" />
                            <InputField name="schoolInfo.schoolDomain" label="School Domain" value={values.schoolInfo.schoolDomain} onChange={handleChange} error={errors['schoolInfo.schoolDomain']} placeholder="e.g., northwood-high" />
                            <SelectField name="schoolInfo.schoolType" label="School Type" value={values.schoolInfo.schoolType} onChange={handleChange} error={errors['schoolInfo.schoolType']}>
                                <option value="k-12">K-12</option>
                                <option value="university">University</option>
                                <option value="vocational">Vocational</option>
                                <option value="other">Other</option>
                            </SelectField>
                        </div>
                    </div>

                    {/* Administrator Account Section */}
                    <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
                        <h2 className="text-lg font-semibold text-brand-text mb-4">{t('views.newSchoolForm.adminInfo')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField name="adminInfo.firstName" label="First Name" value={values.adminInfo.firstName} onChange={handleChange} error={errors['adminInfo.firstName']} />
                            <InputField name="adminInfo.lastName" label="Last Name" value={values.adminInfo.lastName} onChange={handleChange} error={errors['adminInfo.lastName']} />
                            <InputField name="adminInfo.email" label="Email Address" type="email" value={values.adminInfo.email} onChange={handleChange} error={errors['adminInfo.email']} />
                            <InputField name="adminInfo.password" label="Password" type="password" value={values.adminInfo.password} onChange={handleChange} error={errors['adminInfo.password']} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-brand-text-alt disabled:cursor-not-allowed ${getButtonStyles()}`}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {getButtonText()}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewSchoolForm;