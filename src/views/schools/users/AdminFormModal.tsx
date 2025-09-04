
import React, { useEffect } from 'react';
import { useForm } from '../../../hooks/useForm';
import { adminFormSchema, type AdminFormData, type Admin } from '../../../api/schemas/schoolManagementSchemas';
import { addAdmin, updateAdmin } from '../../../api/schoolManagementApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Modal from '../../../components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';

interface AdminFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    adminToEdit: Admin | null;
}

const initialState: AdminFormData = {
    name: '',
    email: '',
    school: '',
    status: 'Active',
};

const AdminFormModal: React.FC<AdminFormModalProps> = ({ isOpen, onClose, adminToEdit }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const isEditing = !!adminToEdit;

    const mutation = useMutation({
        mutationFn: (adminData: AdminFormData) => {
            if (isEditing && adminToEdit) {
                return updateAdmin(adminToEdit.id, adminData);
            }
            return addAdmin(adminData);
        },
        onSuccess: () => {
            addToast({ message: `Admin ${isEditing ? 'updated' : 'added'} successfully`, type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['admins'] });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || `Failed to ${isEditing ? 'update' : 'add'} admin`, type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        adminFormSchema,
        async (vals) => {
            await mutation.mutateAsync(vals);
        }
    );

    useEffect(() => {
        if (isOpen) {
            if (isEditing && adminToEdit) {
                setValues({
                    name: adminToEdit.name,
                    email: adminToEdit.email,
                    school: adminToEdit.school,
                    status: adminToEdit.status,
                });
            } else {
                setValues(initialState);
            }
        }
    }, [adminToEdit, isOpen, setValues, isEditing]);
    

    const title = isEditing ? t('views.adminFormModal.editTitle') : t('views.adminFormModal.addTitle');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="name" label={t('views.adminFormModal.nameLabel')} value={values.name} onChange={handleChange} error={errors.name} />
                    <InputField name="email" type="email" label={t('views.adminFormModal.emailLabel')} value={values.email} onChange={handleChange} error={errors.email} />
                    <InputField name="school" label={t('views.adminFormModal.schoolLabel')} value={values.school} onChange={handleChange} error={errors.school} />
                    <SelectField name="status" label={t('views.adminFormModal.statusLabel')} value={values.status} onChange={handleChange} error={errors.status}>
                        <option value="Active">Active</option>
                        <option value="Invited">Invited</option>
                        <option value="Suspended">Suspended</option>
                    </SelectField>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? t('views.adminFormModal.savingButton') : (isEditing ? t('views.adminFormModal.saveButton') : t('views.adminFormModal.addButton'))}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AdminFormModal;
