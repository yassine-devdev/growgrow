import React, { useState, useMemo, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAssignments } from '@/api/schoolHubApi';
import type { Assignment } from '@/api/schemas/schoolHubSchemas';
import type { PaginatedResponse } from '@/types/index.ts';
import DataTable from '@/components/ui/DataTable';
import { Loader2, ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { Link } from 'react-router-dom';

const StatusBadge = ({ status }: { status: Assignment['status'] }) => {
    if (!status) return null;
    const colorMap = {
        'Graded': 'bg-green-100 text-green-800',
        'Submitted': 'bg-blue-100 text-blue-800',
        'Not Submitted': 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>{status}</span>;
};

const StudentAssignments: React.FC = () => {
    const { t } = useTranslation();
    
    // State for the data table
    const [sorting, setSorting] = useState<SortingState>([{ id: 'dueDate', desc: false }]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: DEFAULT_PAGE_SIZE,
    });
    const [globalFilter, setGlobalFilter] = useState('');

    const { data, isLoading } = useQuery<PaginatedResponse<Assignment>>({
        queryKey: ['student_assignments', pagination, sorting, globalFilter],
        queryFn: () => getAssignments({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });
    
    const columns: { accessorKey: Extract<keyof Assignment, string>; header: string; cell?: (value: any, item: Assignment) => ReactNode; enableSorting?: boolean; }[] = useMemo(() => [
        { 
            accessorKey: 'title', 
            header: t('views.assignmentForm.titleLabel'),
            cell: (title, assignment) => (
                <Link to={`/school-hub/academics/assignments/${assignment.id}`} className="font-medium text-brand-primary hover:underline">
                    {title}
                </Link>
            )
        },
        { accessorKey: 'course', header: t('views.assignmentForm.courseLabel') },
        { accessorKey: 'dueDate', header: t('views.assignmentForm.dueDateLabel'), cell: (date) => new Date(date).toLocaleDateString() },
        { accessorKey: 'status', header: t('views.studentAssignments.statusHeader'), cell: (status) => <StatusBadge status={status} /> },
    ], [t]);

    if (isLoading && !data) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.studentAssignments.title')}</h1>
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
                isLoading={isLoading}
                emptyState={{
                    icon: ClipboardList,
                    title: "No Assignments Found",
                    description: "Your teachers haven't posted any assignments yet. Check back soon!",
                }}
            />
        </div>
    );
};

export default StudentAssignments;