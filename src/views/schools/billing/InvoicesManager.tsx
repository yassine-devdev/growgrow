import React, { useState, useMemo, ReactNode } from 'react';
import { getInvoices, deleteInvoice } from '@/api/schoolManagementApi';
import type { Invoice } from '@/api/schemas/schoolManagementSchemas';
import DataTable from '@/components/ui/DataTable';
import { Loader2, Download, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import type { PaginatedResponse } from '@/types/index.ts';
import { useAppStore } from '@/store/useAppStore';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import InvoiceFormModal from '@/views/tools/provider/finance/InvoiceFormModal'; // Re-use the existing modal

const StatusBadge = ({ status }: { status: Invoice['status'] }) => {
    const colorMap = {
        Paid: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Overdue: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>{status}</span>;
};

const InvoicesManager: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

    const { data, isLoading } = useQuery<PaginatedResponse<Invoice>>({
        queryKey: ['invoices', pagination, sorting, globalFilter],
        queryFn: () => getInvoices({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });
    
    const deleteMutation = useMutation({
        mutationFn: deleteInvoice,
        onSuccess: () => {
            addToast({ message: 'Invoice deleted successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to delete invoice', type: 'error' });
        }
    });

    const handleOpenAddModal = () => {
        setEditingInvoice(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (invoice: Invoice) => {
        setEditingInvoice(invoice);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            deleteMutation.mutate(id);
        }
    };

    const columns: { accessorKey: Extract<keyof Invoice, string>; header: string; cell?: (value: any, item: Invoice) => ReactNode; enableSorting?: boolean }[] = useMemo(() => [
        { accessorKey: 'id', header: 'Invoice ID' },
        { accessorKey: 'school', header: 'School' },
        { accessorKey: 'amount', header: 'Amount', cell: (amount) => `$${amount.toLocaleString()}` },
        { accessorKey: 'date', header: 'Date' },
        { accessorKey: 'dueDate', header: 'Due Date' },
        { accessorKey: 'status', header: 'Status', cell: (status) => <StatusBadge status={status} /> },
        {
            accessorKey: 'id',
            header: 'Actions',
            enableSorting: false,
            cell: (id, item) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpenEditModal(item)} className="p-1 text-brand-text-alt hover:text-brand-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(id)} className="p-1 text-brand-text-alt hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    <button className="p-1 text-brand-text-alt hover:text-brand-primary"><Download className="w-4 h-4" /></button>
                </div>
            )
        },
    ], []);

    if (isLoading && !data) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.invoicesManager.title')}</h1>
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
                addLabel="Add Invoice"
                isLoading={isLoading}
            />
             <InvoiceFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                invoiceToEdit={editingInvoice}
            />
        </div>
    );
};

export default InvoicesManager;