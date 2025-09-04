import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '../../hooks/useForm';
import { getProfile, updateProfile } from '../../api/schoolHubApi';
import { profileFormSchema } from '../../api/schemas/schoolHubSchemas';
import { QUERY_KEYS } from '../../constants/queries';
import { useAppStore } from '../../store/useAppStore';
import { Loader2, User, Lock, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Skeleton from '../../components/ui/Skeleton';

const ProfileManagerSkeleton = () => (
    <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
);


const ProfileManager: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const user = useAppStore(s => s.user);
    const addToast = useAppStore(s => s.addToast);

    const { data: profile, isLoading } = useQuery({
        queryKey: QUERY_KEYS.profile,
        queryFn: () => getProfile(user),
        enabled: !!user,
    });
    
    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            addToast({ message: 'Profile updated successfully!', type: 'success' });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to update profile.', type: 'error' });
        },
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        {
            name: '',
            email: '',
            notificationPreferences: { email: true, push: false },
        },
        profileFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (profile) {
            setValues({
                name: profile.name,
                email: profile.email,
                notificationPreferences: profile.notificationPreferences,
            });
        }
    }, [profile, setValues]);
    
    if (isLoading || !profile) {
        return <ProfileManagerSkeleton />;
    }
    
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-text mb-6">{t('views.profileManager.title')}</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
                    <h2 className="text-lg font-semibold text-brand-text mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-brand-primary" /> {t('views.profileManager.personalInfo')}
                    </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-brand-text-alt">{t('views.profileManager.nameLabel')}</label>
                            <input type="text" name="name" id="name" value={values.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-brand-surface border border-brand-border rounded-md" />
                             {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-brand-text-alt">{t('views.profileManager.emailLabel')}</label>
                            <input type="email" name="email" id="email" value={values.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-brand-surface border border-brand-border rounded-md" />
                             {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>
                     </div>
                </div>

                <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
                    <h2 className="text-lg font-semibold text-brand-text mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-brand-primary" /> {t('views.profileManager.changePassword')}
                    </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="password" placeholder={t('views.profileManager.currentPassword')} className="block w-full px-3 py-2 bg-brand-surface border border-brand-border rounded-md" />
                        <input type="password" placeholder={t('views.profileManager.newPassword')} className="block w-full px-3 py-2 bg-brand-surface border border-brand-border rounded-md" />
                     </div>
                </div>

                <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
                    <h2 className="text-lg font-semibold text-brand-text mb-4 flex items-center gap-2">
                         <Bell className="w-5 h-5 text-brand-primary" /> {t('views.profileManager.notificationPrefs')}
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <label htmlFor="emailNotifications" className="font-medium text-brand-text">{t('views.profileManager.emailNotifications')}</label>
                                <p className="text-sm text-brand-text-alt">{t('views.profileManager.emailDescription')}</p>
                            </div>
                            <input type="checkbox" id="emailNotifications" name="notificationPreferences.email" checked={values.notificationPreferences.email} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                        </div>
                         <div className="flex items-start justify-between">
                            <div>
                                <label htmlFor="pushNotifications" className="font-medium text-brand-text">{t('views.profileManager.pushNotifications')}</label>
                                <p className="text-sm text-brand-text-alt">{t('views.profileManager.pushDescription')}</p>
                            </div>
                            <input type="checkbox" id="pushNotifications" name="notificationPreferences.push" checked={values.notificationPreferences.push} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? t('views.profileManager.savingButton') : t('views.profileManager.saveButton')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileManager;