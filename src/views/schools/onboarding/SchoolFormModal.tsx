import React, { useEffect } from 'react';
import { useForm } from '@/hooks/useForm';
import { providerSchoolFormSchema, type ProviderSchoolFormData, type ProviderSchool } from '@/api/schemas/schoolManagementSchemas';
import { updateSchool } from '@/api/schoolManagementApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';

interface SchoolFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    schoolToEdit: ProviderSchool | null;
}

const SchoolFormModal: React.FC<SchoolFormModalProps> = ({ isOpen, onClose, schoolToEdit }) => {
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    
    const initialState: ProviderSchoolFormData = {
        name: '',
        plan: 'Pro',
        status: 'Active',
    };

    const mutation = useMutation({
        mutationFn: (schoolData: ProviderSchoolFormData) => {
            if (schoolToEdit) {
                return updateSchool(schoolToEdit.id, schoolData);
            }
            // This modal is for editing only, but let's handle this case gracefully.
            return Promise.reject(new Error("No school selected for editing."));
        },
        onSuccess: () => {
            addToast({ message: 'School updated successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['providerSchools'] });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to update school', type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        providerSchoolFormSchema,
        async (vals) => {
            await mutation.mutateAsync(vals);
        }
    );

    useEffect(() => {
        if (isOpen && schoolToEdit) {
            setValues({
                name: schoolToEdit.name,
                plan: schoolToEdit.plan,
                status: schoolToEdit.status,
            });
        }
    }, [schoolToEdit, isOpen, setValues]);
    

    const title = 'Edit School';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="name" label="School Name" value={values.name} onChange={handleChange} error={errors.name} />
                    <SelectField name="plan" label="Subscription Plan" value={values.plan} onChange={handleChange} error={errors.plan}>
                        <option value="Basic">Basic</option>
                        <option value="Pro">Pro</option>
                        <option value="Enterprise">Enterprise</option>
                    </SelectField>
                    <SelectField name="status" label="Status" value={values.status} onChange={handleChange} error={errors.status}>
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
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default SchoolFormModal;