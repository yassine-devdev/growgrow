import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import EmptyState from '@/views/EmptyState';

const ProfileView = lazy(() => import('./ProfileView'));
const BrandingManager = lazy(() => import('@/views/schools/whitelabel/BrandingManager'));

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

const GeneralSettingsView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route index element={<Navigate to="provider-profile" replace />} />
                <Route path="provider-profile" element={<ProfileView />} />
                <Route path="platform-branding" element={<BrandingManager />} />
                <Route path="language-settings" element={<EmptyState message="Language & translation management is coming soon." />} />
                <Route path="appearance" element={<EmptyState message="Advanced appearance and theming controls are coming soon." />} />
                <Route path="regional-settings" element={<EmptyState message="Regional settings for currency and date formats are coming soon." />} />
            </Routes>
        </Suspense>
    );
};

export default GeneralSettingsView;
