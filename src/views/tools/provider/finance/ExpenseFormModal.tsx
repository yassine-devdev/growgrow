
import React, { useEffect } from 'react';
import { useForm } from '@/hooks/useForm';
import { expenseFormSchema, type ExpenseFormData, type Expense } from '@/api/schemas/schoolManagementSchemas';
import { addExpense, updateExpense, getAiExpenseCategory } from '@/api/schoolManagementApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/ui/Modal';
import { Loader2, Wand2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

interface ExpenseFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    expenseToEdit: Expense | null;
}

const initialState: ExpenseFormData = {
    date: new Date().toISOString().split('T')[0],
    category: 'Software',
    amount: 0,
    description: '',
    isRecurring: false,
    recurrenceType: 'monthly',
    endDate: '',
};

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({ isOpen, onClose, expenseToEdit }) => {
    const queryClient = useQueryClient();
    const allExpenses = queryClient.getQueryData<Expense[]>(['expenses']) || [];
    const addToast = useAppStore(s => s.addToast);
    const isEditing = !!expenseToEdit;

    const mutation = useMutation({
        mutationFn: (formData: ExpenseFormData) => {
            return isEditing ? updateExpense(expenseToEdit!.id, formData) : addExpense(formData);
        },
        onSuccess: () => {
            addToast({ message: `Expense ${isEditing ? 'updated' : 'added'} successfully`, type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to save expense', type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        expenseFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );
    
    const categorizeMutation = useMutation({
        mutationFn: getAiExpenseCategory,
        onSuccess: (data) => {
            if (data.category) {
                setValues(prev => ({ ...prev, category: data.category }));
                addToast({ message: `AI suggested category: ${data.category}`, type: 'info' });
            }
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'AI categorization failed.', type: 'error' });
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (isEditing && expenseToEdit) {
                // If editing an instance, fetch the parent to populate recurrence info
                const parent = expenseToEdit.parentId ? allExpenses.find(e => e.id === expenseToEdit.parentId) : expenseToEdit;
                setValues({
                    date: parent?.date || expenseToEdit.date,
                    category: parent?.category || expenseToEdit.category,
                    amount: parent?.amount || expenseToEdit.amount,
                    description: parent?.description || expenseToEdit.description,
                    isRecurring: parent?.isRecurring || false,
                    recurrenceType: parent?.recurrenceType,
                    endDate: parent?.endDate || '',
                });
            } else {
                setValues(initialState);
            }
        }
    }, [expenseToEdit, isOpen, setValues, isEditing, allExpenses]);

    const title = isEditing ? 'Edit Expense' : 'Add New Expense';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="date" label="Date" type="date" value={values.date} onChange={handleChange} error={errors.date} />
                    <SelectField name="category" label="Category" value={values.category} onChange={handleChange} error={errors.category}>
                        <option>Marketing</option>
                        <option>Software</option>
                        <option>Office</option>
                        <option>Travel</option>
                    </SelectField>
                    <InputField name="amount" label="Amount ($)" type="number" value={values.amount === 0 ? '' : values.amount} onChange={handleChange} error={errors.amount} />
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-brand-text-alt">Description</label>
                        <div className="relative mt-1">
                            <input
                                id="description"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 bg-brand-surface border ${errors.description ? 'border-red-500' : 'border-brand-border'} rounded-md pr-10`}
                            />
                             <button
                                type="button"
                                onClick={() => categorizeMutation.mutate(values.description)}
                                disabled={categorizeMutation.isPending || !values.description.trim()}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-primary disabled:text-gray-400"
                                aria-label="Auto-categorize with AI"
                                title="Auto-categorize with AI"
                            >
                                {categorizeMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Wand2 className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                         {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>
                     <ToggleSwitch
                        name="isRecurring"
                        label="Recurring Expense"
                        description="Set this expense to repeat automatically."
                        checked={values.isRecurring}
                        onChange={handleChange}
                    />
                    {values.isRecurring && (
                        <div className="space-y-4 p-4 border-l-2 border-brand-primary bg-brand-surface-alt">
                            <SelectField name="recurrenceType" label="Repeats" value={values.recurrenceType} onChange={handleChange} error={errors.recurrenceType}>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </SelectField>
                            <InputField name="endDate" label="End Date (Optional)" type="date" value={values.endDate || ''} onChange={handleChange} error={errors.endDate} />
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? 'Save Changes' : 'Add Expense'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ExpenseFormModal;
