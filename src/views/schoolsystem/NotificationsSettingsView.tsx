import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@/hooks/useForm';
import { getNotificationSettings, updateNotificationSettings } from '@/api/schoolHubApi';
import { notificationSettingsSchema, type NotificationSettings } from '@/api/schemas/schoolHubSchemas';
import { useAppStore } from '@/store/useAppStore';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import Skeleton from '@/components/ui/Skeleton';

const NotificationsSettingsSkeleton = () => (
    <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg space-y-4">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
        <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg space-y-4">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-12 w-full" />
        </div>
    </div>
);

const NotificationsSettingsView: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);

    const { data: settings, isLoading } = useQuery({
        queryKey: ['notificationSettings'],
        queryFn: getNotificationSettings,
    });
    
    const mutation = useMutation({
        mutationFn: updateNotificationSettings,
        onSuccess: () => {
            addToast({ message: 'Notification settings saved!', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to save settings.', type: 'error' });
        },
    });

    const { values, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        {
            grades: { email: false, push: false },
            assignments: { email: false, push: false },
            announcements: { email: false, push: false },
        },
        notificationSettingsSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (settings) {
            setValues(settings);
        }
    }, [settings, setValues]);
    
    if (isLoading || !settings) {
        return <NotificationsSettingsSkeleton />;
    }
    
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-text mb-6">{t('nav.subnav.notifications')}</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
                    <h2 className="text-lg font-semibold text-brand-text mb-4">{t('views.profileManager.academicNotifications')}</h2>
                    <div className="space-y-4">
                        <ToggleSwitch
                            name="grades.email"
                            label={t('views.profileManager.gradeUpdates')}
                            description={t('views.profileManager.emailDescription')}
                            checked={values.grades.email}
                            onChange={handleChange}
                        />
                         <ToggleSwitch
                            name="assignments.email"
                            label={t('views.profileManager.assignmentAlerts')}
                            description={t('views.profileManager.emailDescription')}
                            checked={values.assignments.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
                    <h2 className="text-lg font-semibold text-brand-text mb-4">{t('views.profileManager.generalNotifications')}</h2>
                    <div className="space-y-4">
                         <ToggleSwitch
                            name="announcements.email"
                            label={t('views.profileManager.schoolAnnouncements')}
                            description={t('views.profileManager.emailDescription')}
                            checked={values.announcements.email}
                            onChange={handleChange}
                        />
                        <ToggleSwitch
                            name="announcements.push"
                            label={t('views.profileManager.schoolAnnouncements')}
                            description={t('views.profileManager.pushDescription')}
                            checked={values.announcements.push}
                            onChange={handleChange}
                        />
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

export default NotificationsSettingsView;