import React, { useState, useMemo, ReactNode } from 'react';
import { getParents, deleteParent } from '@/api/schoolManagementApi';
import type { SchoolUser } from '@/api/schemas/schoolManagementSchemas';
import type { PaginatedResponse } from '@/types/index.ts';
import DataTable from '@/components/ui/DataTable';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import ParentFormModal from '@/views/schools/users/ParentFormModal';
import { useAppStore } from '@/store/useAppStore';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const ParentsManager: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingParent, setEditingParent] = useState<SchoolUser | null>(null);

    const { data, isLoading } = useQuery<PaginatedResponse<SchoolUser>>({
        queryKey: ['parents', pagination, sorting, globalFilter],
        queryFn: () => getParents({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });
    
    const deleteMutation = useMutation({
        mutationFn: deleteParent,
        onSuccess: () => {
            addToast({ message: 'Parent deleted successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['parents'] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to delete parent', type: 'error' });
        }
    });

    const handleOpenAddModal = () => {
        setEditingParent(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (parent: SchoolUser) => {
        setEditingParent(parent);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this parent?')) {
            deleteMutation.mutate(id);
        }
    };

    const columns: { accessorKey: Extract<keyof SchoolUser, string>; header: string; cell?: (value: any, item: SchoolUser) => ReactNode; enableSorting?: boolean; }[] = useMemo(() => [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'school', header: 'School' },
        { accessorKey: 'children', header: 'Children', cell: (children) => Array.isArray(children) ? children.join(', ') : '' },
        {
            accessorKey: 'id',
            header: 'Actions',
            enableSorting: false,
            cell: (id, parent) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpenEditModal(parent)} className="p-1 text-brand-text-alt hover:text-brand-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(id)} className="p-1 text-brand-text-alt hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ], []);
    
    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.parentsManager.title')}</h1>
            <DataTable 
                data={data?.rows ?? []} 
                columns={columns} 
                pageCount={data?.pageCount ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                onAdd={handleOpenAddModal}
                addLabel={t('views.parentsManager.addParent')}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isLoading={isLoading}
            />
            <ParentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                parentToEdit={editingParent}
            />
        </div>
    );
};

export default ParentsManager;