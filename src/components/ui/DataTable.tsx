import React, { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import DataEmptyState from "./DataEmptyState";
import type { LucideIcon } from "lucide-react";
import Skeleton from "./Skeleton";
import safeStringify from "@/utils/safeStringify";

interface DataTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
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
  onRowClick?: (row: T) => void;
}

const DataTable = <T extends object>({
  data: tableData,
  columns,
  pageCount,
  pagination,
  setPagination,
  sorting,
  setSorting,
  globalFilter,
  setGlobalFilter,
  emptyState,
  isLoading = false,
  onRowClick,
}: DataTableProps<T>) => {
  const { t } = useTranslation();
  const data = useMemo(
    () => (isLoading ? [] : tableData),
    [isLoading, tableData]
  );

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { pagination, sorting, globalFilter },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="datatable-search" className="sr-only">
            {t("datatable.searchPlaceholder")}
          </label>
          <input
            id="datatable-search"
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={t("datatable.searchPlaceholder")}
            className="w-full bg-brand-surface border border-brand-border rounded-lg p-2 pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-alt"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto border border-brand-border rounded-lg">
        <table className="w-full min-w-[768px] text-sm text-left text-brand-text">
          <thead className="text-xs text-brand-text-alt uppercase bg-brand-surface-alt sticky top-0">
            <tr>
              {table.getFlatHeaders().map((header) => (
                <th key={header.id} scope="col" className="px-6 py-3">
                  <div
                    className={
                      header.column.getCanSort()
                        ? "flex items-center gap-1 transition-colors hover:text-brand-text cursor-pointer"
                        : ""
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: <ArrowUp className="w-3 h-3" />,
                      desc: <ArrowDown className="w-3 h-3" />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: pagination.pageSize }).map((_, i) => (
                <tr
                  key={`skeleton-${i}`}
                  className="bg-brand-surface border-b border-brand-border"
                >
                  {table.getFlatHeaders().map((header) => (
                    <td key={header.id} className="px-6 py-4">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={`bg-brand-surface border-b border-brand-border hover:bg-brand-surface-alt/50 ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-4">
                  {globalFilter ? (
                    <div className="text-center py-10 text-brand-text-alt">
                      <div className="flex flex-col items-center gap-2">
                        <Search
                          className="w-10 h-10 text-gray-300"
                          aria-hidden="true"
                        />
                        <h3 className="font-semibold">
                          {t("datatable.noResults")}
                        </h3>
                        <p className="text-xs max-w-xs">
                          {t("datatable.noResultsDescription")}
                        </p>
                      </div>
                    </div>
                  ) : emptyState ? (
                    <DataEmptyState
                      icon={emptyState.icon}
                      title={emptyState.title}
                      description={emptyState.description}
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
          {t("datatable.pageInfo", {
            currentPage: table.getState().pagination.pageIndex + 1,
            totalPages: table.getPageCount() > 0 ? table.getPageCount() : 1,
          })}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-md hover:bg-brand-surface-alt disabled:opacity-50"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
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
