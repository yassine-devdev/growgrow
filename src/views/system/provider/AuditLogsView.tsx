import React, { useState, useMemo, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuditLogs } from "@/api/appModulesApi";
import type { AuditLog } from "@/api/schemas/appModulesSchemas";
import type { PaginatedResponse } from "@/types/index.ts";
import DataTable from "@/components/ui/DataTable";
import {
  Loader2,
  ShieldCheck,
  User,
  Edit,
  Trash2,
  Key,
  type LucideIcon,
  Info,
} from "lucide-react";
import { QUERY_KEYS } from "@/constants/queries";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import Modal from "@/components/ui/Modal";
import safeStringify from "@/utils/safeStringify";

const getActionIcon = (action: string): React.ElementType => {
  const lowerCaseAction = action.toLowerCase();
  if (lowerCaseAction.includes("delete")) return Trash2;
  if (lowerCaseAction.includes("update") || lowerCaseAction.includes("change"))
    return Edit;
  if (
    lowerCaseAction.includes("generate") ||
    lowerCaseAction.includes("create")
  )
    return Key;
  return User;
};

const AuditLogDetailsModal: React.FC<{
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ log, isOpen, onClose }) => {
  if (!log) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Audit Log Details">
      <div className="space-y-4 text-sm">
        {Object.entries(log).map(([key, value]) => (
          <div key={key}>
            <p className="font-semibold text-brand-text capitalize">{key}</p>
            <pre className="mt-1 p-2 bg-brand-surface-alt rounded-md text-brand-text-alt whitespace-pre-wrap break-words">
              {typeof value === "object" && value !== null
                ? safeStringify(value, 2)
                : String(value)}
            </pre>
          </div>
        ))}
      </div>
    </Modal>
  );
};

const AuditLogsView: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "timestamp", desc: true },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery<PaginatedResponse<AuditLog>>({
    queryKey: [QUERY_KEYS.auditLogs, pagination, sorting, globalFilter],
    queryFn: () =>
      getAuditLogs({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize, // This is now correct
        search: globalFilter,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? "desc" : "asc",
      }),
    placeholderData: (previousData) => previousData,
  });

  const handleRowClick = (log: AuditLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "timestamp",
        header: "Timestamp",
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
      },
      {
        accessorKey: "actor",
        header: "Actor",
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }: { row: { original: AuditLog } }) => {
          const actionValue = row.original.action;
          const Icon = getActionIcon(actionValue);
          return (
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-brand-text-alt" />
              <span>{actionValue}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "ipAddress",
        header: "IP Address",
      },
      {
        id: "actions",
        header: "Details",
        cell: ({ row }: { row: { original: AuditLog } }) => (
          <button
            onClick={() => handleRowClick(row.original)}
            className="p-1 text-brand-text-alt hover:text-brand-primary"
            aria-label="View log details"
          >
            <Info className="w-4 h-4" />
          </button>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  if (isLoading && !data) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-brand-text">
        Platform Audit Logs
      </h1>
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
        emptyState={{
          icon: ShieldCheck,
          title: "No Audit Logs Found",
          description:
            "System actions and events will be logged here for security and troubleshooting.",
        }}
      />
      <AuditLogDetailsModal
        log={selectedLog}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AuditLogsView;
