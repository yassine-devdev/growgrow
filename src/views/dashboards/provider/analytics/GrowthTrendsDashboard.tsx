
import React from 'react';
import { getGrowthTrendsData } from '@/api/providerApi';
import StatCard from '@/components/ui/StatCard';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Stat } from '@/api/schemas/commonSchemas';
import { QUERY_KEYS } from '@/constants/queries';
import { useAnalyticsFilter } from '@/context/AnalyticsFilterContext';

/**
 * Renders the 'Growth Trends' dashboard for the Provider role.
 * It displays key growth metrics, a chart for new user signups vs. churn,
 * and a chart for new tenant onboarding over time.
 *
 * @returns {JSX.Element} The rendered growth trends dashboard.
 */
const GrowthTrendsDashboard: React.FC = () => {
    const { dateRange } = useAnalyticsFilter();
    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.growthTrendsData, dateRange],
        queryFn: () => getGrowthTrendsData(dateRange),
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }
    
    if (!data) return null;

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-4">
                {data.stats.map((stat: Stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
                 <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-brand-text">New User Signups vs Churn</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.userGrowth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 12}}/>
                            <YAxis stroke="#6b7280" tick={{fontSize: 12}}/>
                            <Tooltip />
                            <Legend wrapperStyle={{fontSize: "12px"}}/>
                            <Area type="monotone" dataKey="signups" stackId="1" stroke="#8884d8" fill="#8884d8" />
                            <Area type="monotone" dataKey="churn" stackId="1" stroke="#ffc658" fill="#ffc658" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-brand-text">New Tenant Onboarding</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.tenantGrowth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 12}}/>
                            <YAxis stroke="#6b7280" tick={{fontSize: 12}}/>
                            <Tooltip />
                            <Bar dataKey="tenants" fill="#82ca9d" name="New Tenants" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default GrowthTrendsDashboard;
