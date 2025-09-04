import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMarketingAnalytics } from '@/api/appModulesApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2 } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Skeleton from '@/components/ui/Skeleton';

const MarketingAnalyticsSkeleton = () => (
    <div className="flex flex-col h-full gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
        </div>
        <Skeleton className="flex-1" />
    </div>
);

const AnalyticsView: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.marketingAnalytics,
        queryFn: getMarketingAnalytics,
    });

    if (isLoading) {
        return <MarketingAnalyticsSkeleton />;
    }

    if (!data) return null;

    return (
        <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Marketing Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.stats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
            <div className="flex-1 bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col min-h-[300px]">
                <h3 className="text-lg font-bold mb-4 text-brand-text">Conversions by Channel</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.conversionsByChannel} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 12}} />
                        <YAxis stroke="#6b7280" tick={{fontSize: 12}} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                            }}
                        />
                        <Legend />
                        <Bar dataKey="conversions" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsView;