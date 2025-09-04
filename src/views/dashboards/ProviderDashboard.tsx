import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AnalyticsDashboard = lazy(() => import('@/views/dashboards/provider/AnalyticsDashboard'));
const MonitoringDashboard = lazy(() => import('@/views/dashboards/provider/MonitoringDashboard'));
const CommandCenterDashboard = lazy(() => import('@/views/dashboards/provider/CommandCenterDashboard'));

/**
 * A fallback component to display while lazy-loaded dashboard sections are being fetched.
 * @returns {JSX.Element} A loading spinner.
 */
const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
    </div>
);

/**
 * The main dashboard router for the 'Provider' role.
 * It handles routing between the different dashboard categories, such as 'Analytics' and 'Monitoring'.
 *
 * @returns {JSX.Element} The rendered router for the provider dashboard.
 */
const ProviderDashboard: React.FC = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Default to command center view */}
                <Route index element={<Navigate to="command-center" replace />} />
                <Route path="command-center" element={<CommandCenterDashboard />} />
                <Route path="analytics/*" element={<AnalyticsDashboard />} />
                <Route path="monitoring/*" element={<MonitoringDashboard />} />
            </Routes>
        </Suspense>
    );
};

export default ProviderDashboard;