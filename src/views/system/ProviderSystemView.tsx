import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import EmptyState from '../EmptyState';
import { Loader2 } from 'lucide-react';

// Lazy-load all the new view components for the system module
const GeneralSettingsView = lazy(() => import('./provider/GeneralSettingsView'));
const SecurityView = lazy(() => import('./provider/SecurityView'));
const IntegrationsView = lazy(() => import('./provider/IntegrationsView'));
const DeveloperPlatformView = lazy(() => import('./provider/DeveloperPlatformView'));
const ApiKeysView = lazy(() => import('./provider/ApiKeysView'));
const LogsView = lazy(() => import('./provider/LogsView'));
const BackupRecoveryView = lazy(() => import('./provider/BackupRecoveryView'));
const MultiTenancyView = lazy(() => import('./provider/MultiTenancyView'));
const BulkOperationsView = lazy(() => import('./provider/BulkOperationsView'));
const LegalComplianceView = lazy(() => import('./provider/LegalComplianceView'));

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;


const SystemRouter: React.FC = () => {
    const { l1_id } = useParams();
    
    switch(l1_id) {
        case 'general-settings': return <GeneralSettingsView />;
        case 'security': return <SecurityView />;
        case 'integrations': return <IntegrationsView />;
        case 'developer-platform': return <DeveloperPlatformView />;
        case 'api-keys': return <ApiKeysView />;
        case 'logs': return <LogsView />;
        case 'backup-recovery': return <BackupRecoveryView />;
        case 'multi-tenancy': return <MultiTenancyView />;
        case 'bulk-operations': return <BulkOperationsView />;
        case 'legal-compliance': return <LegalComplianceView />;
        default: return <EmptyState message={`The ${l1_id} module is coming soon.`} />;
    }
};

// --- Main View Component ---

const ProviderSystemView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route index element={<Navigate to="general-settings/provider-profile" replace />} />
                {/* This path now handles all nested routes within each L1 section */}
                <Route path=":l1_id/*" element={<SystemRouter />} />
                <Route path="*" element={<EmptyState message="System view not found." />} />
            </Routes>
        </Suspense>
    );
};

export default ProviderSystemView;
