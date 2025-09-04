import { PaginatedResponse } from '../../../../types';

// Helper for pagination
export const paginate = <T>(items: T[], page: number, pageSize: number, totalCount: number): PaginatedResponse<T> => {
    const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);
    return {
        rows: paginatedItems,
        pageCount: Math.ceil(totalCount / pageSize),
        rowCount: totalCount,
    };
};
