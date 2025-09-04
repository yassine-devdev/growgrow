import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const BrandingManager = lazy(() => import('@/views/schools/whitelabel/BrandingManager'));
const DomainsManager = lazy(() => import('@/views/schools/whitelabel/DomainsManager'));
const ThemesManager = lazy(() => import('@/views/schools/whitelabel/ThemesManager'));

const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
    </div>
);

const WhiteLabelView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route index element={<Navigate to="branding" replace />} />
                <Route path="branding" element={<BrandingManager />} />
                <Route path="domains" element={<DomainsManager />} />
                <Route path="themes" element={<ThemesManager />} />
            </Routes>
        </Suspense>
    );
};

export default WhiteLabelView;