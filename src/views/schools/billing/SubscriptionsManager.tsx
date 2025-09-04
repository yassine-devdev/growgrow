import React, { useState, useMemo } from 'react';
import { getSubscriptions } from '@/api/schoolManagementApi';
import type { Subscription } from '@/api/schemas/schoolManagementSchemas';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const StatusBadge = ({ status }: { status: Subscription['status'] }) => {
    const colorMap = {
        Active: 'bg-green-100 text-green-800',
        Trialing: 'bg-blue-100 text-blue-800',
        Canceled: 'bg-gray-100 text-gray-800',
        'Past Due': 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>{status}</span>;
};

const SubscriptionsManager: React.FC = () => {
    const { t } = useTranslation();
    const [planFilter, setPlanFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const { data: subscriptions, isLoading } = useQuery({
        queryKey: ['subscriptions', planFilter, statusFilter],
        queryFn: () => getSubscriptions({ planFilter, statusFilter }),
    });
    
    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.subscriptionsManager.title')}</h1>

            {/* Filters */}
            <div className="flex gap-4">
                <select value={planFilter} onChange={e => setPlanFilter(e.target.value)} className="bg-brand-surface-alt border border-brand-border rounded-lg p-2">
                    <option>All</option>
                    <option>Basic</option>
                    <option>Pro</option>
                    <option>Enterprise</option>
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-brand-surface-alt border border-brand-border rounded-lg p-2">
                    <option>All</option>
                    <option>Active</option>
                    <option>Trialing</option>
                    <option>Canceled</option>
                    <option>Past Due</option>
                </select>
            </div>
            
            {/* Table */}
            <div className="flex-1 overflow-y-auto border border-brand-border rounded-lg">
                <table className="w-full text-sm text-left text-brand-text">
                    <thead className="text-xs text-brand-text-alt uppercase bg-brand-surface-alt sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">School</th>
                            <th scope="col" className="px-6 py-3">Plan</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">MRR</th>
                            <th scope="col" className="px-6 py-3">Next Billing Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions?.map((sub) => (
                            <tr key={sub.id} className="bg-brand-surface border-b border-brand-border hover:bg-brand-surface-alt/50">
                                <td className="px-6 py-4 font-medium">{sub.school}</td>
                                <td className="px-6 py-4">{sub.plan}</td>
                                <td className="px-6 py-4"><StatusBadge status={sub.status} /></td>
                                <td className="px-6 py-4">${sub.mrr.toLocaleString()}</td>
                                <td className="px-6 py-4">{sub.nextBillingDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {(!subscriptions || subscriptions.length === 0) && <div className="text-center py-10 text-brand-text-alt"><p>No subscriptions match the current filters.</p></div>}
            </div>
        </div>
    );
};

export default SubscriptionsManager;