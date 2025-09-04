import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCrmAnalytics } from '@/api/crmApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatCard from '@/components/ui/StatCard';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CrmAnalytics: React.FC = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.crmAnalytics],
        queryFn: getCrmAnalytics,
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (!data) return null;

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.crm.analytics.title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.stats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold text-brand-text mb-4">{t('views.crm.analytics.dealStage')}</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.dealsByStage}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#4f46e5" name="Deals" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold text-brand-text mb-4">{t('views.crm.analytics.leadSource')}</h3>
                    <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie data={data.leadsBySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                {data.leadsBySource.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default CrmAnalytics;