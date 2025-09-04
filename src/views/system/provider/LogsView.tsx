import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import EmptyState from '@/views/EmptyState';

const AuditLogsView = lazy(() => import('./AuditLogsView'));
const SystemLogsView = lazy(() => import('./SystemLogsView'));

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

const LogsView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route index element={<Navigate to="system-logs" replace />} />
                <Route path="system-logs" element={<SystemLogsView />} />
                <Route path="audit-logs" element={<AuditLogsView />} />
                <Route path="access-logs" element={<EmptyState message="A detailed view of user access logs is coming soon." />} />
                <Route path="log-analytics" element={<EmptyState message="An advanced log analytics dashboard is under development." />} />
            </Routes>
        </Suspense>
    );
};

export default LogsView;
