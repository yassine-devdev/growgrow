import React, { useState, useMemo, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/api/appModulesApi';
import type { AuditLog } from '@/api/schemas/appModulesSchemas';
import type { PaginatedResponse } from '@/types/index.ts';
import DataTable from '@/components/ui/DataTable';
import { Loader2, ShieldCheck, User, Edit, Trash2, Key } from 'lucide-react';
import { QUERY_KEYS } from '@/constants/queries';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import type { PaginationState, SortingState } from '@tanstack/react-table';

const getActionIcon = (action: string): React.ElementType => {
    const lowerCaseAction = action.toLowerCase();
    if (lowerCaseAction.includes('delete')) return Trash2;
    if (lowerCaseAction.includes('update') || lowerCaseAction.includes('change')) return Edit;
    if (lowerCaseAction.includes('generate') || lowerCaseAction.includes('create')) return Key;
    return User;
};

const AuditLogsView: React.FC = () => {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'timestamp', desc: true }]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: DEFAULT_PAGE_SIZE,
    });
    const [globalFilter, setGlobalFilter] = useState('');

    const { data, isLoading } = useQuery<PaginatedResponse<AuditLog>>({
        queryKey: [QUERY_KEYS.auditLogs, pagination, sorting, globalFilter],
        queryFn: () => getAuditLogs({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });

    const columns: { accessorKey: Extract<keyof AuditLog, string>; header: string; cell?: (value: any, item: AuditLog) => ReactNode; }[] = useMemo(() => [
        {
            accessorKey: 'timestamp',
            header: 'Timestamp',
            cell: (timestamp) => new Date(timestamp).toLocaleString(),
        },
        {
            accessorKey: 'actor',
            header: 'Actor',
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: (action, item) => {
                const Icon = getActionIcon(action);
                return (
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-brand-text-alt" />
                        <span>{action}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: 'ipAddress',
            header: 'IP Address',
        },
    ], []);

    if (isLoading && !data) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Platform Audit Logs</h1>
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
                    icon: ShieldCheck,
                    title: "No Audit Logs Found",
                    description: "System actions and events will be logged here for security and troubleshooting.",
                }}
            />
        </div>
    );
};

export default AuditLogsView;