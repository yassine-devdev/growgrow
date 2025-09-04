import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@/hooks/useForm';
import { getMultiTenancySettings, saveMultiTenancySettings } from '@/api/appModulesApi';
import { multiTenancySettingsSchema, type MultiTenancySettings } from '@/api/schemas/appModulesSchemas';
import { QUERY_KEYS } from '@/constants/queries';
import { useAppStore } from '@/store/useAppStore';
import { Loader2 } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import InputField from '@/components/ui/InputField';
import { Routes, Route, Navigate } from 'react-router-dom';
import EmptyState from '@/views/EmptyState';

const SettingsSkeleton = () => (
    <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
    </div>
);

const SettingsForm: React.FC<{ initialData: MultiTenancySettings }> = ({ initialData }) => {
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);

    const mutation = useMutation({
        mutationFn: saveMultiTenancySettings,
        onSuccess: () => {
            addToast({ message: 'Settings saved!', type: 'success' });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.multiTenancySettings });
        },
        onError: (error: Error) => addToast({ message: error.message, type: 'error' })
    });

    const { values, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialData,
        multiTenancySettingsSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );
    
    useEffect(() => { setValues(initialData); }, [initialData, setValues]);
    
    return (
        <form onSubmit={handleSubmit} className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg space-y-6">
            <ToggleSwitch
                name="allowSelfSignup"
                label="Allow Tenant Self-Signup"
                description="Allow new schools to sign up for the platform without manual approval."
                checked={values.allowSelfSignup}
                onChange={handleChange}
            />
            <ToggleSwitch
                name="enableQuotas"
                label="Enable Resource Quotas"
                description="Enforce default resource limits for new tenants."
                checked={values.enableQuotas}
                onChange={handleChange}
            />
            {values.enableQuotas && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-brand-border">
                    <InputField name="defaultUserLimit" label="Default User Limit" type="number" value={values.defaultUserLimit} onChange={handleChange} />
                    <InputField name="defaultStorageLimitGb" label="Default Storage Limit (GB)" type="number" value={values.defaultStorageLimitGb} onChange={handleChange} />
                </div>
            )}
            <div className="flex justify-end pt-4 border-t border-brand-border">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                </button>
            </div>
        </form>
    );
};

const TenantSettings: React.FC = () => {
    const { data, isLoading } = useQuery<MultiTenancySettings>({
        queryKey: QUERY_KEYS.multiTenancySettings,
        queryFn: getMultiTenancySettings,
    });

    if (isLoading) return <SettingsSkeleton />;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-text mb-6">Multi-Tenancy Settings</h1>
            {data && <SettingsForm initialData={data} />}
        </div>
    );
};

const MultiTenancyView: React.FC = () => {
    return (
        <Routes>
            <Route index element={<Navigate to="tenant-settings" replace />} />
            <Route path="tenant-settings" element={<TenantSettings />} />
            <Route path="resource-quotas" element={<EmptyState message="Detailed resource quota management per tenant is coming soon." />} />
            <Route path="tenant-dashboards" element={<EmptyState message="A view for creating and assigning tenant-specific dashboards is coming soon." />} />
            <Route path="tenant-templates" element={<EmptyState message="Management of tenant onboarding templates will be available here." />} />
        </Routes>
    )
};


export default MultiTenancyView;
