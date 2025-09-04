import React, { useState, useMemo, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDomains, deleteDomain } from '@/api/schoolManagementApi';
import type { Domain } from '@/api/schemas/schoolManagementSchemas';
import type { PaginatedResponse } from '@/types/index.ts';
import DataTable from '@/components/ui/DataTable';
import DomainFormModal from '@/views/schools/whitelabel/DomainFormModal';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import type { PaginationState, SortingState } from '@tanstack/react-table';

const StatusBadge = ({ status }: { status: Domain['status'] }) => {
    const colorMap = {
        Verified: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Failed: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>{status}</span>;
};

const DomainsManager: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDomain, setEditingDomain] = useState<Domain | null>(null);

    const { data, isLoading } = useQuery<PaginatedResponse<Domain>>({
        queryKey: ['domains', pagination, sorting, globalFilter],
        queryFn: () => getDomains({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (prev) => prev,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteDomain,
        onSuccess: () => {
            addToast({ message: 'Domain deleted successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['domains'] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to delete domain', type: 'error' });
        }
    });

    const handleOpenAddModal = () => {
        setEditingDomain(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (domain: Domain) => {
        setEditingDomain(domain);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this domain?')) {
            deleteMutation.mutate(id);
        }
    };

    const columns: { accessorKey: Extract<keyof Domain, string>; header: string; cell?: (value: any, item: Domain) => ReactNode; enableSorting?: boolean; }[] = useMemo(() => [
        { accessorKey: 'domainName', header: 'Domain Name' },
        { accessorKey: 'isPrimary', header: 'Primary', cell: (isPrimary) => isPrimary ? 'Yes' : 'No' },
        { accessorKey: 'status', header: 'Status', cell: (status) => <StatusBadge status={status} /> },
        {
            accessorKey: 'id',
            header: 'Actions',
            enableSorting: false,
            cell: (id, domain) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpenEditModal(domain)} className="p-1 text-brand-text-alt hover:text-brand-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(id)} className="p-1 text-brand-text-alt hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ], []);

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.domainsManager.title')}</h1>
            <DataTable 
                data={data?.rows ?? []} 
                columns={columns}
                pageCount={data?.pageCount ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                onAdd={handleOpenAddModal}
                addLabel={t('views.domainsManager.addButton')}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isLoading={isLoading}
            />
            <DomainFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                domainToEdit={editingDomain}
            />
        </div>
    );
};

export default DomainsManager;