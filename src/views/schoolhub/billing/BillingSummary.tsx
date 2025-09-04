import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSchoolBillingSummary } from '@/api/schoolHubApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2, CheckCircle, Clock } from 'lucide-react';

const StatusBadge = ({ status, isSubscription = false }: { status: string; isSubscription?: boolean }) => {
    const colorMap: { [key: string]: string } = {
        Active: 'bg-green-100 text-green-800',
        Paid: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const BillingSummary: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.schoolBillingSummary,
        queryFn: getSchoolBillingSummary,
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (!data) return <div>Could not load billing information.</div>;
    
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-text mb-6">Billing Overview</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <h2 className="text-lg font-semibold text-brand-text mb-2">Current Subscription</h2>
                    <div className="p-4 bg-brand-surface-alt/50 border border-brand-border rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Plan</span>
                            <span className="font-bold text-lg text-brand-primary">{data.subscription.plan}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="font-semibold">Status</span>
                            <StatusBadge status={data.subscription.status} isSubscription />
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="font-semibold">Next Bill</span>
                            <span className="text-brand-text-alt">{data.subscription.nextBillingDate}</span>
                        </div>
                         <div className="pt-3 border-t border-brand-border flex justify-between items-center">
                            <span className="font-semibold">Amount</span>
                            <span className="font-bold text-brand-text">${data.subscription.amount.toFixed(2)}</span>
                        </div>
                         <p className="text-xs text-brand-text-alt pt-2">Note: For payment and subscription management, please contact your Provider administrator.</p>
                    </div>
                </div>
                <div className="lg:col-span-2">
                     <h2 className="text-lg font-semibold text-brand-text mb-2">Recent Invoices</h2>
                     <div className="p-4 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
                        <div className="space-y-3">
                            {data.invoiceHistory.map(invoice => (
                                <div key={invoice.id} className="flex items-center justify-between p-3 bg-brand-surface rounded-md">
                                    <div>
                                        <p className="font-semibold">{invoice.id}</p>
                                        <p className="text-sm text-brand-text-alt">Date: {invoice.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${invoice.amount.toFixed(2)}</p>
                                        <StatusBadge status={invoice.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default BillingSummary;