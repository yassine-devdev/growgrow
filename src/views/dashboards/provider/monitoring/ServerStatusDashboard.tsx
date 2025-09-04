import React from 'react';
import { getServiceStatus } from '@/api/providerApi';
import type { ServiceStatus } from '@/api/schemas/providerMonitoringSchemas';
import { Loader2, Clock, ShieldCheck, ServerCrash, TriangleAlert, Wrench } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

/**
 * A helper function that returns styling and icon information based on a service's status.
 *
 * @param {ServiceStatus['status']} status - The status of the service.
 * @returns {{color: string, iconColor: string, icon: React.ElementType}} An object with CSS classes and the appropriate icon component.
 */
const getStatusInfo = (status: ServiceStatus['status']) => {
    switch (status) {
        case 'Operational': return { color: 'border-green-500 bg-green-500/10', iconColor: 'text-green-500', icon: ShieldCheck };
        case 'Degraded Performance': return { color: 'border-yellow-500 bg-yellow-500/10', iconColor: 'text-yellow-500', icon: TriangleAlert };
        case 'Under Maintenance': return { color: 'border-blue-500 bg-blue-500/10', iconColor: 'text-blue-500', icon: Wrench };
        case 'Outage': return { color: 'border-red-500 bg-red-500/10', iconColor: 'text-red-500', icon: ServerCrash };
        default: return { color: 'border-gray-500 bg-gray-500/10', iconColor: 'text-gray-500', icon: TriangleAlert };
    }
};

/**
 * Renders the 'Server Status' dashboard for the Provider role.
 * It fetches and displays the real-time status of all monitored system services.
 *
 * @returns {JSX.Element} The rendered server status dashboard.
 */
const ServerStatusDashboard: React.FC = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['serviceStatus'],
        queryFn: getServiceStatus,
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (isError || !data || data.length === 0) {
        return (
            <div className="h-full flex flex-col gap-4">
                <h2 className="text-xl font-bold text-brand-text">Service Status</h2>
                <div className="flex-1 flex flex-col items-center justify-center text-center bg-brand-surface border-2 border-dashed border-brand-border rounded-lg">
                    <ServerCrash className="w-16 h-16 text-brand-primary mb-4" />
                    <h2 className="text-2xl font-bold text-brand-text mb-2">No Status Available</h2>
                    <p className="text-brand-text-alt max-w-sm">We couldn't retrieve the status for the services at this moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <h2 className="text-lg md:text-xl font-bold text-brand-text">Service Status</h2>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2">
                {data.map((service) => {
                    const statusInfo = getStatusInfo(service.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                        <div key={service.name} className={`border-l-4 p-3 flex items-start gap-3 bg-brand-surface rounded-r-lg ${statusInfo.color} transition-all duration-200 hover:shadow-md`}>
                            <div className={`p-2 rounded-full ${statusInfo.color} mt-1 sm:mt-0`}>
                                <StatusIcon className={`w-6 h-6 shrink-0 ${statusInfo.iconColor}`} />
                            </div>
                            <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4 overflow-hidden">
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-bold text-brand-text truncate text-base">{service.name}</h3>
                                    <p className={`text-sm font-semibold truncate ${statusInfo.iconColor}`}>{service.status}</p>
                                </div>
                                <div className="flex items-center text-xs text-brand-text-alt gap-4 sm:gap-6 shrink-0">
                                    <div className="flex items-center gap-1.5" title="Uptime">
                                        <ShieldCheck className="w-4 h-4 text-green-500" />
                                        <span className="font-medium">{service.uptime}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="Response Time">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span className="font-medium">{service.responseTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ServerStatusDashboard;