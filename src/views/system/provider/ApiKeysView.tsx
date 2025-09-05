import React, { lazy, Suspense, useMemo, ReactNode, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import EmptyState from "@/views/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { getApiKeys } from "@/api/appModulesApi";
import type { PaginatedResponse } from "@/types";
import type { ApiKey } from "@/api/schemas/appModulesSchemas";
import DataTable from "@/components/ui/DataTable";
import { QUERY_KEYS } from "@/constants/queries";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import type { PaginationState, SortingState } from "@tanstack/react-table";

const ApiKeyAnalytics = lazy(() => import("./ApiKeyAnalytics"));

const LoadingSpinner = () => (
  <div className="w-full h-full flex items-center justify-center">
    <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
  </div>
);

const KeyManagementView: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { data, isLoading } = useQuery<PaginatedResponse<ApiKey>>({
    queryKey: [QUERY_KEYS.apiKeys, pagination, sorting, globalFilter],
    queryFn: () =>
      getApiKeys({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        globalFilter,
      }),
    placeholderData: (prev) => prev,
  });

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Key Name" },
      { accessorKey: "lastUsed", header: "Last Used" },
      { accessorKey: "status", header: "Status" },
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

const ApiKeysView: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route index element={<Navigate to="key-management" replace />} />
        <Route path="key-management" element={<KeyManagementView />} />
        <Route path="key-analytics" element={<ApiKeyAnalytics />} />
        <Route
          path="key-permissions"
          element={
            <EmptyState message="Granular API key permission management is coming soon." />
          }
        />
        <Route
          path="key-rotation"
          element={
            <EmptyState message="Automated API key rotation policies will be available here." />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default ApiKeysView;
