import React, { lazy, Suspense, useMemo, ReactNode, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import EmptyState from "@/views/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { getBackups } from "@/api/appModulesApi";
import type { PaginatedResponse } from "@/types";
import type { Backup } from "@/api/schemas/appModulesSchemas";
import DataTable from "@/components/ui/DataTable";
import { QUERY_KEYS } from "@/constants/queries";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import type { PaginationState, SortingState } from "@tanstack/react-table";

const BackupConfigView = lazy(() => import("./BackupConfigView"));

const LoadingSpinner = () => (
  <div className="w-full h-full flex items-center justify-center">
    <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
  </div>
);

const BackupHistoryView: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { data, isLoading } = useQuery<PaginatedResponse<Backup>>({
    queryKey: [QUERY_KEYS.backups, pagination, sorting, globalFilter],
    queryFn: () =>
      getBackups({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        globalFilter,
      }),
    placeholderData: (prev) => prev,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }: { getValue: () => string }) =>
          new Date(getValue()).toLocaleString(),
      },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "size", header: "Size" },
    ],
    []
  );

  return (
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
  );
};

const BackupRecoveryView: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route index element={<Navigate to="backup-configuration" replace />} />
        <Route path="backup-configuration" element={<BackupConfigView />} />
        <Route path="backup-history" element={<BackupHistoryView />} />
        <Route
          path="recovery-plans"
          element={
            <EmptyState message="Disaster recovery plan management is coming soon." />
          }
        />
        <Route
          path="restore-tools"
          element={
            <EmptyState message="Point-in-time restore tools will be available here." />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default BackupRecoveryView;
