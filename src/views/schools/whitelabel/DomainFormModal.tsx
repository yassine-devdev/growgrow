
import React, { useEffect } from 'react';
import { useForm } from '../../../hooks/useForm';
import { domainFormSchema, type DomainFormData, type Domain } from '../../../api/schemas/schoolManagementSchemas';
import { addDomain, updateDomain } from '../../../api/schoolManagementApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../../../components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';

interface DomainFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    domainToEdit: Domain | null;
}

const Toggle = ({ name, label, checked, onChange }: { name: string; label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="flex items-center">
        <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
        <label htmlFor={name} className="ml-2 block text-sm text-brand-text">{label}</label>
    </div>
);

const initialState: DomainFormData = { domainName: '', isPrimary: false, status: 'Pending' };

const DomainFormModal: React.FC<DomainFormModalProps> = ({ isOpen, onClose, domainToEdit }) => {
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const isEditing = !!domainToEdit;

    const mutation = useMutation({
        mutationFn: (formData: DomainFormData) => {
            return isEditing ? updateDomain(domainToEdit!.id, formData) : addDomain(formData);
        },
        onSuccess: () => {
            addToast({ message: `Domain ${isEditing ? 'updated' : 'added'} successfully`, type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['domains'] });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to save domain', type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        domainFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (isOpen) {
            if (isEditing && domainToEdit) {
                setValues({
                    domainName: domainToEdit.domainName,
                    isPrimary: domainToEdit.isPrimary,
                    status: domainToEdit.status,
                });
            } else {
                setValues(initialState);
            }
        }
    }, [domainToEdit, isOpen, setValues, isEditing]);

    const title = isEditing ? 'Edit Domain' : 'Add New Domain';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="domainName" label="Domain Name" value={values.domainName} onChange={handleChange} error={errors.domainName} placeholder="e.g., learn.myschool.com" />
                    <SelectField name="status" label="Status" value={values.status} onChange={handleChange} error={errors.status}>
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Failed">Failed</option>
                    </SelectField>
                    <Toggle name="isPrimary" label="Set as Primary Domain" checked={values.isPrimary} onChange={handleChange} />
                </div>
                <div className="mt-6 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? 'Save Changes' : 'Add Domain'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default DomainFormModal;
