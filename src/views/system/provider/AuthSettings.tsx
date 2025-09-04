import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@/hooks/useForm';
import { getAuthSettings, saveAuthSettings } from '@/api/appModulesApi';
import { authSettingsSchema, type AuthSettings } from '@/api/schemas/appModulesSchemas';
import { QUERY_KEYS } from '@/constants/queries';
import { useAppStore } from '@/store/useAppStore';
import { Loader2 } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

const ToggleSwitch = ({ name, label, description, checked, onChange }: { name: string; label: string; description: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => (
    <div className="flex items-start justify-between">
        <div>
            <label htmlFor={name} className="font-medium text-brand-text">{label}</label>
            <p className="text-sm text-brand-text-alt">{description}</p>
        </div>
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
                type="checkbox"
                name={name}
                id={name}
                checked={checked}
                onChange={onChange}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label htmlFor={name} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
        </div>
    </div>
);

const AuthSettingsForm: React.FC<{ initialData: AuthSettings }> = ({ initialData }) => {
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);

    const mutation = useMutation({
        mutationFn: saveAuthSettings,
        onSuccess: () => {
            addToast({ message: 'Authentication settings saved!', type: 'success' });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.authSettings });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to save settings.', type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialData,
        authSettingsSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        setValues(initialData);
    }, [initialData, setValues]);
    
    return (
        <form onSubmit={handleSubmit}>
             <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg space-y-6">
                <ToggleSwitch
                    name="enableSso"
                    label="Enable Single Sign-On (SSO)"
                    description="Allow users to log in with third-party providers."
                    checked={values.enableSso}
                    onChange={handleChange}
                />
                {values.enableSso && (
                     <div>
                        <label htmlFor="ssoProvider" className="block text-sm font-medium text-brand-text-alt">SSO Provider</label>
                        <select
                            id="ssoProvider"
                            name="ssoProvider"
                            value={values.ssoProvider}
                            onChange={handleChange}
                            className="mt-1 block w-full max-w-xs pl-3 pr-10 py-2 bg-brand-surface border border-brand-border rounded-md"
                        >
                            <option value="None">None</option>
                            <option value="Google">Google</option>
                            <option value="Microsoft">Microsoft</option>
                            <option value="Okta">Okta</option>
                        </select>
                    </div>
                )}
                 <ToggleSwitch
                    name="enforceMfa"
                    label="Enforce Multi-Factor Authentication (MFA)"
                    description="Require all users to set up a second authentication factor."
                    checked={values.enforceMfa}
                    onChange={handleChange}
                />
                 <div>
                    <label htmlFor="sessionTimeout" className="block text-sm font-medium text-brand-text-alt">Session Timeout (minutes)</label>
                    <input
                        type="number"
                        id="sessionTimeout"
                        name="sessionTimeout"
                        value={values.sessionTimeout}
                        onChange={handleChange}
                        className="mt-1 block w-full max-w-xs px-3 py-2 bg-brand-surface border border-brand-border rounded-md"
                    />
                     {errors.sessionTimeout && <p className="mt-1 text-sm text-red-500">{errors.sessionTimeout}</p>}
                </div>
            </div>
             <div className="mt-6 flex justify-end">
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

const AuthSettings: React.FC = () => {
    const { data, isLoading } = useQuery<AuthSettings>({
        queryKey: QUERY_KEYS.authSettings,
        queryFn: getAuthSettings
    });

    if (isLoading) {
        return (
             <div className="max-w-2xl mx-auto space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-text mb-6">Authentication Settings</h1>
            <style>{`
                .toggle-checkbox:checked { right: 0; border-color: #4f46e5; }
                .toggle-checkbox:checked + .toggle-label { background-color: #4f46e5; }
            `}</style>
            {data && <AuthSettingsForm initialData={data} />}
        </div>
    );
};

export default AuthSettings;