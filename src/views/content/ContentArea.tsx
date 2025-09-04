import React, { lazy, Suspense } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { NAVIGATION_CONFIG } from '@/constants/navigation';
import { Loader2 } from 'lucide-react';

// Lazy load components
const ProviderDashboard = lazy(() => import('@/views/dashboards/ProviderDashboard'));
const SchoolDashboard = lazy(() => import('@/views/dashboards/SchoolDashboard'));
const ConciergeView = lazy(() => import('@/views/concierge/ConciergeView'));
const EmptyState = lazy(() => import('@/views/EmptyState'));
const ProviderSchoolsView = lazy(() => import('@/views/schools/ProviderSchoolsView'));
const ProviderToolsView = lazy(() => import('@/views/tools/ProviderToolsView'));
const ProviderCommsView = lazy(() => import('@/views/communication/ProviderCommsView'));
const ProviderDirectoriesView = lazy(() => import('@/views/directories/ProviderDirectoriesView'));
const ProviderSystemView = lazy(() => import('@/views/system/ProviderSystemView'));
const SchoolHubView = lazy(() => import('@/views/schoolhub/SchoolHubView'));
const SchoolToolsView = lazy(() => import('@/views/schooltools/SchoolToolsView'));
const CommsView = lazy(() => import('@/views/comms/CommsView'));
const KnowledgeView = lazy(() => import('@/views/knowledge/KnowledgeView'));
const SchoolSystemView = lazy(() => import('@/views/schoolsystem/SchoolSystemView'));
const PersonalHubView = lazy(() => import('@/views/personalhub/PersonalHubView'));
const IndividualDashboard = lazy(() => import('@/views/dashboards/individual/IndividualDashboard'));
const CrmView = lazy(() => import('@/views/crm/CrmView'));
const HrmView = lazy(() => import('@/views/hrm/HrmView'));


/**
 * A fallback component to display while lazy-loaded components are being fetched.
 * @returns {JSX.Element} A loading spinner.
 */
const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
    </div>
);

/**
 * A component responsible for redirecting the user to their default view upon login.
 * It calculates the path to the first available module and sub-navigation item.
 * @returns {JSX.Element | null} A `Navigate` component to the default path, or null if not at the root.
 */
const DefaultRedirector: React.FC = () => {
    const user = useAppStore((state) => state.user);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    // Only redirect if we are at the root
    if (location.pathname !== '/') {
        return null;
    }

    const roleConfig = NAVIGATION_CONFIG[user.role] || [];
    const firstModule = roleConfig[0];
    if (firstModule) {
        const firstL1 = firstModule.headerNav[0];
        const firstL2 = firstL1?.children?.[0];
        let path = `/${firstModule.id}`;
        if (firstL1) path += `/${firstL1.id}`;
        if (firstL2) path += `/${firstL2.id}`;
        return <Navigate to={path} replace />;
    }

    return <EmptyState message="No default view configured for this user." />;
};

/**
 * The main content area of the application.
 * It contains the routing logic that determines which view or module to display
 * based on the URL and the current user's role.
 *
 * @returns {JSX.Element} The rendered content area with the appropriate view.
 */
const ContentArea: React.FC = () => {
    const user = useAppStore((state) => state.user);
    const { t } = useTranslation();

    /**
     * Renders the appropriate view for a 'Provider' user based on the active module ID.
     * @param {string} l0Id - The ID of the active L0 module.
     * @returns {JSX.Element} The component for the selected module.
     */
    const renderProviderContent = (l0Id: string) => {
        switch(l0Id) {
            case 'dashboard': return <ProviderDashboard />;
            case 'schools': return <ProviderSchoolsView />;
            case 'crm': return <CrmView />;
            case 'hrm': return <HrmView />;
            case 'tools': return <ProviderToolsView />;
            case 'communication': return <ProviderCommsView />;
            case 'concierge': return <ConciergeView />;
            case 'directories': return <ProviderDirectoriesView />;
            case 'system': return <ProviderSystemView />;
            default: return <EmptyState message={t('emptyState.implementationNeeded', { module: l0Id })} />;
        }
    }

    /**
     * Renders the appropriate view for school-based roles (Admin, Teacher, etc.) based on the active module ID.
     * @param {string} l0Id - The ID of the active L0 module.
     * @returns {JSX.Element} The component for the selected module.
     */
    const renderSchoolContent = (l0Id: string) => {
         switch (l0Id) {
            case 'dashboard':
                return (
                    <Routes>
                        <Route path="overview/main" element={<SchoolDashboard />} />
                        <Route path="*" element={<Navigate to="overview/main" replace />} />
                    </Routes>
                );
            case 'school-hub': return <SchoolHubView />;
            case 'tools': return <SchoolToolsView />;
            case 'comms': return <CommsView />;
            case 'knowledge': return <KnowledgeView />;
            case 'concierge': return <ConciergeView />;
            case 'system': return <SchoolSystemView />;
            default: return <EmptyState message={t('emptyState.implementationNeeded', { module: l0Id })} />;
        }
    }
    
    /**
     * Renders the appropriate view for an 'Individual' user based on the active module ID.
     * @param {string} l0Id - The ID of the active L0 module.
     * @returns {JSX.Element} The component for the selected module.
     */
    const renderIndividualContent = (l0Id: string) => {
         switch (l0Id) {
            case 'dashboard':
                 return (
                    <Routes>
                        <Route path="overview/main" element={<IndividualDashboard />} />
                        <Route path="*" element={<Navigate to="overview/main" replace />} />
                    </Routes>
                );
            case 'personal-hub': return <PersonalHubView />;
            case 'tools': return <SchoolToolsView />;
            case 'comms': return <CommsView />;
            case 'knowledge': return <KnowledgeView />;
            case 'concierge': return <ConciergeView />;
            case 'system': return <SchoolSystemView />;
            default: return <EmptyState message={t('emptyState.implementationNeeded', { module: l0Id })} />;
        }
    }
    
    /**
     * A routing component that selects the correct content renderer based on the user's role.
     * @returns {JSX.Element} The appropriate content for the current route and user.
     */
    const ModuleRoutes = () => {
        const { l0_id } = useParams();
        if (!user || !l0_id) return <Navigate to="/login" />;

        if (user.role === 'Provider') {
            return renderProviderContent(l0_id);
        }
        if (user.role === 'Individual') {
            return renderIndividualContent(l0_id);
        }
        // All other school roles
        return renderSchoolContent(l0_id);
    };

    return (
        <div className="flex-1 bg-brand-surface dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-2xl p-4 md:p-6 overflow-auto">
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="/" element={<DefaultRedirector />} />
                    <Route path="/:l0_id/*" element={<ModuleRoutes />} />
                    <Route path="*" element={<EmptyState message="Page not found." />} />
                </Routes>
            </Suspense>
        </div>
    );
};

export default ContentArea;
