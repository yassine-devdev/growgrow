import React, { useMemo, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLegalDocuments } from '@/api/appModulesApi';
import { QUERY_KEYS } from '@/constants/queries';
import type { LegalDocument } from '@/api/schemas/appModulesSchemas';
import type { PaginatedResponse } from '@/types';
import { Loader2, Gavel, Upload, Eye } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const DocumentDetailsModal: React.FC<{
  doc: LegalDocument | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ doc, isOpen, onClose }) => {
  if (!doc) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={doc.name}>
      <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>
            <strong>Version:</strong> {doc.version}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(doc.lastUpdated).toLocaleString()}
          </p>
          <hr className="my-4" />
          <div dangerouslySetInnerHTML={{ __html: doc.content }} />
        </div>
      </div>
    </Modal>
  );
};

const LegalComplianceView: React.FC = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading } = useQuery<PaginatedResponse<LegalDocument>>({
        queryKey: [QUERY_KEYS.legalDocuments, pagination, sorting, globalFilter],
        queryFn: () => getLegalDocuments({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting, globalFilter }),
        placeholderData: (prev) => prev
    });

    const columns: { accessorKey: Extract<keyof LegalDocument, string>; header: string; cell?: (value: any, item: LegalDocument) => ReactNode; enableSorting?: boolean; }[] = useMemo(() => [
        { accessorKey: 'name', header: 'Document Name' },
        { accessorKey: 'version', header: 'Version' },
        { accessorKey: 'lastUpdated', header: 'Last Updated', cell: (value: string) => new Date(value).toLocaleDateString() },
        {
            accessorKey: 'id',
            header: 'Actions',
            enableSorting: false,
            cell: (id: string) => (
                <div className="flex gap-2">
                    <button className="p-1 text-brand-text-alt hover:text-brand-primary"><Eye className="w-4 h-4" /></button>
                    <button className="p-1 text-brand-text-alt hover:text-brand-primary"><Upload className="w-4 h-4" /></button>
                </div>
            )
        }
    ], []);
    
    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Legal & Compliance</h1>
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
                onAdd={() => {}}
                addLabel="Upload Document"
                isLoading={isLoading}
                emptyState={{
                    icon: Gavel,
                    title: "No Legal Documents",
                    description: "Upload your Terms of Service, Privacy Policy, and other legal documents here."
                }}
            />
            <DocumentDetailsModal
                doc={selectedDoc}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default LegalComplianceView;