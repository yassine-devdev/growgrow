
import React from 'react';
import { getProviderAnalytics } from '@/api/providerApi';
import StatCard from '@/components/ui/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Skeleton from '@/components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { Stat } from '@/api/schemas/commonSchemas';
import { QUERY_KEYS } from '@/constants/queries';
import { useAnalyticsFilter } from '@/context/AnalyticsFilterContext';

/**
 * A skeleton loader component for the UsageStatsDashboard.
 * Displays a placeholder UI while the dashboard data is being fetched.
 * @returns {JSX.Element} The rendered skeleton component.
 */
const UsageStatsSkeleton = () => (
    <div className="h-full flex flex-col gap-2">
        <div className="grid grid-cols-4 gap-2">
            <Skeleton className="h-[76px]" />
            <Skeleton className="h-[76px]" />
            <Skeleton className="h-[76px]" />
            <Skeleton className="h-[76px]" />
        </div>
        <Skeleton className="flex-1" />
    </div>
);

/**
 * Renders the 'Usage Stats' dashboard for the Provider role.
 * It displays key performance indicators and a growth overview chart showing
 * Monthly Recurring Revenue (MRR) and active tenants over time.
 *
 * @returns {JSX.Element} The rendered usage stats dashboard.
 */
const UsageStatsDashboard: React.FC = () => {
    const { dateRange } = useAnalyticsFilter();
    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.providerAnalytics, dateRange],
        queryFn: () => getProviderAnalytics(dateRange)
    });

    if (isLoading) {
        return <UsageStatsSkeleton />;
    }
    
    if (!data) return null;

    return (
        <div className="h-full flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-2">
                {data.stats.map((stat: Stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
            <div className="flex-1 bg-brand-surface border border-brand-border rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-brand-text">Growth Overview</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorTenants" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 12}} />
                        <YAxis yAxisId="left" stroke="#6b7280" tick={{fontSize: 12}} />
                        <YAxis yAxisId="right" orientation="right" stroke="#6b7280" tick={{fontSize: 12}} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                color: '#111827',
                                borderRadius: '0.5rem',
                            }}
                        />
                        <Area yAxisId="left" type="monotone" dataKey="mrr" stroke="#4f46e5" fillOpacity={1} fill="url(#colorMrr)" />
                        <Area yAxisId="right" type="monotone" dataKey="tenants" stroke="#34d399" fillOpacity={1} fill="url(#colorTenants)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UsageStatsDashboard;
