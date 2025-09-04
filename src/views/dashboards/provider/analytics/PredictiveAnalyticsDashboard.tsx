import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPredictiveAnalyticsData } from '@/api/providerApi';
import { QUERY_KEYS } from '@/constants/queries';
import { useAnalyticsFilter } from '@/context/AnalyticsFilterContext';
import { useTranslation } from 'react-i18next';
import { Loader2, UserX } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Skeleton from '@/components/ui/Skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PredictiveAnalyticsData } from '@/api/schemas/commonSchemas';

const PredictiveAnalyticsSkeleton: React.FC = () => (
    <div className="flex flex-col h-full gap-4">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="lg:col-span-2" />
            <Skeleton className="lg:col-span-1" />
        </div>
    </div>
);

const PredictiveAnalyticsDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { dateRange } = useAnalyticsFilter();
    const { data, isLoading } = useQuery<PredictiveAnalyticsData>({
        queryKey: [QUERY_KEYS.predictiveAnalyticsData, dateRange],
        queryFn: () => getPredictiveAnalyticsData(dateRange),
    });

    if (isLoading) {
        return <PredictiveAnalyticsSkeleton />;
    }

    if (!data) return null;

    return (
        <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.predictiveAnalytics.title')}</h1>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {data.stats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                <div className="lg:col-span-2 bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold text-brand-text mb-4">{t('views.predictiveAnalytics.ltvForecast')}</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.ltvForecast} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                            <Legend />
                            <Line type="monotone" dataKey="predictedLtv" name="Predicted LTV" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2"><UserX className="w-5 h-5 text-red-500"/>{t('views.predictiveAnalytics.highRiskChurn')}</h3>
                    <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                        {data.highRiskChurnUsers.map(user => (
                             <div key={user.id} className="p-3 bg-brand-surface-alt rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-sm text-brand-text">{user.name}</p>
                                    <p className="text-xs text-brand-text-alt">{user.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-red-500">{(user.churnProbability * 100).toFixed(1)}%</p>
                                    <p className="text-xs text-brand-text-alt">{t('views.predictiveAnalytics.churnProbability')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictiveAnalyticsDashboard;
