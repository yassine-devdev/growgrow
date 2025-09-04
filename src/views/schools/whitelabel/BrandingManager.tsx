
import React, { useState } from 'react';
import { useForm } from '@/hooks/useForm';
import { brandingSettingsSchema, type BrandingSettings } from '@/api/schemas/schoolManagementSchemas';
import { getBrandingSettings, saveBrandingSettings } from '@/api/schoolManagementApi';
import { Loader2, CheckCircle, AlertTriangle, UploadCloud } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const BrandingForm: React.FC<{ initialData: BrandingSettings }> = ({ initialData }) => {
    const queryClient = useQueryClient();
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const mutation = useMutation({
        mutationFn: saveBrandingSettings,
        onSuccess: (data) => {
            setSubmitStatus({ type: 'success', message: data.message });
            queryClient.invalidateQueries({ queryKey: ['brandingSettings'] });
        },
        onError: (error: unknown) => {
            setSubmitStatus({ type: 'error', message: error instanceof Error ? error.message : 'Failed to save settings.' });
        }
    });

    const handleFormSubmit = async (values: BrandingSettings) => {
        setSubmitStatus(null);
        await mutation.mutateAsync(values);
    };

    const { values, isSubmitting, handleChange, handleSubmit } = useForm(
        initialData,
        brandingSettingsSchema,
        handleFormSubmit
    );
    
    return (
        <form onSubmit={handleSubmit} className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg space-y-6">
            <div>
                <label className="block text-sm font-medium text-brand-text-alt">Logo</label>
                <div className="mt-1 flex items-center gap-4">
                    <span className="h-16 w-16 rounded-full bg-brand-surface overflow-hidden flex items-center justify-center">
                        {values.logoUrl ? <img src={values.logoUrl} alt="Logo Preview" className="h-full w-full object-contain" /> : <UploadCloud className="w-8 h-8 text-brand-text-alt" />}
                    </span>
                    <button type="button" className="px-3 py-2 bg-brand-surface border border-brand-border text-sm font-semibold rounded-md hover:bg-brand-surface-alt">
                        Upload Logo
                    </button>
                </div>
            </div>
            
            <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-brand-text-alt">Primary Color</label>
                <div className="mt-1 flex items-center gap-2">
                    <input
                        type="color"
                        id="primaryColor"
                        name="primaryColor"
                        value={values.primaryColor}
                        onChange={handleChange}
                        className="w-10 h-10 p-1 border-none rounded-md"
                    />
                     <input
                        type="text"
                        value={values.primaryColor}
                        onChange={handleChange}
                        name="primaryColor"
                        className="w-full max-w-xs px-3 py-2 bg-brand-surface border border-brand-border rounded-md"
                    />
                </div>
            </div>

            <div className="pt-5 border-t border-brand-border">
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
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Branding
                    </button>
                </div>
            </div>
        </form>
    );
};


const BrandingManager: React.FC = () => {
    const { t } = useTranslation();
    const { data: brandingSettings, isLoading } = useQuery({
        queryKey: ['brandingSettings'],
        queryFn: getBrandingSettings
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-text mb-6">{t('views.brandingManager.title')}</h1>
            {brandingSettings && <BrandingForm initialData={brandingSettings} />}
        </div>
    );
};

export default BrandingManager;
