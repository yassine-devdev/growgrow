import * as schemas from '@/api/schemas/individualSchemas';
import type { Product } from '@/types/index.ts';
import { apiClient } from './apiClient';
import { PaginatedResponse } from '@/types';
import type { BookingRequest } from './schemas/individualSchemas';


const buildApiUrl = (base: string, options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }) => {
    const params = new URLSearchParams({
        page: String(options.pageIndex + 1),
        pageSize: String(options.pageSize),
    });
    if (options.sorting.length > 0) {
        params.append('sortBy', options.sorting[0].id);
        params.append('order', options.sorting[0].desc ? 'desc' : 'asc');
    }
    if (options.globalFilter) {
        params.append('search', options.globalFilter);
    }
    return `${base}?${params.toString()}`;
};

export const getBookings = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<schemas.Booking>> => {
    return apiClient(buildApiUrl('/individual/bookings', options));
};

export const addBooking = (data: BookingRequest): Promise<schemas.Booking> => {
    return apiClient('/individual/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const getOrders = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<schemas.Order>> => {
    return apiClient(buildApiUrl('/individual/orders', options));
};

export const getEnrolledCourses = async (): Promise<{id: string, name: string}[]> => {
    return apiClient('/individual/enrolled-courses');
};

export const getSuggestedProducts = async (courseIds: string[]): Promise<Product[]> => {
    return apiClient('/individual/suggested-products', {
        method: 'POST',
        body: JSON.stringify({ courseIds })
    });
};