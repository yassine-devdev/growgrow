import React, { useMemo, useState, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMarketingCampaigns, deleteMarketingCampaign } from '@/api/appModulesApi';
import type { MarketingCampaign } from '@/api/schemas/appModulesSchemas';
import DataTable from '@/components/ui/DataTable';
import { Loader2, Trash2, Briefcase } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import CampaignFormModal from './CampaignFormModal';
import { useTranslation } from 'react-i18next';
import { PaginatedResponse } from '@/types';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const StatusBadge = ({ status }: { status: MarketingCampaign['status'] }) => {
    const colorMap = {
        Active: 'bg-green-100 text-green-800',
        Paused: 'bg-yellow-100 text-yellow-800',
        Completed: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>{status}</span>;
};

const CampaignsManager: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading } = useQuery<PaginatedResponse<MarketingCampaign>>({
        queryKey: ['marketingCampaigns', pagination, sorting, globalFilter],
        queryFn: () => getMarketingCampaigns({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (prev) => prev,
    });
    
    const deleteMutation = useMutation({
        mutationFn: deleteMarketingCampaign,
        onSuccess: () => {
            addToast({ message: 'Campaign deleted', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['marketingCampaigns'] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to delete campaign', type: 'error' });
        }
    });
    
    const handleOpenAddModal = () => setIsModalOpen(true);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this campaign?')) {
            deleteMutation.mutate(id);
        }
    };
    
    const columns: { accessorKey: Extract<keyof MarketingCampaign, string>; header: string; cell?: (value: any, item: MarketingCampaign) => ReactNode; }[] = [
        { accessorKey: 'name', header: 'Campaign Name' },
        { accessorKey: 'status', header: 'Status', cell: (status) => <StatusBadge status={status} /> },
        { accessorKey: 'channel', header: 'Channel' },
        { accessorKey: 'spend', header: 'Spend', cell: (spend) => `$${spend.toFixed(2)}` },
        { accessorKey: 'conversions', header: 'Conversions' },
        {
            accessorKey: 'id',
            header: 'Actions',
            cell: (id) => (
                <button onClick={() => handleDelete(id)} className="p-1 text-brand-text-alt hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            )
        }
    ];

    if (isLoading && !data) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Marketing Campaigns</h1>
            <DataTable
                data={data?.rows ?? []}
                columns={columns}
                pageCount={data?.pageCount ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                addLabel="New Campaign"
                onAdd={() => setIsModalOpen(true)}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isLoading={isLoading}
                emptyState={{
                    icon: Briefcase,
                    title: t('dataEmptyState.noCampaigns.title'),
                    description: t('dataEmptyState.noCampaigns.description'),
                }}
            />
            <CampaignFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default CampaignsManager;