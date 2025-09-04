
import React, { useEffect } from 'react';
import { useForm } from '../../../hooks/useForm';
import { teacherFormSchema, type TeacherFormData, type Teacher } from '../../../api/schemas/schoolManagementSchemas';
import { addTeacher, updateTeacher } from '../../../api/schoolManagementApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Modal from '../../../components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';

interface TeacherFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    teacherToEdit: Teacher | null;
}

const initialState: TeacherFormData = {
    name: '', email: '', school: '', subject: '', yearsExperience: 0, status: 'Active',
};

const TeacherFormModal: React.FC<TeacherFormModalProps> = ({ isOpen, onClose, teacherToEdit }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const isEditing = !!teacherToEdit;

    const mutation = useMutation({
        mutationFn: (formData: TeacherFormData) => {
            return isEditing ? updateTeacher(teacherToEdit!.id, formData) : addTeacher(formData);
        },
        onSuccess: () => {
            addToast({ message: `Teacher ${isEditing ? 'updated' : 'added'} successfully`, type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || `Failed to ${isEditing ? 'update' : 'add'} teacher`, type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        teacherFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (isOpen) {
            if (isEditing && teacherToEdit) {
                setValues({
                    name: teacherToEdit.name,
                    email: teacherToEdit.email,
                    school: teacherToEdit.school,
                    subject: teacherToEdit.subject,
                    yearsExperience: teacherToEdit.yearsExperience,
                    status: teacherToEdit.status,
                });
            } else {
                setValues(initialState);
            }
        }
    }, [teacherToEdit, isOpen, setValues, isEditing]);
    

    const title = isEditing ? t('views.teacherFormModal.editTitle') : t('views.teacherFormModal.addTitle');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="name" label={t('views.teacherFormModal.nameLabel')} value={values.name} onChange={handleChange} error={errors.name} />
                    <InputField name="email" type="email" label={t('views.teacherFormModal.emailLabel')} value={values.email} onChange={handleChange} error={errors.email} />
                    <InputField name="school" label={t('views.teacherFormModal.schoolLabel')} value={values.school} onChange={handleChange} error={errors.school} />
                    <InputField name="subject" label={t('views.teacherFormModal.subjectLabel')} value={values.subject} onChange={handleChange} error={errors.subject} />
                    <InputField name="yearsExperience" type="number" label={t('views.teacherFormModal.experienceLabel')} value={values.yearsExperience} onChange={handleChange} error={errors.yearsExperience} />
                    <SelectField name="status" label={t('views.teacherFormModal.statusLabel')} value={values.status} onChange={handleChange} error={errors.status}>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Archived">Archived</option>
                    </SelectField>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? t('views.teacherFormModal.saveButton') : t('views.teacherFormModal.addButton')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default TeacherFormModal;
