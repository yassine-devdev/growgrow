import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const TicketsManager = lazy(() => import('@/views/schools/support/TicketsManager'));
const KbAnalytics = lazy(() => import('@/views/schools/support/KbAnalytics'));

const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
    </div>
);

const SupportView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route index element={<Navigate to="tickets" replace />} />
                <Route path="tickets" element={<TicketsManager />} />
                <Route path="kb-analytics" element={<KbAnalytics />} />
            </Routes>
        </Suspense>
    );
};

export default SupportView;
