import React, { useState, useMemo, ReactNode } from 'react';
import { getProviderSchools, deleteSchool } from '@/api/schoolManagementApi'; 
import type { ProviderSchool } from '@/api/schemas/schoolManagementSchemas';
import type { PaginatedResponse } from '@/types/index.ts';
import DataTable from '@/components/ui/DataTable';
import { Loader2, Edit, Trash2, Building } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import DataEmptyState from '@/components/ui/DataEmptyState';
import SchoolFormModal from './SchoolFormModal'; 
import { useAppStore } from '@/store/useAppStore'; 
import { Link, useNavigate } from 'react-router-dom';

const StatusBadge = ({ status }: { status: ProviderSchool['status'] }) => {
    const colorMap = {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>{status}</span>;
};

const ManageSchools: React.FC = () => {
    const queryClient = useQueryClient(); 
    const navigate = useNavigate();
    const addToast = useAppStore(s => s.addToast); 
    const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: DEFAULT_PAGE_SIZE,
    });
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [editingSchool, setEditingSchool] = useState<ProviderSchool | null>(null); 

    const { data, isLoading } = useQuery<PaginatedResponse<ProviderSchool>>({
        queryKey: ['providerSchools', pagination, sorting, globalFilter],
        queryFn: () => getProviderSchools({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });
    
    
    const deleteMutation = useMutation({
        mutationFn: deleteSchool,
        onSuccess: () => {
            addToast({ message: 'School deleted successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['providerSchools'] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to delete school', type: 'error' });
        }
    });

    const handleOpenEditModal = (school: ProviderSchool) => {
        setEditingSchool(school);
        setIsModalOpen(true);
    };
    
    const handleAddSchool = () => navigate('/schools/onboarding/new-school-wizard');

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this school?')) {
            deleteMutation.mutate(id);
        }
    };
    
    const columns: { accessorKey: Extract<keyof ProviderSchool, string>; header: string; cell?: (value: any, item: ProviderSchool) => ReactNode; enableSorting?: boolean; }[] = useMemo(() => [
        { 
            accessorKey: 'name', 
            header: 'School Name',
            cell: (name, school) => (
                <Link to={`/schools/detail/${school.id}`} className="font-medium text-brand-primary hover:underline">
                    {name}
                </Link>
            )
        },
        { accessorKey: 'plan', header: 'Plan' },
        { accessorKey: 'users', header: 'Users', cell: (users) => users.toLocaleString() },
        { accessorKey: 'status', header: 'Status', cell: (status) => <StatusBadge status={status} /> },
        {
            accessorKey: 'id',
            header: 'Actions',
            enableSorting: false,
            cell: (id, school) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpenEditModal(school)} className="p-1 text-brand-text-alt hover:text-brand-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(id)} className="p-1 text-brand-text-alt hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ], []); 

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Manage Schools</h1>
             <DataTable 
                data={data?.rows ?? []} 
                columns={columns}
                pageCount={data?.pageCount ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                onAdd={handleAddSchool}
                addLabel="Onboard School"
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isLoading={isLoading}
                emptyState={{
                    icon: Building,
                    title: "No Schools Found",
                    description: "You haven't onboarded any schools yet. Use the 'New School' form to get started.",
                }}
            />
            <SchoolFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                schoolToEdit={editingSchool}
            />
        </div>
    );
};

export default ManageSchools;