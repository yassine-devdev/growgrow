import React, { useState, useMemo, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExpenses, deleteExpense } from '@/api/schoolManagementApi';
import type { Expense } from '@/api/schemas/schoolManagementSchemas';
import type { PaginatedResponse } from '@/types/index.ts';
import { Loader2, Edit, Trash2, Repeat } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import ExpenseFormModal from './ExpenseFormModal';
import { useAppStore } from '@/store/useAppStore';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const ExpenseTracker: React.FC = () => {
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const { data, isLoading } = useQuery<PaginatedResponse<Expense>>({
        queryKey: ['expenses', pagination, sorting, globalFilter],
        queryFn: () => getExpenses({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (prev) => prev,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteExpense,
        onSuccess: () => {
            addToast({ message: 'Expense deleted', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to delete expense', type: 'error' });
        }
    });

    const handleOpenAddModal = () => {
        setEditingExpense(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (expense: Expense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    const columns: { accessorKey: Extract<keyof Expense, string>; header: string; cell?: (value: any, item: Expense) => ReactNode; enableSorting?: boolean; }[] = useMemo(() => [
        { accessorKey: 'date', header: 'Date' },
        { accessorKey: 'category', header: 'Category' },
        { 
            accessorKey: 'description', 
            header: 'Description',
            cell: (description, item) => (
                <div className="flex items-center gap-2">
                    {item.isRecurring && <span title="Recurring Expense Template"><Repeat className="w-4 h-4 text-brand-primary shrink-0" /></span>}
                    <span>{description}</span>
                </div>
            )
        },
        { accessorKey: 'amount', header: 'Amount', cell: (value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        {
            accessorKey: 'id',
            header: 'Actions',
            enableSorting: false,
            cell: (id, item) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpenEditModal(item)} className="p-1 text-brand-text-alt hover:text-brand-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(id)} className="p-1 text-brand-text-alt hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ], []);

    if (isLoading && !data) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-xl font-bold text-brand-text">Expense Tracker</h1>
            <DataTable
                data={data?.rows ?? []}
                columns={columns}
                pageCount={data?.pageCount ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={handleOpenAddModal}
                addLabel="Add Expense"
                isLoading={isLoading}
            />
             <ExpenseFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                expenseToEdit={editingExpense}
            />
        </div>
    );
};

export default ExpenseTracker;