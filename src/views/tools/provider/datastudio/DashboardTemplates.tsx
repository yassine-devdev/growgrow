import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardTemplates } from '@/api/appModulesApi';
import { Loader2, LayoutDashboard } from 'lucide-react';
import type { DashboardTemplate } from '@/api/schemas/appModulesSchemas';

interface DashboardTemplatesProps {
    onUseTemplate: (config: any) => void;
}

const DashboardTemplates: React.FC<DashboardTemplatesProps> = ({ onUseTemplate }) => {
    const { data: templates, isLoading } = useQuery<DashboardTemplate[]>({
        queryKey: ['dashboardTemplates'],
        queryFn: getDashboardTemplates,
    });

    if (isLoading) {
        return <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto my-10" />;
    }

    return (
        <div className="space-y-4">
             <h2 className="text-xl font-bold text-brand-text">Start from a Template</h2>
             <p className="text-brand-text-alt">Select a pre-configured dashboard to get started quickly.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates?.map(template => (
                    <div key={template.id} className="p-4 bg-brand-surface border border-brand-border rounded-lg flex flex-col">
                        <LayoutDashboard className="w-8 h-8 text-brand-primary mb-3" />
                        <h3 className="font-bold text-lg text-brand-text">{template.name}</h3>
                        <p className="text-sm text-brand-text-alt flex-1 my-2">{template.description}</p>
                        <button 
                            onClick={() => onUseTemplate(template.config)}
                            className="w-full mt-4 py-2 text-sm font-semibold rounded-md bg-brand-primary hover:bg-brand-primary-hover text-white"
                        >
                            Use Template
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardTemplates;