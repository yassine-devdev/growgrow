import React from 'react';
import { ChevronLeft, ChevronRight, Search, ArrowUp, ArrowDown, UserPlus, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import DataEmptyState from './DataEmptyState';
import type { LucideIcon } from 'lucide-react';
import Skeleton from './Skeleton';

interface DataTableProps<T extends object> {
    data: T[];
    columns: {
        accessorKey: Extract<keyof T, string>;
        header: string;
        cell?: (value: T[keyof T], item: T) => React.ReactNode;
        enableSorting?: boolean;
    }[];
    pageCount: number;
    pagination: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    sorting: SortingState;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    onAdd?: () => void;
    addLabel?: string;
    onExport?: () => void;
    exportLabel?: string;
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    emptyState?: {
        icon: LucideIcon;
        title: string;
        description: string;
    };
    isLoading?: boolean;
}

const DataTable = <T extends object>({ 
    data, 
    columns,
    pageCount,
    pagination,
    setPagination,
    sorting,
    setSorting,
    onAdd,
    addLabel,
    onExport,
    exportLabel,
    globalFilter,
    setGlobalFilter,
    emptyState,
    isLoading = false
}: DataTableProps<T>) => {
    const { t } = useTranslation();

    const handleSort = (key: Extract<keyof T, string>) => {
        const isDesc = sorting.length > 0 && sorting[0].id === key && sorting[0].desc;
        setSorting(isDesc ? [] : [{ id: key, desc: !isDesc }]);
    };
    
    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
             <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="relative w-full sm:max-w-sm">
                    <label htmlFor="datatable-search" className="sr-only">{t('datatable.searchPlaceholder')}</label>
                    <input
                        id="datatable-search"
                        type="text"
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder={t('datatable.searchPlaceholder')}
                        className="w-full bg-brand-surface border border-brand-border rounded-lg p-2 pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-alt" aria-hidden="true"/>
                </div>
                 <div className="w-full sm:w-auto flex flex-col sm:flex-row-reverse gap-2">
                    {onAdd && (
                        <button onClick={onAdd} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover">
                            <UserPlus className="w-4 h-4" />
                            {addLabel || 'Add New'}
                        </button>
                    )}
                     {onExport && (
                        <button onClick={onExport} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 border border-brand-border text-sm font-medium rounded-md text-brand-text bg-brand-surface hover:bg-brand-surface-alt">
                            <Download className="w-4 h-4" />
                            {exportLabel || 'Export'}
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto border border-brand-border rounded-lg">
                <table className="w-full min-w-[768px] text-sm text-left text-brand-text">
                    <thead className="text-xs text-brand-text-alt uppercase bg-brand-surface-alt sticky top-0">
                        <tr>
                            {columns.map(col => (
                                <th key={String(col.accessorKey)} scope="col" className="px-6 py-3">
                                    <button
                                        onClick={() => col.enableSorting !== false && handleSort(col.accessorKey)}
                                        className={`flex items-center gap-1 transition-colors ${col.enableSorting !== false ? 'hover:text-brand-text cursor-pointer' : 'cursor-default'}`}
                                    >
                                        {col.header}
                                        {sorting[0]?.id === col.accessorKey ? (
                                            sorting[0].desc ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                                        ) : null}
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                             Array.from({ length: pagination.pageSize }).map((_, i) => (
                                <tr key={`skeleton-${i}`} className="bg-brand-surface border-b border-brand-border">
                                    {columns.map(col => (
                                        <td key={String(col.accessorKey)} className="px-6 py-4">
                                            <Skeleton className="h-5 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length > 0 ? data.map((item, index) => (
                            <tr key={(item as any).id || index} className="bg-brand-surface border-b border-brand-border hover:bg-brand-surface-alt/50">
                                {columns.map(col => {
                                    const cellValue = item[col.accessorKey];
                                    const cellContent = col.cell 
                                        ? col.cell(cellValue, item) 
                                        : (cellValue !== null && typeof cellValue === 'object' 
                                            ? JSON.stringify(cellValue) 
                                            : String(cellValue ?? ''));
                                    
                                    return (
                                        <td key={String(col.accessorKey)} className="px-6 py-4">
                                            {cellContent}
                                        </td>
                                    );
                                })}
                            </tr>
                        )) : (
                             <tr>
                                <td colSpan={columns.length} className="p-4">
                                     {globalFilter ? (
                                        <div className="text-center py-10 text-brand-text-alt">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search className="w-10 h-10 text-gray-300" aria-hidden="true"/>
                                                <h3 className="font-semibold">{t('datatable.noResults')}</h3>
                                                <p className="text-xs max-w-xs">{t('datatable.noResultsDescription')}</p>
                                            </div>
                                        </div>
                                     ) : emptyState ? (
                                        <DataEmptyState
                                            icon={emptyState.icon}
                                            title={emptyState.title}
                                            description={emptyState.description}
                                            action={onAdd && addLabel ? { label: addLabel, onClick: onAdd } : undefined}
                                        />
                                     ) : (
                                        <div className="text-center py-10 text-brand-text-alt">
                                            <p>No data available.</p>
                                        </div>
                                     )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4 text-sm text-brand-text-alt">
                <div>
                    {t('datatable.pageInfo', { currentPage: pagination.pageIndex + 1, totalPages: pageCount > 0 ? pageCount : 1 })}
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setPagination(p => ({ ...p, pageIndex: p.pageIndex - 1 }))} 
                        disabled={pagination.pageIndex === 0} 
                        className="p-2 rounded-md hover:bg-brand-surface-alt disabled:opacity-50"
                        aria-label="Go to previous page"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setPagination(p => ({ ...p, pageIndex: p.pageIndex + 1 }))} 
                        disabled={pagination.pageIndex >= pageCount - 1} 
                        className="p-2 rounded-md hover:bg-brand-surface-alt disabled:opacity-50"
                        aria-label="Go to next page"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;