

import React, { lazy, Suspense, useState, useMemo, ReactNode } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import EmptyState from '../EmptyState';
import { getDirectoryStaff, getDirectoryPartners } from '../../api/appModulesApi';
import DataTable from '../../components/ui/DataTable';
import { Loader2, Users, Handshake } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import * as schemas from '../../api/schemas/appModulesSchemas';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { PaginatedResponse } from '@/types';

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

type DirectoryStaff = z.infer<typeof schemas.directoryStaffSchema>;
type DirectoryPartner = z.infer<typeof schemas.directoryPartnerSchema>;

const StaffDirectory = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');
    
    const { data, isLoading } = useQuery<PaginatedResponse<DirectoryStaff>>({ 
        queryKey: ['directoryStaff', pagination, sorting, globalFilter], 
        queryFn: () => getDirectoryStaff({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });
    
    const columns: { accessorKey: Extract<keyof DirectoryStaff, string>; header: string; }[] = useMemo(() => [ { accessorKey: 'name', header: 'Name'}, { accessorKey: 'role', header: 'Role'}, { accessorKey: 'email', header: 'Email'}], []);

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
                emptyState={{
                    icon: Users,
                    title: "No Staff in Directory",
                    description: "When staff members are added, they will appear here."
                }}
            />;
};
const PartnersDirectory = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');

    const { data, isLoading } = useQuery<PaginatedResponse<DirectoryPartner>>({ 
        queryKey: ['directoryPartners', pagination, sorting, globalFilter], 
        queryFn: () => getDirectoryPartners({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });
   
    const columns: { accessorKey: Extract<keyof DirectoryPartner, string>; header: string; }[] = useMemo(() => [ { accessorKey: 'name', header: 'Partner'}, { accessorKey: 'type', header: 'Type'}, { accessorKey: 'contact', header: 'Contact'}], []);

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
                emptyState={{
                    icon: Handshake,
                    title: "No Partners in Directory",
                    description: "When partners are added, they will appear here."
                }}
            />;
};

const DirectoriesRouter: React.FC = () => {
    const { l1_id, l2_id } = useParams();

    if (l1_id === 'staff' && l2_id === 'all-staff') return <StaffDirectory />;
    if (l1_id === 'partners' && l2_id === 'all-partners') return <PartnersDirectory />;
    
    return <EmptyState message={`The ${l1_id} > ${l2_id} directory is coming soon.`} />;
}

const ProviderDirectoriesView: React.FC = () => {
    return (
         <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route index element={<Navigate to="staff/all-staff" replace />} />
                <Route path=":l1_id/:l2_id" element={<DirectoriesRouter />} />
            </Routes>
        </Suspense>
    );
};

export default ProviderDirectoriesView;