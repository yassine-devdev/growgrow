import React, { useEffect } from 'react';
import { useForm } from '@/hooks/useForm';
import { crmLeadFormSchema, type CrmLeadFormData, type CrmLead } from '@/api/schemas/crmSchemas';
import { saveCrmLead } from '@/api/crmApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { QUERY_KEYS } from '@/constants/queries';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';

interface LeadFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    leadToEdit: CrmLead | null;
}

const initialState: CrmLeadFormData = {
    companyName: '',
    contactName: '',
    status: 'New',
    source: 'Website',
    estimatedValue: 0,
};

const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose, leadToEdit }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const isEditing = !!leadToEdit;

    const mutation = useMutation({
        mutationFn: (leadData: CrmLeadFormData) => {
            const dataToSave = { ...leadData, id: leadToEdit?.id };
            return saveCrmLead(dataToSave);
        },
        onSuccess: () => {
            addToast({ message: `Lead ${isEditing ? 'updated' : 'added'} successfully`, type: 'success' });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.crmLeads] });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || `Failed to ${isEditing ? 'update' : 'add'} lead`, type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        crmLeadFormSchema,
        async (vals) => {
            await mutation.mutateAsync(vals);
        }
    );

    useEffect(() => {
        if (isOpen) {
            if (isEditing && leadToEdit) {
                setValues(leadToEdit);
            } else {
                setValues(initialState);
            }
        }
    }, [leadToEdit, isOpen, setValues, isEditing]);
    
    const title = isEditing ? t('views.crm.leadForm.editTitle') : t('views.crm.leadForm.addTitle');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="companyName" label={t('views.crm.leadForm.companyName')} value={values.companyName} onChange={handleChange} error={errors.companyName} />
                    <InputField name="contactName" label={t('views.crm.leadForm.contactName')} value={values.contactName} onChange={handleChange} error={errors.contactName} />
                    <InputField name="estimatedValue" type="number" label={t('views.crm.leadForm.estimatedValue')} value={values.estimatedValue} onChange={handleChange} error={errors.estimatedValue} />
                    <SelectField name="status" label={t('views.crm.leadForm.status')} value={values.status} onChange={handleChange} error={errors.status}>
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Qualified</option>
                        <option>Disqualified</option>
                    </SelectField>
                    <SelectField name="source" label={t('views.crm.leadForm.source')} value={values.source} onChange={handleChange} error={errors.source}>
                        <option>Website</option>
                        <option>Referral</option>
                        <option>Cold Call</option>
                        <option>Event</option>
                    </SelectField>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('views.crm.leadForm.save')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default LeadFormModal;