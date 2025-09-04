
import React, { useEffect } from 'react';
import { useForm } from '../../../hooks/useForm';
import { parentFormSchema, type ParentFormData, type SchoolUser } from '../../../api/schemas/schoolManagementSchemas';
import { addParent, updateParent } from '../../../api/schoolManagementApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Modal from '../../../components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';

interface ParentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    parentToEdit: SchoolUser | null;
}

const initialState: ParentFormData = { name: '', email: '', school: '', children: '', status: 'Active' };

const ParentFormModal: React.FC<ParentFormModalProps> = ({ isOpen, onClose, parentToEdit }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const isEditing = !!parentToEdit;

    const mutation = useMutation({
        mutationFn: (formData: ParentFormData) => {
            return isEditing ? updateParent(parentToEdit!.id, formData) : addParent(formData);
        },
        onSuccess: () => {
            addToast({ message: `Parent ${isEditing ? 'updated' : 'added'} successfully`, type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['parents'] });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to save parent', type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        parentFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (isOpen) {
            if (isEditing && parentToEdit) {
                setValues({
                    name: parentToEdit.name,
                    email: parentToEdit.email,
                    school: parentToEdit.school,
                    children: parentToEdit.children?.join(', ') || '',
                    status: parentToEdit.status,
                });
            } else {
                setValues(initialState);
            }
        }
    }, [parentToEdit, isOpen, setValues, isEditing]);
    
    const title = isEditing ? t('views.parentFormModal.editTitle') : t('views.parentFormModal.addTitle');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="name" label={t('views.parentFormModal.nameLabel')} value={values.name} onChange={handleChange} error={errors.name} />
                    <InputField name="email" type="email" label={t('views.parentFormModal.emailLabel')} value={values.email} onChange={handleChange} error={errors.email} />
                    <InputField name="school" label={t('views.parentFormModal.schoolLabel')} value={values.school} onChange={handleChange} error={errors.school} />
                    <InputField name="children" label={t('views.parentFormModal.childrenLabel')} value={values.children} onChange={handleChange} error={errors.children} />
                    <SelectField name="status" label={t('views.parentFormModal.statusLabel')} value={values.status} onChange={handleChange} error={errors.status}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </SelectField>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? t('views.parentFormModal.saveButton') : t('views.parentFormModal.addButton')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ParentFormModal;
