import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProviderFinanceDashboardData } from '@/api/providerApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2 } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Skeleton from '@/components/ui/Skeleton';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ProviderFinanceDashboardData } from '@/api/schemas/commonSchemas';

const FinanceDashboardSkeleton: React.FC = () => (
    <div className="flex flex-col h-full gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="w-full h-full min-h-[300px]" />
            <Skeleton className="w-full h-full min-h-[300px]" />
        </div>
    </div>
);

const FinanceDashboard: React.FC = () => {
    const { data, isLoading } = useQuery<ProviderFinanceDashboardData>({
        queryKey: QUERY_KEYS.providerFinanceDashboard,
        queryFn: getProviderFinanceDashboardData,
    });

    if (isLoading) {
        return <FinanceDashboardSkeleton />;
    }

    if (!data) return null;

    return (
        <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Provider Finance Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.stats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[300px]">
                <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold text-brand-text mb-4">Monthly Revenue vs. Expenses</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.revenueVsExpenses}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#4f46e5" name="Revenue" />
                            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold text-brand-text mb-4">Expense Breakdown by Category</h3>
                    <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                                data={data.expenseBreakdown}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.expenseBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default FinanceDashboard;