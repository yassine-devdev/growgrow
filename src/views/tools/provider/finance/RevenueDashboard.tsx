import React from 'react';
// FIX: Change to getProviderAnalytics to fetch the correct data shape for the line chart.
import { getProviderAnalytics } from '@/api/providerApi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import StatCard from '@/components/ui/StatCard';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queries';
// FIX: Remove TransactionData as it's not used here anymore.
import { Stat } from '@/api/schemas/commonSchemas';

const RevenueDashboard = () => {
    const { data, isLoading } = useQuery({
        // FIX: Use the correct query key for the new data source.
        queryKey: QUERY_KEYS.providerAnalytics,
        // FIX: Call getProviderAnalytics to fetch data with a chartData property.
        queryFn: () => getProviderAnalytics('30d')
    });

    if (isLoading || !data) return <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto my-10" />;
    
    // Add AI forecast data
    const lastMrrPoint = data.chartData[data.chartData.length - 1];
    const forecastData = [
        { ...lastMrrPoint },
        { name: 'Sep', mrr: lastMrrPoint.mrr * 1.1 },
        { name: 'Oct', mrr: lastMrrPoint.mrr * 1.2 },
    ];
    const chartDataWithForecast = [...data.chartData];

    return (
         <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
                {data.stats.map((stat: Stat) => <StatCard key={stat.label} {...stat} />)}
            </div>
            <div className="p-4 bg-brand-surface rounded-lg border border-brand-border h-96">
                <h3 className="font-bold mb-4">MRR Growth & AI Forecast</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={chartDataWithForecast}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="mrr" stroke="#4f46e5" name="Actual MRR" dot={false} />
                        <Line type="monotone" dataKey="mrr" data={forecastData} stroke="#4f46e5" strokeDasharray="5 5" name="AI Forecast" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueDashboard;