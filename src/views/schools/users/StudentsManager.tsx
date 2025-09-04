import React, { useState, useMemo, ReactNode } from 'react';
import { getStudents, deleteStudent } from '@/api/schoolManagementApi';
import type { SchoolUser } from '@/api/schemas/schoolManagementSchemas';
import type { PaginatedResponse } from '@/types/index.ts';
import DataTable from '@/components/ui/DataTable';
import { Loader2, Edit, Trash2, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import StudentFormModal from '@/views/schools/users/StudentFormModal';
import { useAppStore } from '@/store/useAppStore';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { QUERY_KEYS } from '@/constants/queries';

const StatusBadge: React.FC<{ status: SchoolUser['status'] }> = ({ status }) => {
    const colorMap = {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>{status}</span>;
}

const StudentsManager: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<SchoolUser | null>(null);

    const { data, isLoading } = useQuery<PaginatedResponse<SchoolUser>>({
        queryKey: [QUERY_KEYS.students, pagination, sorting, globalFilter],
        queryFn: () => getStudents({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });
    
    const deleteMutation = useMutation({
        mutationFn: deleteStudent,
        onSuccess: () => {
            addToast({ message: 'Student deleted successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.students] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to delete student', type: 'error' });
        }
    });

    const handleOpenAddModal = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (student: SchoolUser) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            deleteMutation.mutate(id);
        }
    };

    const columns: { accessorKey: Extract<keyof SchoolUser, string>; header: string; cell?: (value: any, item: SchoolUser) => ReactNode; enableSorting?: boolean; }[] = useMemo(() => [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'school', header: 'School' },
        { accessorKey: 'grade', header: 'Grade' },
        { accessorKey: 'status', header: 'Status', cell: (status) => <StatusBadge status={status} /> },
        {
            accessorKey: 'id',
            header: 'Actions',
            enableSorting: false,
            cell: (id, student) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpenEditModal(student)} className="p-1 text-brand-text-alt hover:text-brand-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(id)} className="p-1 text-brand-text-alt hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ], []);
    
    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.studentsManager.title')}</h1>
            <DataTable 
                data={data?.rows ?? []} 
                columns={columns} 
                pageCount={data?.pageCount ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                onAdd={handleOpenAddModal}
                addLabel={t('views.studentsManager.addStudent')}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isLoading={isLoading}
                emptyState={{
                    icon: Users,
                    title: "No Students Found",
                    description: "Get started by adding the first student to the system.",
                }}
            />
            <StudentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                studentToEdit={editingStudent}
            />
        </div>
    );
};

export default StudentsManager;