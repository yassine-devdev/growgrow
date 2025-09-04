
import React, { useEffect } from 'react';
import { useForm } from '@/hooks/useForm';
import { announcementFormSchema, type AnnouncementFormData, type Announcement } from '@/api/schemas/schoolHubSchemas';
import { addAnnouncement, updateAnnouncement } from '@/api/schoolHubApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import InputField from '@/components/ui/InputField';

interface AnnouncementFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    announcementToEdit: Announcement | null;
}

const initialState: AnnouncementFormData = { title: '', content: '' };

const AnnouncementFormModal: React.FC<AnnouncementFormModalProps> = ({ isOpen, onClose, announcementToEdit }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const isEditing = !!announcementToEdit;

    const mutation = useMutation({
        mutationFn: (formData: AnnouncementFormData) => {
            return isEditing ? updateAnnouncement(announcementToEdit!.id, formData) : addAnnouncement(formData);
        },
        onSuccess: () => {
            addToast({ message: `Announcement ${isEditing ? 'updated' : 'posted'} successfully`, type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to save announcement', type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        announcementFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (isOpen) {
            if (isEditing && announcementToEdit) {
                setValues({
                    title: announcementToEdit.title,
                    content: announcementToEdit.content,
                });
            } else {
                setValues(initialState);
            }
        }
    }, [announcementToEdit, isOpen, setValues, isEditing]);

    const title = isEditing ? t('views.announcementForm.editTitle') : t('views.announcementForm.addTitle');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="title" label={t('views.announcementForm.titleLabel')} value={values.title} onChange={handleChange} error={errors.title} />
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-brand-text-alt">{t('views.announcementForm.contentLabel')}</label>
                        <textarea
                            id="content"
                            name="content"
                            value={values.content}
                            onChange={handleChange}
                            rows={6}
                            className={`mt-1 block w-full px-3 py-2 bg-brand-surface border ${errors.content ? 'border-red-500' : 'border-brand-border'} rounded-md`}
                        />
                        {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? t('views.announcementForm.saveButton') : t('views.announcementForm.addButton')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AnnouncementFormModal;
