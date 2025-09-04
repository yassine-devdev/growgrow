import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const InternalDirectory = lazy(() => import('./InternalDirectory'));
const RolesManager = lazy(() => import('./RolesManager'));
const PermissionsManager = lazy(() => import('./PermissionsManager'));

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

const HrmView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route index element={<Navigate to="directory" replace />} />
                <Route path="directory" element={<InternalDirectory />} />
                <Route path="roles" element={<RolesManager />} />
                <Route path="permissions" element={<PermissionsManager />} />
            </Routes>
        </Suspense>
    );
};

export default HrmView;
