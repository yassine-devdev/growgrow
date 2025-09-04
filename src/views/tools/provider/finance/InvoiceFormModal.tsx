
import React, { useEffect } from 'react';
import { useForm } from '@/hooks/useForm';
import { invoiceFormSchema, type InvoiceFormData, type Invoice } from '@/api/schemas/schoolManagementSchemas';
import { addInvoice, updateInvoice } from '@/api/schoolManagementApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';

interface InvoiceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoiceToEdit: Invoice | null;
}

const initialState: InvoiceFormData = {
    school: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], // 30 days from now
    status: 'Pending',
};

const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({ isOpen, onClose, invoiceToEdit }) => {
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const isEditing = !!invoiceToEdit;

    const mutation = useMutation({
        mutationFn: (formData: InvoiceFormData) => {
            const queryKeyToInvalidate = ['invoices', 'tools_invoices_crud'];
            const promise = isEditing ? updateInvoice(invoiceToEdit!.id, formData) : addInvoice(formData);
            
            promise.then(() => {
                queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
            });

            return promise;
        },
        onSuccess: () => {
            addToast({ message: `Invoice ${isEditing ? 'updated' : 'added'} successfully`, type: 'success' });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to save invoice', type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        invoiceFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (isOpen) {
            if (isEditing && invoiceToEdit) {
                setValues({
                    school: invoiceToEdit.school,
                    amount: invoiceToEdit.amount,
                    date: invoiceToEdit.date,
                    dueDate: invoiceToEdit.dueDate,
                    status: invoiceToEdit.status,
                });
            } else {
                setValues(initialState);
            }
        }
    }, [invoiceToEdit, isOpen, isEditing, setValues]);

    const title = isEditing ? 'Edit Invoice' : 'Add New Invoice';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="school" label="School" value={values.school} onChange={handleChange} error={errors.school} />
                    <InputField name="amount" label="Amount ($)" type="number" value={values.amount === 0 ? '' : values.amount} onChange={handleChange} error={errors.amount} />
                    <InputField name="date" label="Invoice Date" type="date" value={values.date} onChange={handleChange} error={errors.date} />
                    <InputField name="dueDate" label="Due Date" type="date" value={values.dueDate} onChange={handleChange} error={errors.dueDate} />
                    <SelectField name="status" label="Status" value={values.status} onChange={handleChange} error={errors.status}>
                        <option>Pending</option>
                        <option>Paid</option>
                        <option>Overdue</option>
                    </SelectField>
                </div>
                <div className="mt-6 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? 'Save Changes' : 'Add Invoice'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default InvoiceFormModal;
