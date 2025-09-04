
import React, { useEffect } from 'react';
import { useForm } from '@/hooks/useForm';
import { emailTemplateFormSchema, type EmailTemplateFormData, type EmailTemplate } from '@/api/schemas/appModulesSchemas';
import { addEmailTemplate, updateEmailTemplate } from '@/api/appModulesApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import InputField from '@/components/ui/InputField';

interface EmailTemplateFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateToEdit: EmailTemplate | null;
}

const initialState: EmailTemplateFormData = { name: '', subject: '', body: '' };

const EmailTemplateFormModal: React.FC<EmailTemplateFormModalProps> = ({ isOpen, onClose, templateToEdit }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const isEditing = !!templateToEdit;

    const mutation = useMutation({
        mutationFn: (formData: EmailTemplateFormData) => {
            return isEditing ? updateEmailTemplate(templateToEdit!.id, formData) : addEmailTemplate(formData);
        },
        onSuccess: () => {
            addToast({ message: `Template ${isEditing ? 'updated' : 'added'} successfully`, type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to save template', type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        emailTemplateFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (isOpen) {
            if (isEditing && templateToEdit) {
                setValues(templateToEdit);
            } else {
                setValues(initialState);
            }
        }
    }, [templateToEdit, isOpen, setValues, isEditing]);

    const title = isEditing ? t('views.emailTemplateForm.editTitle') : t('views.emailTemplateForm.addTitle');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="name" label={t('views.emailTemplateForm.nameLabel')} value={values.name} onChange={handleChange} error={errors.name} />
                    <InputField name="subject" label={t('views.emailTemplateForm.subjectLabel')} value={values.subject} onChange={handleChange} error={errors.subject} />
                    <div>
                        <label htmlFor="body" className="block text-sm font-medium text-brand-text-alt">{t('views.emailTemplateForm.bodyLabel')}</label>
                        <textarea
                            id="body"
                            name="body"
                            value={values.body}
                            onChange={handleChange}
                            rows={6}
                            className={`mt-1 block w-full px-3 py-2 bg-brand-surface border ${errors.body ? 'border-red-500' : 'border-brand-border'} rounded-md`}
                        />
                        {errors.body && <p className="mt-1 text-sm text-red-500">{errors.body}</p>}
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? t('views.emailTemplateForm.saveButton') : t('views.emailTemplateForm.addButton')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EmailTemplateFormModal;
