import React, { useState, useMemo, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssignments, deleteAssignment } from '@/api/schoolHubApi';
import type { Assignment } from '@/api/schemas/schoolHubSchemas';
import type { PaginatedResponse } from '@/types/index.ts';
import DataTable from '@/components/ui/DataTable';
import { Loader2, Edit, Trash2, ClipboardList, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import AssignmentFormModal from './AssignmentFormModal';
import { useAppStore } from '@/store/useAppStore';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { Link } from 'react-router-dom';

const AssignmentsManager: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    
    // State for the data table
    const [sorting, setSorting] = useState<SortingState>([{ id: 'dueDate', desc: false }]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: DEFAULT_PAGE_SIZE,
    });
    const [globalFilter, setGlobalFilter] = useState('');
    
    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

    const queryKey = ['assignments', pagination, sorting, globalFilter];
    const { data, isLoading } = useQuery<PaginatedResponse<Assignment>>({
        queryKey: queryKey,
        queryFn: () => getAssignments({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });
    
    const deleteMutation = useMutation({
        mutationFn: deleteAssignment,
        onSuccess: () => {
            addToast({ message: t('views.assignmentsManager.deleteSuccess'), type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || t('views.assignmentsManager.deleteError'), type: 'error' });
        }
    });

    const handleOpenAddModal = () => {
        setEditingAssignment(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (assignment: Assignment) => {
        setEditingAssignment(assignment);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t('views.assignmentsManager.deleteConfirm'))) {
            deleteMutation.mutate(id);
        }
    };

    const columns: { accessorKey: Extract<keyof Assignment, string>; header: string; cell?: (value: any, item: Assignment) => ReactNode; enableSorting?: boolean; }[] = useMemo(() => [
        { accessorKey: 'title', header: t('views.assignmentForm.titleLabel') },
        { accessorKey: 'course', header: t('views.assignmentForm.courseLabel') },
        { accessorKey: 'dueDate', header: t('views.assignmentForm.dueDateLabel'), cell: (date) => new Date(date).toLocaleDateString() },
        { accessorKey: 'maxPoints', header: t('views.assignmentForm.maxPointsLabel') },
        {
            accessorKey: 'id',
            header: t('views.assignmentsManager.actionsHeader'),
            enableSorting: false,
            cell: (id, assignment) => (
                <div className="flex gap-2">
                    <Link to={`/school-hub/academics/assignments/${id}/submissions`} className="p-1 text-brand-text-alt hover:text-brand-primary" title="View Submissions">
                        <Eye className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleOpenEditModal(assignment)} className="p-1 text-brand-text-alt hover:text-brand-primary" title="Edit">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(id)} className="p-1 text-brand-text-alt hover:text-red-500" title="Delete">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ], [t]);

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.assignmentsManager.title')}</h1>
            <DataTable 
                data={data?.rows ?? []} 
                columns={columns}
                pageCount={data?.pageCount ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                onAdd={handleOpenAddModal}
                addLabel={t('views.assignmentsManager.addAssignment')}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isLoading={isLoading}
                emptyState={{
                    icon: ClipboardList,
                    title: t('views.assignmentsManager.emptyTitle'),
                    description: t('views.assignmentsManager.emptyDescription'),
                }}
            />
            <AssignmentFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                assignmentToEdit={editingAssignment}
            />
        </div>
    );
};

export default AssignmentsManager;