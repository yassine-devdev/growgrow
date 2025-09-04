import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDataConnectors } from '@/api/dataStudioApi';
import { Loader2, Database, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
// FIX: Update import path for DataConnector type
import type { DataConnector } from '@/api/schemas/appModulesSchemas';
import DataConnectorFormModal from './DataConnectorFormModal';

const StatusBadge: React.FC<{ status: DataConnector['status'] }> = ({ status }) => {
    const info = {
        Connected: { icon: CheckCircle, color: 'text-green-500' },
        Error: { icon: AlertTriangle, color: 'text-red-500' },
        Syncing: { icon: RefreshCw, color: 'text-blue-500 animate-spin' },
    }[status];

    return (
        <div className={`flex items-center gap-2 text-sm ${info.color}`}>
            <info.icon className="w-4 h-4" />
            <span>{status}</span>
        </div>
    );
};

const DataSourcesView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: connectors, isLoading } = useQuery<DataConnector[]>({
        queryKey: ['dataConnectors'],
        queryFn: getDataConnectors
    });

    if (isLoading) {
        return <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto my-10" />;
    }

    return (
        <>
            <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-text">Data Sources</h2>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-brand-primary text-white rounded-md text-sm"
                    >
                        Add New Source
                    </button>
                 </div>
                 <p className="text-brand-text-alt">Manage your connections to external data sources like databases and analytics platforms.</p>
                 <div className="p-4 border rounded-lg bg-brand-surface">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500 border-b">
                                <th className="p-2">Name</th>
                                <th className="p-2">Type</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Last Synced</th>
                            </tr>
                        </thead>
                        <tbody>
                            {connectors?.map(conn => (
                                <tr key={conn.id} className="border-t">
                                    <td className="p-2 font-semibold">{conn.name}</td>
                                    <td className="p-2">{conn.type}</td>
                                    <td className="p-2"><StatusBadge status={conn.status} /></td>
                                    <td className="p-2">{new Date(conn.lastSync).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
            <DataConnectorFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default DataSourcesView;
