import React, { useState, useMemo, ReactNode } from 'react';
import { getAdmins, deleteAdmin } from '@/api/schoolManagementApi';
import type { Admin } from '@/api/schemas/schoolManagementSchemas';
import type { PaginatedResponse } from '@/types/index.ts';
import DataTable from '@/components/ui/DataTable';
import { Loader2, Edit, Trash2, UserCog } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import AdminFormModal from '@/views/schools/users/AdminFormModal';
import { useAppStore } from '@/store/useAppStore';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const StatusBadge = ({ status }: { status: Admin['status'] }) => {
    const colorMap = {
        Active: 'bg-green-100 text-green-800',
        Invited: 'bg-blue-100 text-blue-800',
        Suspended: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>{status}</span>;
}

const AdminsManager: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    
    // State for the data table
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: DEFAULT_PAGE_SIZE,
    });
    const [globalFilter, setGlobalFilter] = useState('');
    
    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

    const { data, isLoading } = useQuery<PaginatedResponse<Admin>>({
        queryKey: ['admins', pagination, sorting, globalFilter],
        queryFn: () => getAdmins({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });
    
    const deleteMutation = useMutation({
        mutationFn: deleteAdmin,
        onSuccess: () => {
            addToast({ message: 'Admin deleted successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['admins'] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to delete admin', type: 'error' });
        }
    });

    const handleOpenAddModal = () => {
        setEditingAdmin(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (admin: Admin) => {
        setEditingAdmin(admin);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this admin?')) {
            deleteMutation.mutate(id);
        }
    };

    const columns: { accessorKey: Extract<keyof Admin, string>; header: string; cell?: (value: any, item: Admin) => ReactNode; enableSorting?: boolean; }[] = useMemo(() => [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'school', header: 'School' },
        { accessorKey: 'status', header: 'Status', cell: (status) => <StatusBadge status={status} /> },
        { accessorKey: 'lastLogin', header: 'Last Login', cell: (lastLogin) => new Date(lastLogin).toLocaleDateString() },
        {
            accessorKey: 'id',
            header: 'Actions',
            enableSorting: false,
            cell: (id, admin) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpenEditModal(admin)} className="p-1 text-brand-text-alt hover:text-brand-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(id)} className="p-1 text-brand-text-alt hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ], []);

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.adminsManager.title')}</h1>
            <DataTable 
                data={data?.rows ?? []} 
                columns={columns}
                pageCount={data?.pageCount ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                onAdd={handleOpenAddModal}
                addLabel={t('views.adminsManager.addAdmin')}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isLoading={isLoading}
                emptyState={{
                    icon: UserCog,
                    title: "No Admins Found",
                    description: "Get started by adding the first school administrator to the system.",
                }}
            />
            <AdminFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                adminToEdit={editingAdmin}
            />
        </div>
    );
};

export default AdminsManager;