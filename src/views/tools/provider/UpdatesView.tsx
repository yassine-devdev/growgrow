import React, { lazy, Suspense } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { NAVIGATION_CONFIG } from '@/constants/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';

const VersionControlView = lazy(() => import('./updates/VersionControlView'));
const ChangelogView = lazy(() => import('./updates/ChangelogView'));
const FeatureRolloutsView = lazy(() => import('./updates/NotificationsView')); // Re-purposed

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

const UpdatesView: React.FC = () => {
    const { t } = useTranslation();
    const user = useAppStore(s => s.user);

    const updatesNav = NAVIGATION_CONFIG[user!.role]
        .find(m => m.id === 'tools')
        ?.headerNav.find(h => h.id === 'updates');
        
    return (
        <div className="h-full flex flex-col gap-4">
             <nav className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                 {updatesNav?.children?.map(item => (
                    <NavLink
                        key={item.id}
                        to={`/tools/updates/${item.id}`}
                        className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                            isActive
                                ? 'bg-brand-primary text-white shadow-sm' 
                                : 'text-brand-text-alt dark:text-dark-text-alt hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-text dark:hover:text-dark-text'
                        }`}
                    >
                        <item.icon className="w-4 h-4" />
                        {t(item.label)}
                    </NavLink>
                ))}
            </nav>
            <div className="flex-1 overflow-y-auto pr-2">
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route index element={<Navigate to="version-control" replace />} />
                        <Route path="version-control" element={<VersionControlView />} />
                        <Route path="feature-rollouts" element={<FeatureRolloutsView />} />
                        <Route path="changelog" element={<ChangelogView />} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
};

export default UpdatesView;