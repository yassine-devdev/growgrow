import React from 'react';
import { useQuery } from '@tanstack/react-query';
// FIX: Import correct API function for Studio data
import { getStudioOfficeDocs } from '@/api/appModulesApi';
import { Loader2, FileText, FileSpreadsheet, Presentation, Folder, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const docIcons = {
    document: FileText,
    spreadsheet: FileSpreadsheet,
    presentation: Presentation
};

const Office: React.FC = () => {
    const { t } = useTranslation();
    const { data: docs, isLoading } = useQuery({ queryKey: ['studioOfficeDocs'], queryFn: getStudioOfficeDocs });

    return (
        <div className="p-6 flex flex-col h-full">
            <header className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-brand-text">Office Suite</h3>
                <button className="px-4 py-2 text-sm bg-brand-primary text-white rounded-md flex items-center gap-2"><Plus className="w-4 h-4"/> New Document</button>
            </header>
            <div className="flex-1 overflow-y-auto pr-2">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-brand-text-alt uppercase bg-brand-surface-alt">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Last Modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={3} className="text-center p-8"><Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto" /></td></tr>
                        ) : (
                            // FIX: Ensure docs is an array before mapping
                            Array.isArray(docs) && docs.map(doc => {
                                const Icon = docIcons[doc.type as keyof typeof docIcons];
                                return (
                                <tr key={doc.id} className="border-b border-brand-border hover:bg-brand-surface-alt/50">
                                    <td className="p-3 font-medium flex items-center gap-2">
                                        <Icon className="w-5 h-5 text-brand-primary" />
                                        {doc.name}
                                    </td>
                                    <td className="p-3 capitalize">{doc.type}</td>
                                    <td className="p-3 text-brand-text-alt">{doc.lastModified}</td>
                                </tr>
                            )})
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Office;