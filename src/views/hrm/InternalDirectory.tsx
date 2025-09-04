import React, { useState, useMemo, ReactNode } from 'react';
import { getTeamMembers } from '@/api/hrmApi';
import type { TeamMember } from '@/api/schemas/hrmSchemas';
import type { PaginatedResponse } from '@/types';
import DataTable from '@/components/ui/DataTable';
import { Loader2, UsersRound, Edit, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { useAppStore } from '@/store/useAppStore';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { QUERY_KEYS } from '@/constants/queries';

const StatusBadge: React.FC<{ status: TeamMember['status'] }> = ({ status }) => {
    const colorMap = {
        Active: 'bg-green-100 text-green-800',
        Invited: 'bg-blue-100 text-blue-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>{status}</span>;
}

const InternalDirectory: React.FC = () => {
    const { t } = useTranslation();
    const addToast = useAppStore(s => s.addToast);
    
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');

    const { data, isLoading } = useQuery<PaginatedResponse<TeamMember>>({
        queryKey: [QUERY_KEYS.hrmTeamMembers, pagination, sorting, globalFilter],
        queryFn: () => getTeamMembers({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });
    
    const handleAdd = () => addToast({ message: 'Invite member functionality is coming soon.', type: 'info' });

    const columns: { accessorKey: Extract<keyof TeamMember, string>; header: string; cell?: (value: any, item: TeamMember) => ReactNode }[] = useMemo(() => [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'role', header: 'Role' },
        { accessorKey: 'status', header: 'Status', cell: (status) => <StatusBadge status={status} /> },
        { accessorKey: 'joinedDate', header: 'Joined Date', cell: (date) => new Date(date).toLocaleDateString() },
        {
            accessorKey: 'id',
            header: 'Actions',
            cell: (id, member) => (
                <div className="flex gap-2">
                    <button className="p-1 text-brand-text-alt hover:text-brand-primary"><Edit className="w-4 h-4" /></button>
                    <button className="p-1 text-brand-text-alt hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ], []);

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Internal Team Directory</h1>
            <DataTable 
                data={data?.rows ?? []} 
                columns={columns}
                pageCount={data?.pageCount ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                onAdd={handleAdd}
                addLabel="Invite Member"
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isLoading={isLoading}
                emptyState={{
                    icon: UsersRound,
                    title: "No Team Members",
                    description: "Invite your first team member to manage the platform.",
                }}
            />
        </div>
    );
};

export default InternalDirectory;
