

import React, { lazy, Suspense, useState, useMemo } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { getBookings, getOrders } from '../../api/individualApi';
import { Loader2 } from 'lucide-react';
import EmptyState from '../EmptyState';
import DataTable from '../../components/ui/DataTable';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import * as schemas from '../../api/schemas/individualSchemas';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { PaginatedResponse } from '@/types';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

type Booking = z.infer<typeof schemas.bookingSchema>;
type Order = z.infer<typeof schemas.orderSchema>;

const Bookings = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');

    const { data, isLoading } = useQuery<PaginatedResponse<Booking>>({ 
        queryKey: ['bookings', pagination, sorting, globalFilter], 
        queryFn: () => getBookings({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });
    
    const columns: { accessorKey: Extract<keyof Booking, string>; header: string; }[] = useMemo(() => [{accessorKey: 'service', header: 'Service'}, {accessorKey: 'date', header: 'Date'}, {accessorKey: 'status', header: 'Status'}], []);
    if (isLoading && !data) return <LoadingSpinner />;
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">My Bookings</h2>
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
            />
        </div>
    );
}

const Orders = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');

    const { data, isLoading } = useQuery<PaginatedResponse<Order>>({ 
        queryKey: ['orders', pagination, sorting, globalFilter], 
        queryFn: () => getOrders({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (previousData) => previousData,
    });

    const columns: { accessorKey: Extract<keyof Order, string>; header: string; }[] = useMemo(() => [{accessorKey: 'item', header: 'Item'}, {accessorKey: 'date', header: 'Date'}, {accessorKey: 'status', header: 'Status'}], []);
    if (isLoading && !data) return <LoadingSpinner />;
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">My Orders</h2>
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
            />
        </div>
    );
}

const L2Routes: React.FC = () => {
    const { l2_id } = useParams();
    switch (l2_id) {
        case 'bookings': return <Bookings />;
        case 'my-orders': return <Orders />;
        default: return <EmptyState message="Unknown option" />;
    }
}

const PersonalHubView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route index element={<Navigate to="lifestyle/bookings" replace />} />
                <Route path=":l1_id/:l2_id" element={<L2Routes />} />
            </Routes>
        </Suspense>
    );
};

export default PersonalHubView;