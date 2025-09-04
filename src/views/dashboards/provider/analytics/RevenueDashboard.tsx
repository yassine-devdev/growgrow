import React from 'react';
import { getRevenueData } from '@/api/providerApi';
import StatCard from '@/components/ui/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Loader2, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Stat, TransactionData } from '@/api/schemas/commonSchemas';
import { QUERY_KEYS } from '@/constants/queries';
import { useAnalyticsFilter } from '@/context/AnalyticsFilterContext';

/**
 * Type definition for MRR by plan data point.
 */
interface MrrData {
    name: string;
    value: number;
    fill: string;
}

/**
 * Renders the 'Revenue Reports' dashboard for the Provider role.
 * It displays key financial statistics, a breakdown of MRR by subscription plan,
 * and a list of recent transactions.
 *
 * @returns {JSX.Element} The rendered revenue dashboard.
 */
const RevenueDashboard: React.FC = () => {
    const { dateRange } = useAnalyticsFilter();
    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.revenueData, dateRange],
        queryFn: () => getRevenueData(dateRange),
    });

     const handleExport = () => {
        if (!data?.recentTransactions || data.recentTransactions.length === 0) return;
        const transactions = data.recentTransactions;
        const headers = Object.keys(transactions[0]) as (keyof TransactionData)[];
        const csvRows = [
            headers.join(','),
            ...transactions.map(row =>
                headers.map(fieldName => JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)).join(',')
            )
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'transactions.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


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
                    <h3 className="text-lg font-bold mb-4 text-brand-text">MRR by Subscription Plan</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.mrrByPlan} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis type="number" stroke="#6b7280" tick={{fontSize: 12}} />
                            <YAxis type="category" dataKey="name" stroke="#6b7280" tick={{fontSize: 12}} width={80} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                }}
                                formatter={(value: number) => `$${value.toLocaleString()}`}
                            />
                            <Bar dataKey="value" name="MRR">
                                {data.mrrByPlan.map((entry: MrrData, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-brand-text">Recent Transactions</h3>
                        <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-brand-surface-alt hover:bg-brand-border text-brand-text">
                            <Download className="w-3 h-3"/>
                            Export CSV
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="text-xs text-brand-text-alt grid grid-cols-4 gap-2 font-semibold border-b border-brand-border pb-2 mb-2">
                            <span>School</span>
                            <span>Plan</span>
                            <span>Date</span>
                            <span className="text-right">Amount</span>
                        </div>
                        <div className="space-y-2">
                            {data.recentTransactions.map((tx: TransactionData) => (
                                <div key={tx.id} className="text-sm text-brand-text grid grid-cols-4 gap-2 items-center">
                                    <span className="truncate">{tx.school}</span>
                                    <span>{tx.plan}</span>
                                    <span className="text-brand-text-alt">{tx.date}</span>
                                    <span className="text-right font-semibold">${tx.amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueDashboard;