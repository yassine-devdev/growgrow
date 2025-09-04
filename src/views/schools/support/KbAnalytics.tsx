
import React from 'react';
import { getKbAnalytics } from '@/api/schoolManagementApi';
import type { KbAnalytics as KbAnalyticsData } from '@/api/schemas/schoolManagementSchemas';
import StatCard from '@/components/ui/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { QUERY_KEYS } from '@/constants/queries';
import { Stat } from '@/api/schemas/commonSchemas';

const KbAnalytics: React.FC = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useQuery<KbAnalyticsData>({
        queryKey: QUERY_KEYS.kbAnalytics,
        queryFn: getKbAnalytics
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }
    
    if (!data) return null;

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.kbAnalytics.title')}</h1>
            <div className="grid grid-cols-4 gap-4">
                {data.stats.map((stat: Stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="col-span-1 bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-brand-text">Top Searches</h3>
                    <div className="space-y-2">
                        {data.topSearches.map(search => (
                            <div key={search.term} className="flex justify-between items-center text-sm p-2 bg-brand-surface-alt rounded-md">
                                <span className="text-brand-text capitalize">{search.term}</span>
                                <span className="font-semibold text-brand-text-alt">{search.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-2 bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-brand-text">Ticket Deflection</h3>
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.deflectionData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 12}}/>
                            <YAxis stroke="#6b7280" tick={{fontSize: 12}}/>
                            <Tooltip />
                            <Legend wrapperStyle={{fontSize: "12px"}}/>
                            <Bar dataKey="tickets" stackId="a" fill="#8884d8" name="Tickets Created" />
                            <Bar dataKey="deflected" stackId="a" fill="#82ca9d" name="Tickets Deflected" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default KbAnalytics;
