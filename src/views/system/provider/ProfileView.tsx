import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@/hooks/useForm';
import { getProviderProfile, updateProviderProfile } from '@/api/providerApi';
import { providerProfileFormSchema } from '@/api/schemas/commonSchemas';
import { QUERY_KEYS } from '@/constants/queries';
import { useAppStore } from '@/store/useAppStore';
import { Loader2, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Skeleton from '@/components/ui/Skeleton';
import InputField from '@/components/ui/InputField';

const ProfileSkeleton = () => (
    <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
);

const ProfileView: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);

    const { data: profile, isLoading } = useQuery({
        queryKey: QUERY_KEYS.providerProfile,
        queryFn: getProviderProfile,
    });

    const mutation = useMutation({
        mutationFn: updateProviderProfile,
        onSuccess: () => {
            addToast({ message: 'Profile updated successfully!', type: 'success' });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.providerProfile });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to update profile.', type: 'error' });
        },
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        { companyName: '', contactEmail: '', website: '' },
        providerProfileFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (profile) {
            setValues(profile);
        }
    }, [profile, setValues]);
    
    if (isLoading || !profile) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-text mb-6">{t('views.providerProfile.title')}</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
                    <h2 className="text-lg font-semibold text-brand-text mb-4 flex items-center gap-2">
                        <Building className="w-5 h-5 text-brand-primary" /> {t('views.providerProfile.companyInfo')}
                    </h2>
                     <div className="space-y-4">
                        <InputField name="companyName" label={t('views.providerProfile.companyNameLabel')} value={values.companyName} onChange={handleChange} error={errors.companyName} />
                        <InputField name="contactEmail" type="email" label={t('views.providerProfile.contactEmailLabel')} value={values.contactEmail} onChange={handleChange} error={errors.contactEmail} />
                        <InputField name="website" label={t('views.providerProfile.websiteLabel')} value={values.website || ''} onChange={handleChange} error={errors.website} placeholder="https://example.com" />
                     </div>
                </div>

                 <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? t('views.providerProfile.savingButton') : t('views.providerProfile.saveButton')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileView;