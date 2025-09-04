
import React from 'react';
import { getActiveIncidents } from '@/api/providerApi';
import type { Incident } from '@/api/schemas/providerMonitoringSchemas';
import { Loader2, TriangleAlert, ShieldCheck, Hourglass, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

/**
 * Returns color and icon information based on an incident's severity.
 * @param {Incident['severity']} severity - The severity level of the incident.
 * @returns {{color: string, icon: React.ElementType}} An object with CSS class and icon component.
 */
const getSeverityInfo = (severity: Incident['severity']) => {
    switch (severity) {
        case 'Critical': return { color: 'text-red-500', icon: TriangleAlert };
        case 'High': return { color: 'text-orange-500', icon: TriangleAlert };
        case 'Medium': return { color: 'text-yellow-500', icon: TriangleAlert };
        case 'Low': return { color: 'text-blue-500', icon: TriangleAlert };
        default: return { color: 'text-gray-500', icon: TriangleAlert };
    }
};

/**
 * Returns color and icon information based on an incident's status.
 * @param {Incident['status']} status - The current status of the incident.
 * @returns {{color: string, icon: React.ElementType}} An object with CSS class and icon component.
 */
const getStatusInfo = (status: Incident['status']) => {
     switch (status) {
        case 'Investigating': return { color: 'bg-yellow-500/20 text-yellow-400', icon: Search };
        case 'Identified': return { color: 'bg-blue-500/20 text-blue-400', icon: Hourglass };
        case 'Monitoring': return { color: 'bg-purple-500/20 text-purple-400', icon: Hourglass };
        case 'Resolved': return { color: 'bg-green-500/20 text-green-400', icon: ShieldCheck };
        default: return { color: 'bg-gray-500/20 text-gray-400', icon: ShieldCheck };
    }
}

/**
 * Renders the 'Incidents' dashboard for the Provider role.
 * It fetches and displays a list of active and recent system incidents,
 * showing their severity and current status.
 *
 * @returns {JSX.Element} The rendered incidents dashboard.
 */
const IncidentsDashboard: React.FC = () => {
    const { data, isLoading } = useQuery<Incident[]>({
        queryKey: ['activeIncidents'],
        queryFn: getActiveIncidents
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (!data) return null;

    return (
        <div className="h-full flex flex-col gap-4">
            <h2 className="text-xl font-bold text-brand-text">Active Incidents</h2>
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-3">
                    {data.map((incident) => {
                        const SeverityIcon = getSeverityInfo(incident.severity).icon;
                        const severityColor = getSeverityInfo(incident.severity).color;
                        const StatusIcon = getStatusInfo(incident.status).icon;
                        const statusColor = getStatusInfo(incident.status).color;
                        
                        return (
                            <div key={incident.id} className="bg-brand-surface border border-brand-border rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <SeverityIcon className={`w-8 h-8 shrink-0 ${severityColor}`} />
                                    <div className="truncate">
                                        <p className="font-bold text-brand-text truncate">{incident.id}: {incident.service}</p>
                                        <p className="text-sm text-brand-text-alt">
                                            Severity: <span className={`font-semibold ${severityColor}`}>{incident.severity}</span>
                                        </p>
                                         <p className="text-xs text-brand-text-alt/80">{new Date(incident.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full shrink-0 ml-4 ${statusColor}`}>
                                    <StatusIcon className="w-4 h-4"/>
                                    <span>{incident.status}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default IncidentsDashboard;
