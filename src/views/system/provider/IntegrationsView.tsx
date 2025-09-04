import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getIntegrations } from '@/api/appModulesApi';
import { QUERY_KEYS } from '@/constants/queries';
import type { Integration } from '@/api/schemas/appModulesSchemas';
import { Loader2, Plus, Settings } from 'lucide-react';
import EmptyState from '@/views/EmptyState';
import { Routes, Route } from 'react-router-dom';

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

const ThirdPartyApps: React.FC = () => {
    const { data: integrations, isLoading } = useQuery<Integration[]>({
        queryKey: QUERY_KEYS.integrations,
        queryFn: getIntegrations,
    });

    if (isLoading) return <LoadingSpinner />;
    if (!integrations) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map(app => (
                <div key={app.id} className="p-4 bg-brand-surface border border-brand-border rounded-lg flex flex-col">
                    <h3 className="font-bold text-lg text-brand-text">{app.name}</h3>
                    <p className="text-sm text-brand-text-alt flex-1 my-2">{app.category}</p>
                    <div className="flex justify-between items-center mt-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${app.status === 'Connected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {app.status}
                        </span>
                        <button className="text-sm px-3 py-1.5 bg-brand-surface-alt hover:bg-brand-border rounded-md flex items-center gap-1.5">
                            {app.status === 'Connected' ? <Settings className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {app.status === 'Connected' ? 'Manage' : 'Connect'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const IntegrationsView: React.FC = () => {
    // A tabbed interface could be added here in the future.
    // For now, we use routing to display the different integration types.
    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Integrations</h1>
            <Routes>
                <Route path="third-party-apps" element={<ThirdPartyApps />} />
                <Route path="api-integrations" element={<EmptyState message="Management for custom API integrations is coming soon." />} />
                <Route path="webhooks" element={<EmptyState message="Webhook configuration and logs will be available here soon." />} />
                <Route path="data-sync" element={<EmptyState message="Data synchronization settings are coming soon." />} />
                <Route index element={<ThirdPartyApps />} />
            </Routes>
        </div>
    );
};

export default IntegrationsView;
