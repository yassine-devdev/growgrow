import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const LeadsManager = lazy(() => import('./LeadsManager'));
const DealsPipeline = lazy(() => import('./DealsPipeline'));
const CrmAnalytics = lazy(() => import('./CrmAnalytics'));

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

const CrmView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route index element={<Navigate to="leads" replace />} />
                <Route path="leads" element={<LeadsManager />} />
                <Route path="deals" element={<DealsPipeline />} />
                <Route path="analytics" element={<CrmAnalytics />} />
            </Routes>
        </Suspense>
    );
};

export default CrmView;