import React, { useEffect } from 'react';
import { useForm } from '../../../hooks/useForm';
import { studentFormSchema, type StudentFormData, type SchoolUser } from '../../../api/schemas/schoolManagementSchemas';
import { addStudent, updateStudent } from '../../../api/schoolManagementApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Modal from '../../../components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import { QUERY_KEYS } from '@/constants/queries';

interface StudentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentToEdit: SchoolUser | null;
}

const initialState: StudentFormData = { name: '', email: '', school: '', grade: 9, status: 'Active' };

const StudentFormModal: React.FC<StudentFormModalProps> = ({ isOpen, onClose, studentToEdit }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const isEditing = !!studentToEdit;

    const mutation = useMutation({
        mutationFn: (formData: StudentFormData) => {
            return isEditing ? updateStudent(studentToEdit!.id, formData) : addStudent(formData);
        },
        onSuccess: () => {
            addToast({ message: `Student ${isEditing ? 'updated' : 'added'} successfully`, type: 'success' });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.students] });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to save student', type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        studentFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (isOpen) {
            if (isEditing && studentToEdit) {
                setValues({
                    name: studentToEdit.name,
                    email: studentToEdit.email,
                    school: studentToEdit.school,
                    grade: studentToEdit.grade || 9,
                    status: studentToEdit.status,
                });
            } else {
                setValues(initialState);
            }
        }
    }, [studentToEdit, isOpen, setValues, isEditing]);
    
    const title = isEditing ? t('views.studentFormModal.editTitle') : t('views.studentFormModal.addTitle');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="name" label={t('views.studentFormModal.nameLabel')} value={values.name} onChange={handleChange} error={errors.name} />
                    <InputField name="email" type="email" label={t('views.studentFormModal.emailLabel')} value={values.email} onChange={handleChange} error={errors.email} />
                    <InputField name="school" label={t('views.studentFormModal.schoolLabel')} value={values.school} onChange={handleChange} error={errors.school} />
                    <InputField name="grade" type="number" label={t('views.studentFormModal.gradeLabel')} value={values.grade} onChange={handleChange} error={errors.grade} />
                    <SelectField name="status" label={t('views.studentFormModal.statusLabel')} value={values.status} onChange={handleChange} error={errors.status}>
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
                        {isEditing ? t('views.studentFormModal.saveButton') : t('views.studentFormModal.addButton')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default StudentFormModal;