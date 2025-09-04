/**
 * Builds a standard API URL with parameters for pagination, sorting, and filtering.
 * @param base - The base endpoint (e.g., '/users/admins').
 * @param options - An object containing pagination, sorting, and filter states.
 * @returns A fully constructed URL string.
 */
export const buildApiUrl = (base: string, options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }) => {
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