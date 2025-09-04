import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@/hooks/useForm';
import { getBackupConfig, saveBackupConfig } from '@/api/appModulesApi';
import { backupConfigSchema, type BackupConfig } from '@/api/schemas/appModulesSchemas';
import { QUERY_KEYS } from '@/constants/queries';
import { useAppStore } from '@/store/useAppStore';
import { Loader2, RefreshCw } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import SelectField from '@/components/ui/SelectField';
import InputField from '@/components/ui/InputField';

const BackupConfigSkeleton = () => (
    <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
    </div>
);

const BackupConfigView: React.FC = () => {
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);

    const { data: config, isLoading } = useQuery<BackupConfig>({
        queryKey: QUERY_KEYS.backupConfig,
        queryFn: getBackupConfig,
    });

    const mutation = useMutation({
        mutationFn: saveBackupConfig,
        onSuccess: () => {
            addToast({ message: 'Backup configuration saved!', type: 'success' });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.backupConfig });
        },
        onError: (error: Error) => addToast({ message: error.message, type: 'error' })
    });
    
    const { values, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        { frequency: 'daily', retentionDays: 30, nextBackup: '' },
        backupConfigSchema,
        async (vals) => { 
            // FIX: The `vals` parameter is the result of Zod parsing and is correctly typed at runtime.
            // We cast it here to satisfy TypeScript's static analysis, which infers a wider type from the initial state.
            await mutation.mutateAsync(vals as BackupConfig); 
        }
    );
    
    useEffect(() => { if (config) setValues(config); }, [config, setValues]);
    
    if (isLoading) return <BackupConfigSkeleton />;
    
    return (
        <div className="max-w-2xl mx-auto">
             <h1 className="text-2xl font-bold text-brand-text mb-6">Backup Configuration</h1>
            <form onSubmit={handleSubmit} className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg space-y-6">
                <SelectField name="frequency" label="Backup Frequency" value={values.frequency} onChange={handleChange}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </SelectField>
                <InputField name="retentionDays" label="Retention Policy (days)" type="number" value={values.retentionDays} onChange={handleChange} />
                <div className="p-3 bg-brand-surface rounded-md border border-brand-border">
                    <p className="text-sm text-brand-text-alt">Next Scheduled Backup</p>
                    <p className="font-semibold text-brand-text">{new Date(values.nextBackup).toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-brand-border">
                     <button
                        type="button"
                        onClick={() => addToast({message: "Manual backup process started.", type: 'info'})}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-brand-text bg-brand-surface hover:bg-brand-border"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Trigger Manual Backup
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Configuration
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BackupConfigView;