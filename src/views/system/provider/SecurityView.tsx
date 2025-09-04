import React, { lazy, Suspense, useMemo, ReactNode, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import EmptyState from '@/views/EmptyState';
import { useQuery } from '@tanstack/react-query';
import { getSecurityRoles } from '@/api/appModulesApi';
import type { PaginatedResponse } from '@/types';
import type { SecurityRole } from '@/api/schemas/appModulesSchemas';
import DataTable from '@/components/ui/DataTable';
import { QUERY_KEYS } from '@/constants/queries';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import type { PaginationState, SortingState } from '@tanstack/react-table';

const AuthSettings = lazy(() => import('./AuthSettings'));

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

const RolesPermissionsView: React.FC = () => {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const { data, isLoading } = useQuery<PaginatedResponse<SecurityRole>>({ 
        queryKey: [QUERY_KEYS.securityRoles, pagination, sorting, globalFilter], 
        queryFn: () => getSecurityRoles({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (prev) => prev
    });
    
    const columns: { accessorKey: Extract<keyof SecurityRole, string>; header: string; cell?: (value: any, item: SecurityRole) => ReactNode; }[] = useMemo(() => [
        { accessorKey: 'name', header: 'Role' },
        { accessorKey: 'permissions', header: 'Permissions Count' }
    ], []);

    return <DataTable 
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
            />;
};


const SecurityView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route index element={<Navigate to="roles-permissions" replace />} />
                <Route path="roles-permissions" element={<RolesPermissionsView />} />
                <Route path="authentication" element={<AuthSettings />} />
                <Route path="sso-configuration" element={<EmptyState message="Single Sign-On (SSO) provider configuration is coming soon." />} />
                <Route path="mfa-settings" element={<EmptyState message="Multi-Factor Authentication (MFA) settings and enforcement rules are coming soon." />} />
                <Route path="security-policies" element={<EmptyState message="Advanced security policies, such as password complexity and IP restrictions, are coming soon." />} />
            </Routes>
        </Suspense>
    );
};

export default SecurityView;