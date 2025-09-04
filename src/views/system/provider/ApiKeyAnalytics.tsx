import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApiKeyAnalytics } from '@/api/appModulesApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2 } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Skeleton from '@/components/ui/Skeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ApiKeyAnalyticsSkeleton: React.FC = () => (
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

const ApiKeyAnalytics: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.apiKeyAnalytics,
        queryFn: getApiKeyAnalytics,
    });

    if (isLoading) return <ApiKeyAnalyticsSkeleton />;
    if (!data) return null;

    return (
        <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold text-brand-text">API Key Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.stats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
            <div className="flex-1 bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col min-h-[300px]">
                <h3 className="text-lg font-bold mb-4 text-brand-text">API Calls Over Time (Last 6 Hours)</h3>
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.usageOverTime} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" tick={{fontSize: 12}} />
                        <YAxis stroke="#6b7280" tick={{fontSize: 12}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="calls" name="API Calls" stroke="#818cf8" fill="url(#colorCalls)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ApiKeyAnalytics;
