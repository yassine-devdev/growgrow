import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import StudioNav from './studio/StudioNav';

const Designer = lazy(() => import('./studio/subapps/Designer'));
const VideoEditor = lazy(() => import('./studio/subapps/VideoEditor'));
const Coder = lazy(() => import('./studio/subapps/Coder'));
const Office = lazy(() => import('./studio/subapps/Office'));
const Marketplace = lazy(() => import('./studio/subapps/Marketplace'));


const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center bg-brand-surface-alt dark:bg-dark-surface-alt">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
    </div>
);

const StudioOverlay: React.FC = () => {
    return (
        <div className="w-full h-full flex bg-brand-surface-alt dark:bg-dark-surface-alt">
            <StudioNav />
            <main className="flex-1 overflow-hidden">
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route path="/" element={<Navigate to="designer" replace />} />
                        <Route path="designer/*" element={<Designer />} />
                        <Route path="video/*" element={<VideoEditor />} />
                        <Route path="coder/*" element={<Coder />} />
                        <Route path="office/*" element={<Office />} />
                        <Route path="marketplace/*" element={<Marketplace />} />
                    </Routes>
                </Suspense>
            </main>
        </div>
    );
};

export default StudioOverlay;