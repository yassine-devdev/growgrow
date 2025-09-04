

import React, { useEffect } from 'react';
import { useForm } from '@/hooks/useForm';
import { campaignFormSchema, type CampaignFormData } from '@/api/schemas/appModulesSchemas';
import { addCampaign } from '@/api/appModulesApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import { useTranslation } from 'react-i18next';

interface CampaignFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialState: CampaignFormData = { name: '', channel: 'Email', status: 'Active', spend: 0 };

const CampaignFormModal: React.FC<CampaignFormModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    
    const mutation = useMutation({
        mutationFn: addCampaign,
        onSuccess: () => {
            addToast({ message: 'Campaign added successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['marketingCampaigns'] });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to add campaign', type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        campaignFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (isOpen) {
            setValues(initialState);
        }
    }, [isOpen, setValues]);
    

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('views.marketingTools.campaignForm.addTitle')}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="name" label={t('views.marketingTools.campaignForm.nameLabel')} value={values.name} onChange={handleChange} error={errors.name} />
                    <SelectField name="channel" label={t('views.marketingTools.campaignForm.channelLabel')} value={values.channel} onChange={handleChange} error={errors.channel}>
                        <option value="Email">Email</option>
                        <option value="Social">Social</option>
                        <option value="Web">Web</option>
                    </SelectField>
                    <InputField name="spend" label={t('views.marketingTools.campaignForm.spendLabel')} type="number" value={values.spend} onChange={handleChange} error={errors.spend} />
                     <SelectField name="status" label={t('views.marketingTools.campaignForm.statusLabel')} value={values.status} onChange={handleChange} error={errors.status}>
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Completed">Completed</option>
                    </SelectField>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('views.marketingTools.campaignForm.addButton')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CampaignFormModal;