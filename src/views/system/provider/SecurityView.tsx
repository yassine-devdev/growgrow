import React, { lazy, Suspense, useMemo, ReactNode, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2, Info } from "lucide-react";
import EmptyState from "@/views/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { getSecurityRoles } from "@/api/appModulesApi";
import type { PaginatedResponse } from "@/types";
import type { SecurityRole } from "@/api/schemas/appModulesSchemas";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import { QUERY_KEYS } from "@/constants/queries";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import type { PaginationState, SortingState } from "@tanstack/react-table";

const AuthSettings = lazy(() => import("./AuthSettings"));

const RoleDetailsModal: React.FC<{
  role: SecurityRole | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ role, isOpen, onClose }) => {
  if (!role) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Permissions for ${role.name}`}>
      <div className="space-y-2">
        <p className="text-sm text-brand-text-alt">This role has the following permissions:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-brand-text">
          {role.permissions.map((permission) => (
            <li key={permission}>{permission}</li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

const LoadingSpinner = () => (
  <div className="w-full h-full flex items-center justify-center">
    <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
  </div>
);

const RolesPermissionsView: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRole, setSelectedRole] = useState<SecurityRole | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery<PaginatedResponse<SecurityRole>>({
    queryKey: [QUERY_KEYS.securityRoles, pagination, sorting, globalFilter],
    queryFn: () =>
      getSecurityRoles({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        globalFilter,
      }),
    placeholderData: (prev) => prev,
  });

  const handleRowClick = (role: SecurityRole) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Role" },
      {
        accessorKey: "permissions",
        header: "Permissions Count",
        cell: ({ row }: { row: { original: SecurityRole } }) =>
          row.original.permissions.length,
      },
      {
        id: "actions",
        header: "Details",
        cell: ({ row }: { row: { original: SecurityRole } }) => (
          <button
            onClick={() => handleRowClick(row.original)}
            className="p-1 text-brand-text-alt hover:text-brand-primary"
            aria-label={`View permissions for ${row.original.name}`}
          >
            <Info className="w-4 h-4" />
          </button>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  return (
    <>
      <DataTable
        onRowClick={handleRowClick}
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
      <RoleDetailsModal
        role={selectedRole}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

const SecurityView: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route index element={<Navigate to="roles-permissions" replace />} />
        <Route path="roles-permissions" element={<RolesPermissionsView />} />
        <Route path="authentication" element={<AuthSettings />} />
        <Route
          path="sso-configuration"
          element={
            <EmptyState message="Single Sign-On (SSO) provider configuration is coming soon." />
          }
        />
        <Route
          path="mfa-settings"
          element={
            <EmptyState message="Multi-Factor Authentication (MFA) settings and enforcement rules are coming soon." />
          }
        />
        <Route
          path="security-policies"
          element={
            <EmptyState message="Advanced security policies, such as password complexity and IP restrictions, are coming soon." />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default SecurityView;
