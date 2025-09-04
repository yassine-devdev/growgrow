import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import EmptyState from '../EmptyState';
import ProfileManager from './ProfileManager';

const NotificationsSettingsView = lazy(() => import('./NotificationsSettingsView'));
const AcademicHealth = lazy(() => import('./AcademicHealth'));

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

const L2Routes: React.FC = () => {
    const { l1_id, l2_id } = useParams();

    if (l1_id === 'settings') {
        switch (l2_id) {
            case 'profile': return <ProfileManager />;
            case 'notifications': return <NotificationsSettingsView />;
            default: return <EmptyState message="Unknown setting" />;
        }
    }
    
    if (l1_id === 'health') {
         switch (l2_id) {
            case 'academic-health': return <AcademicHealth />;
            default: return <EmptyState message="Unknown health metric" />;
        }
    }

    return <EmptyState message="Unknown section" />;
}

const SchoolSystemView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route index element={<Navigate to="settings/profile" replace />} />
                <Route path=":l1_id/:l2_id" element={<L2Routes />} />
            </Routes>
        </Suspense>
    );
};

export default SchoolSystemView;
