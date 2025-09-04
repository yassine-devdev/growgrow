import React, { useEffect } from 'react';
import { useForm } from '@/hooks/useForm';
import { assignmentFormSchema, type AssignmentFormData, type Assignment } from '@/api/schemas/schoolHubSchemas';
import { addAssignment, updateAssignment } from '@/api/schoolHubApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';

interface AssignmentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignmentToEdit: Assignment | null;
}

// Mock course list for the dropdown
const mockCourses = [
    { id: 'ALG-2', name: 'Algebra II' },
    { id: 'HIST-1', name: 'World History' },
    { id: 'SCI-BIO', name: 'Biology' },
];

const initialState: AssignmentFormData = {
    title: '',
    description: '',
    course: '',
    dueDate: new Date().toISOString().split('T')[0],
    maxPoints: 100,
};

const AssignmentFormModal: React.FC<AssignmentFormModalProps> = ({ isOpen, onClose, assignmentToEdit }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const isEditing = !!assignmentToEdit;

    const mutation = useMutation({
        mutationFn: (formData: AssignmentFormData) => {
            return isEditing ? updateAssignment(assignmentToEdit!.id, formData) : addAssignment(formData);
        },
        onSuccess: () => {
            addToast({ message: `Assignment ${isEditing ? 'updated' : 'created'} successfully`, type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to save assignment', type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        assignmentFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (isOpen) {
            if (isEditing && assignmentToEdit) {
                setValues({
                    title: assignmentToEdit.title,
                    description: '', // Description is not on the base Assignment type, so we default it
                    course: assignmentToEdit.course,
                    dueDate: new Date(assignmentToEdit.dueDate).toISOString().split('T')[0],
                    maxPoints: assignmentToEdit.maxPoints,
                });
            } else {
                setValues(initialState);
            }
        }
    }, [assignmentToEdit, isOpen, setValues, isEditing]);
    
    const title = isEditing ? t('views.assignmentForm.editTitle') : t('views.assignmentForm.addTitle');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="title" label={t('views.assignmentForm.titleLabel')} value={values.title} onChange={handleChange} error={errors.title} />
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-brand-text-alt">{t('views.assignmentForm.descriptionLabel')}</label>
                        <textarea
                            id="description"
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            rows={4}
                            className={`mt-1 block w-full px-3 py-2 bg-brand-surface border ${errors.description ? 'border-red-500' : 'border-brand-border'} rounded-md`}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>
                    <SelectField name="course" label={t('views.assignmentForm.courseLabel')} value={values.course} onChange={handleChange} error={errors.course}>
                        <option value="">Select a course</option>
                        {mockCourses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </SelectField>
                    <InputField name="dueDate" label={t('views.assignmentForm.dueDateLabel')} type="date" value={values.dueDate} onChange={handleChange} error={errors.dueDate} />
                    <InputField name="maxPoints" label={t('views.assignmentForm.maxPointsLabel')} type="number" value={values.maxPoints} onChange={handleChange} error={errors.maxPoints} />
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? t('views.assignmentForm.saveButton') : t('views.assignmentForm.addButton')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AssignmentFormModal;