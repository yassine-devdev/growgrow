import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useRealtimeMonitoring } from '@/hooks/useRealtime';

const ServerStatusDashboard = lazy(() => import('@/views/dashboards/provider/monitoring/ServerStatusDashboard'));
const IncidentsDashboard = lazy(() => import('@/views/dashboards/provider/monitoring/IncidentsDashboard'));
const LogsDashboard = lazy(() => import('@/views/dashboards/provider/monitoring/LogsDashboard'));
const AlertsDashboard = lazy(() => import('@/views/dashboards/provider/monitoring/AlertsDashboard'));

/**
 * A fallback component to display while lazy-loaded monitoring dashboards are being fetched.
 * @returns {JSX.Element} A loading spinner.
 */
const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
    </div>
);

/**
 * A router component for the 'Monitoring' section of the Provider Dashboard.
 * It handles navigation between different monitoring views like server status, logs, etc.
 * It also initializes the real-time data subscription for all its children.
 *
 * @returns {JSX.Element} The rendered router for the monitoring dashboard.
 */
const MonitoringDashboard: React.FC = () => {
    // This hook subscribes to real-time updates for all monitoring data.
    // When new data is pushed from the service, it will update the TanStack Query cache,
    // causing the child components (ServerStatusDashboard, etc.) to re-render automatically.
    useRealtimeMonitoring();

    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route index element={<Navigate to="server-status" replace />} />
                <Route path="server-status" element={<ServerStatusDashboard />} />
                <Route path="incidents" element={<IncidentsDashboard />} />
                <Route path="logs" element={<LogsDashboard />} />
                <Route path="alerts" element={<AlertsDashboard />} />
            </Routes>
        </Suspense>
    );
};

export default MonitoringDashboard;