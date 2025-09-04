import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import EmptyState from '@/views/EmptyState';

const MarketingView = lazy(() => import('./provider/MarketingView'));
const FinanceView = lazy(() => import('./provider/FinanceView'));
const UpdatesView = lazy(() => import('./provider/UpdatesView'));
const DataStudioView = lazy(() => import('./provider/DataStudioView'));
const SandboxView = lazy(() => import('./provider/SandboxView'));

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

const ProviderToolsView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route index element={<Navigate to="marketing/campaigns" replace />} />
                <Route path="marketing/*" element={<MarketingView />} />
                <Route path="finance/*" element={<FinanceView />} />
                <Route path="updates/*" element={<UpdatesView />} />
                <Route path="data-studio/*" element={<DataStudioView />} />
                <Route path="sandbox/*" element={<SandboxView />} />
                <Route path="collaboration/*" element={<EmptyState message="Collaboration tools are coming soon." />} />
                <Route path="testing-automation/*" element={<EmptyState message="Testing & Automation suite is under development." />} />
            </Routes>
        </Suspense>
    );
};

export default ProviderToolsView;