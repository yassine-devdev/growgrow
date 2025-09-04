import React, { useState, useMemo, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmailTemplates, deleteEmailTemplate } from '@/api/appModulesApi';
import type { EmailTemplate } from '@/api/schemas/appModulesSchemas';
import DataTable from '@/components/ui/DataTable';
import EmailTemplateFormModal from './EmailTemplateFormModal';
import { Loader2, Edit, Trash2, Notebook } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const TemplatesManager: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

    // DataTable state
    const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
    const [globalFilter, setGlobalFilter] = useState('');

    const { data: templates = [], isLoading } = useQuery<EmailTemplate[]>({
        queryKey: ['emailTemplates'],
        queryFn: getEmailTemplates,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteEmailTemplate,
        onSuccess: () => {
            addToast({ message: 'Template deleted successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to delete template', type: 'error' });
        }
    });

    const handleOpenAddModal = () => {
        setEditingTemplate(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (template: EmailTemplate) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            deleteMutation.mutate(id);
        }
    };
    
    // Client-side filtering and sorting
    const filteredAndSortedData = useMemo(() => {
        let filteredData = [...templates];
    
        if (globalFilter) {
            filteredData = filteredData.filter(template =>
                template.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
                template.subject.toLowerCase().includes(globalFilter.toLowerCase())
            );
        }
    
        if (sorting.length > 0) {
            const sortKey = sorting[0].id as keyof EmailTemplate;
            const sortDesc = sorting[0].desc;
            filteredData.sort((a, b) => {
                const valA = a[sortKey];
                const valB = b[sortKey];
                if (valA < valB) return sortDesc ? 1 : -1;
                if (valA > valB) return sortDesc ? -1 : 1;
                return 0;
            });
        }
    
        return filteredData;
    }, [templates, globalFilter, sorting]);
    
    const pageCount = Math.ceil(filteredAndSortedData.length / pagination.pageSize);
    const paginatedData = filteredAndSortedData.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
    );

    const columns: { accessorKey: Extract<keyof EmailTemplate, string>; header: string; cell?: (value: any, item: EmailTemplate) => ReactNode; enableSorting?: boolean; }[] = useMemo(() => [
        { accessorKey: 'name', header: 'Template Name' },
        { accessorKey: 'subject', header: 'Subject' },
        { 
            accessorKey: 'id', 
            header: 'Actions', 
            enableSorting: false,
            cell: (id: string, item: EmailTemplate) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpenEditModal(item)} className="p-1 text-brand-text-alt hover:text-brand-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(id)} className="p-1 text-brand-text-alt hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ], []);

    return (
        <>
            <div className="h-full flex flex-col gap-4">
                <DataTable 
                    data={paginatedData}
                    columns={columns}
                    pageCount={pageCount}
                    pagination={pagination}
                    setPagination={setPagination}
                    sorting={sorting}
                    setSorting={setSorting}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    onAdd={handleOpenAddModal}
                    addLabel={t('views.emailTemplateManager.addTemplate')}
                    isLoading={isLoading}
                    emptyState={{
                        icon: Notebook,
                        title: t('views.emailTemplateManager.noTemplatesTitle'),
                        description: t('views.emailTemplateManager.noTemplatesDescription'),
                    }}
                />
            </div>
            <EmailTemplateFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                templateToEdit={editingTemplate}
            />
        </>
    );
};

export default TemplatesManager;
