import React, { useState, useMemo, ReactNode } from 'react';
import { getTeachers, deleteTeacher } from '@/api/schoolManagementApi';
import type { Teacher } from '@/api/schemas/schoolManagementSchemas';
import type { PaginatedResponse } from '@/types/index.ts';
import DataTable from '@/components/ui/DataTable';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import TeacherFormModal from '@/views/schools/users/TeacherFormModal';
import { useAppStore } from '@/store/useAppStore';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const StatusBadge = ({ status }: { status: Teacher['status'] }) => {
    const colorMap = {
        Active: 'bg-green-100 text-green-800',
        'On Leave': 'bg-yellow-100 text-yellow-800',
        Archived: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>{status}</span>;
};

const TeachersManager: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

    const { data, isLoading } = useQuery<PaginatedResponse<Teacher>>({
        queryKey: ['teachers', pagination, sorting, globalFilter],
        queryFn: () => getTeachers({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });
    
    const deleteMutation = useMutation({
        mutationFn: deleteTeacher,
        onSuccess: () => {
            addToast({ message: 'Teacher deleted successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to delete teacher', type: 'error' });
        }
    });

    const handleOpenAddModal = () => {
        setEditingTeacher(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            deleteMutation.mutate(id);
        }
    };

    const columns: { accessorKey: Extract<keyof Teacher, string>; header: string; cell?: (value: any, item: Teacher) => ReactNode; enableSorting?: boolean }[] = useMemo(() => [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'school', header: 'School' },
        { accessorKey: 'subject', header: 'Subject' },
        { accessorKey: 'status', header: 'Status', cell: (status) => <StatusBadge status={status} /> },
        {
            accessorKey: 'id',
            header: 'Actions',
            enableSorting: false,
            cell: (id, teacher) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpenEditModal(teacher)} className="p-1 text-brand-text-alt hover:text-brand-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(id)} className="p-1 text-brand-text-alt hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ], []);
    
    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.teachersManager.title')}</h1>
            <DataTable 
                data={data?.rows ?? []} 
                columns={columns} 
                pageCount={data?.pageCount ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                onAdd={handleOpenAddModal}
                addLabel={t('views.teachersManager.addTeacher')}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isLoading={isLoading}
            />
            <TeacherFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                teacherToEdit={editingTeacher}
            />
        </div>
    );
};

export default TeachersManager;