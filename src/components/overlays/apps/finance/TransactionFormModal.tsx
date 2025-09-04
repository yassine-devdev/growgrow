
import React, { useEffect } from 'react';
import { useForm } from '@/hooks/useForm';
import { transactionFormSchema, type TransactionFormData } from '@/api/schemas/appModulesSchemas';
import { addTransaction } from '@/api/appModulesApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { QUERY_KEYS } from '@/constants/queries';
import InputField from '@/components/ui/InputField';

interface TransactionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialState: TransactionFormData = { 
    description: '', 
    amount: 0, 
    type: 'expense', 
    date: new Date().toISOString().split('T')[0] // Default to today
};

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    
    const mutation = useMutation({
        mutationFn: addTransaction,
        onSuccess: () => {
            addToast({ message: 'Transaction added successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.financeData });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to add transaction', type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        transactionFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (isOpen) {
            setValues(initialState);
        }
    }, [isOpen, setValues]);
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Transaction">
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="description" label="Description" value={values.description} onChange={handleChange} error={errors.description} />
                    <InputField name="amount" label="Amount ($)" type="number" value={values.amount === 0 ? '' : values.amount} onChange={handleChange} error={errors.amount} />
                    <InputField name="date" label="Date" type="date" value={values.date} onChange={handleChange} error={errors.date} />
                     <div>
                        <label className="block text-sm font-medium text-brand-text-alt">Type</label>
                        <div className="mt-2 flex gap-4">
                            <label className="flex items-center">
                                <input type="radio" name="type" value="expense" checked={values.type === 'expense'} onChange={handleChange} className="h-4 w-4 text-brand-primary border-gray-300 focus:ring-brand-primary"/>
                                <span className="ml-2 text-sm">Expense</span>
                            </label>
                             <label className="flex items-center">
                                <input type="radio" name="type" value="income" checked={values.type === 'income'} onChange={handleChange} className="h-4 w-4 text-brand-primary border-gray-300 focus:ring-brand-primary"/>
                                <span className="ml-2 text-sm">Income</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Transaction
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default TransactionFormModal;
