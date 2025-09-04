import React, { useState } from 'react';
import { getSystemAlerts, acknowledgeAlert } from '@/api/providerApi';
import type { Alert } from '@/api/schemas/providerMonitoringSchemas';
import { Loader2, Bell, TriangleAlert, Info } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';

/**
 * Returns styling and icon information based on an alert's severity.
 * @param {Alert['severity']} severity - The severity level of the alert.
 * @returns {{color: string, icon: React.ElementType, iconColor: string}} An object with CSS classes and the appropriate icon component.
 */
const getAlertInfo = (severity: Alert['severity']) => {
    switch (severity) {
        case 'Critical': return { color: 'bg-red-500/10 border-red-500', icon: TriangleAlert, iconColor: 'text-red-500' };
        case 'Warning': return { color: 'bg-yellow-500/10 border-yellow-500', icon: Bell, iconColor: 'text-yellow-500' };
        case 'Info': return { color: 'bg-blue-500/10 border-blue-500', icon: Info, iconColor: 'text-blue-500' };
        default: return { color: 'bg-gray-500/10 border-gray-500', icon: Bell, iconColor: 'text-gray-500' };
    }
};

/**
 * Renders the 'Alerts' dashboard for the Provider role.
 * It fetches and displays a list of the latest system alerts, styled
 * according to their severity level.
 *
 * @returns {JSX.Element} The rendered alerts dashboard.
 */
const AlertsDashboard: React.FC = () => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['systemAlerts'],
        queryFn: getSystemAlerts,
    });
    const addToast = useAppStore(s => s.addToast);
    const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());

    const acknowledgeMutation = useMutation({
        mutationFn: acknowledgeAlert,
        onSuccess: (data, alertId) => {
            addToast({ message: `Alert ${alertId} acknowledged.`, type: 'success' });
            setAcknowledged(prev => new Set(prev).add(alertId));
            // Optionally, refetch alerts if the backend removes acknowledged ones
            // queryClient.invalidateQueries({ queryKey: ['systemAlerts'] });
        },
        onError: (error: Error, alertId) => {
            addToast({ message: `Failed to acknowledge alert ${alertId}: ${error.message}`, type: 'error' });
        }
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }
    
    if (!data || data.length === 0) {
        return (
            <div className="h-full flex flex-col gap-4">
                <h2 className="text-xl font-bold text-brand-text">System Alerts</h2>
                <div className="flex-1 flex items-center justify-center bg-brand-surface-alt rounded-lg">
                    <p className="text-brand-text-alt">No active alerts.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <h2 className="text-xl font-bold text-brand-text">System Alerts</h2>
            <div className="flex-1 flex flex-col gap-3">
                {data.map((alert) => {
                    const alertInfo = getAlertInfo(alert.severity);
                    const AlertIcon = alertInfo.icon;
                    const isAcknowledged = acknowledged.has(alert.id);
                    return (
                        <div key={alert.id} className={`p-3 flex items-center gap-3 bg-brand-surface rounded-lg border-l-4 ${alertInfo.color}`}>
                            <div className={`p-2 rounded-full ${alertInfo.color.split(' ')[0]}`}>
                                <AlertIcon className={`w-5 h-5 shrink-0 ${alertInfo.iconColor}`} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-baseline gap-2">
                                    <p className={`font-bold truncate ${alertInfo.iconColor}`}>{alert.severity} Alert</p>
                                    <p className="text-xs text-brand-text-alt shrink-0">{new Date(alert.timestamp).toLocaleString()}</p>
                                </div>
                                <p className="text-brand-text text-sm mt-1 truncate">{alert.message}</p>
                            </div>
                             <button
                                onClick={() => acknowledgeMutation.mutate(alert.id)}
                                disabled={isAcknowledged || (acknowledgeMutation.isPending && acknowledgeMutation.variables === alert.id)}
                                className="ml-4 px-3 py-1 text-xs font-semibold rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20"
                            >
                                {isAcknowledged ? 'Acknowledged' : 'Acknowledge'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AlertsDashboard;