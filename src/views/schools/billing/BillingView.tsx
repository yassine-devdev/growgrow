import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const SubscriptionsManager = lazy(() => import('@/views/schools/billing/SubscriptionsManager'));
const InvoicesManager = lazy(() => import('@/views/schools/billing/InvoicesManager'));

const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
    </div>
);

const BillingView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route index element={<Navigate to="subscriptions" replace />} />
                <Route path="subscriptions" element={<SubscriptionsManager />} />
                <Route path="invoices" element={<InvoicesManager />} />
            </Routes>
        </Suspense>
    );
};

export default BillingView;
