import React, { useState, useMemo, ReactNode } from 'react';
import { getCrmLeads, deleteCrmLead } from '@/api/crmApi';
import type { CrmLead } from '@/api/schemas/crmSchemas';
import type { PaginatedResponse } from '@/types';
import DataTable from '@/components/ui/DataTable';
import { Loader2, Edit, Trash2, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import LeadFormModal from './LeadFormModal';
import { useAppStore } from '@/store/useAppStore';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { QUERY_KEYS } from '@/constants/queries';

const StatusBadge: React.FC<{ status: CrmLead['status'] }> = ({ status }) => {
    const colorMap = {
        New: 'bg-blue-100 text-blue-800',
        Contacted: 'bg-yellow-100 text-yellow-800',
        Qualified: 'bg-green-100 text-green-800',
        Disqualified: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>{status}</span>;
}

const LeadsManager: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<CrmLead | null>(null);

    const { data, isLoading } = useQuery<PaginatedResponse<CrmLead>>({
        queryKey: [QUERY_KEYS.crmLeads, pagination, sorting, globalFilter],
        queryFn: () => getCrmLeads({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });
    
    const deleteMutation = useMutation({
        mutationFn: deleteCrmLead,
        onSuccess: () => {
            addToast({ message: 'Lead deleted successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.crmLeads] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to delete lead', type: 'error' });
        }
    });

    const handleOpenAddModal = () => {
        setEditingLead(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (lead: CrmLead) => {
        setEditingLead(lead);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            deleteMutation.mutate(id);
        }
    };

    const columns: { accessorKey: Extract<keyof CrmLead, string>; header: string; cell?: (value: any, item: CrmLead) => ReactNode }[] = useMemo(() => [
        { accessorKey: 'companyName', header: 'Company Name' },
        { accessorKey: 'contactName', header: 'Contact' },
        { accessorKey: 'status', header: 'Status', cell: (status) => <StatusBadge status={status} /> },
        { accessorKey: 'source', header: 'Source' },
        { accessorKey: 'estimatedValue', header: 'Value', cell: (value) => `$${value.toLocaleString()}` },
        {
            accessorKey: 'id',
            header: 'Actions',
            cell: (id, lead) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpenEditModal(lead)} className="p-1 text-brand-text-alt hover:text-brand-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(id)} className="p-1 text-brand-text-alt hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ], []);

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.crm.leads.title')}</h1>
            <DataTable 
                data={data?.rows ?? []} 
                columns={columns}
                pageCount={data?.pageCount ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                onAdd={handleOpenAddModal}
                addLabel={t('views.crm.leads.addLead')}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isLoading={isLoading}
                emptyState={{
                    icon: Users,
                    title: "No Leads Found",
                    description: "Get started by adding your first sales lead.",
                }}
            />
            <LeadFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                leadToEdit={editingLead}
            />
        </div>
    );
};

export default LeadsManager;