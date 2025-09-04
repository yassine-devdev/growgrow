import React, { lazy, Suspense } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { NAVIGATION_CONFIG } from '@/constants/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';

const CampaignsManager = lazy(() => import('./marketing/CampaignsManager'));
const AnalyticsView = lazy(() => import('./marketing/AnalyticsView'));
// FIX: Corrected import path.
const AutomationView = lazy(() => import('./marketing/MarketingProjectWorkspace'));


const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;

const MarketingView: React.FC = () => {
    const { t } = useTranslation();
    const user = useAppStore(s => s.user);

    const marketingNav = NAVIGATION_CONFIG[user!.role]
        .find(m => m.id === 'tools')
        ?.headerNav.find(h => h.id === 'marketing');

    return (
        <div className="h-full flex flex-col gap-4">
             <nav className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                 {marketingNav?.children?.map(item => (
                    <NavLink
                        key={item.id}
                        to={`/tools/marketing/${item.id}`}
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
            <div className="flex-1 overflow-y-auto">
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route index element={<Navigate to="campaigns" replace />} />
                        <Route path="campaigns" element={<CampaignsManager />} />
                        <Route path="analytics" element={<AnalyticsView />} />
                        <Route path="automation" element={<AutomationView />} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
};

export default MarketingView;