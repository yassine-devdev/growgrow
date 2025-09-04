

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AnalyticsFilterProvider, useAnalyticsFilter, DateRange } from '@/context/AnalyticsFilterContext';

const UsageStatsDashboard = lazy(() => import('@/views/dashboards/provider/analytics/UsageStatsDashboard'));
const RevenueDashboard = lazy(() => import('@/views/dashboards/provider/analytics/RevenueDashboard'));
const ActiveUsersDashboard = lazy(() => import('@/views/dashboards/provider/analytics/ActiveUsersDashboard'));
const GrowthTrendsDashboard = lazy(() => import('@/views/dashboards/provider/analytics/GrowthTrendsDashboard'));
const PredictiveAnalyticsDashboard = lazy(() => import('@/views/dashboards/provider/analytics/PredictiveAnalyticsDashboard'));
const CohortAnalysisDashboard = lazy(() => import('@/views/dashboards/provider/analytics/CohortAnalysisDashboard'));


/**
 * A fallback component to display while lazy-loaded analytics dashboards are being fetched.
 * @returns {JSX.Element} A loading spinner.
 */
const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
    </div>
);

const AnalyticsFilters: React.FC = () => {
    const { dateRange, setDateRange } = useAnalyticsFilter();

    const ranges: { value: DateRange; label: string }[] = [
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: '90d', label: 'Last 90 Days' },
        { value: 'all', label: 'All Time' },
    ];

    return (
        <div className="mb-4 flex justify-end">
            <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="bg-brand-surface border border-brand-border rounded-lg p-2 text-sm"
                aria-label="Select time range for analytics"
            >
                {ranges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
        </div>
    );
};

const AnalyticsDashboardContent: React.FC = () => {
    return (
        <div className="flex flex-col h-full">
            <AnalyticsFilters />
            <div className="flex-1 min-h-0">
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route index element={<Navigate to="usage-stats" replace />} />
                        <Route path="usage-stats" element={<UsageStatsDashboard />} />
                        <Route path="revenue-reports" element={<RevenueDashboard />} />
                        <Route path="active-users" element={<ActiveUsersDashboard />} />
                        <Route path="growth-trends" element={<GrowthTrendsDashboard />} />
                        <Route path="predictive-analytics" element={<PredictiveAnalyticsDashboard />} />
                        <Route path="cohort-analysis" element={<CohortAnalysisDashboard />} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
};


/**
 * A router component for the 'Analytics' section of the Provider Dashboard.
 * It handles navigation between different analytics views like usage stats, revenue, etc.
 *
 * @returns {JSX.Element} The rendered router for the analytics dashboard.
 */
const AnalyticsDashboard: React.FC = () => {
    return (
        <AnalyticsFilterProvider>
            <AnalyticsDashboardContent />
        </AnalyticsFilterProvider>
    );
};

export default AnalyticsDashboard;