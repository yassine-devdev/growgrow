import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import EmptyState from '../EmptyState';

const OnboardingView = lazy(() => import('@/views/schools/onboarding/OnboardingView'));
const UsersView = lazy(() => import('@/views/schools/users/UsersView'));
const BillingView = lazy(() => import('@/views/schools/billing/BillingView'));
const WhiteLabelView = lazy(() => import('@/views/schools/whitelabel/WhiteLabelView'));
const SupportView = lazy(() => import('@/views/schools/support/SupportView'));
const ProviderSchoolDetailView = lazy(() => import('@/views/schools/details/ProviderSchoolDetailView'));
const ManageSchools = lazy(() => import('@/views/schools/onboarding/ManageSchools'));
const CustomerSuccessView = lazy(() => import('@/views/schools/success/CustomerSuccessView'));


/**
 * A fallback component to display while lazy-loaded views are being fetched.
 * @returns {JSX.Element} A loading spinner.
 */
const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
    </div>
);

const ManagementRouter: React.FC = () => {
    const { l2_id } = useParams();
    if (l2_id === 'all-schools') {
        return <ManageSchools />;
    }
    return <EmptyState message="View not found" />;
};


/**
 * The main router for the 'Schools' module in the Provider view.
 * It handles routing to different school management sections like Onboarding, Users, Billing, etc.
 *
 * @returns {JSX.Element} The rendered router for the schools module.
 */
const ProviderSchoolsView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route index element={<Navigate to="management/all-schools" replace />} />
                
                {/* New Detail Route for Command Center drill-down */}
                <Route path="detail/:schoolId" element={<ProviderSchoolDetailView />} />

                <Route path="management/*" element={<ManagementRouter />} />
                <Route path="onboarding/*" element={<OnboardingView />} />
                <Route path="users/*" element={<UsersView />} />
                <Route path="customer-success/*" element={<CustomerSuccessView />} />
                <Route path="billing/*" element={<BillingView />} />
                <Route path="white-labeling/*" element={<WhiteLabelView />} />
                <Route path="support/*" element={<SupportView />} />
            </Routes>
        </Suspense>
    );
};

export default ProviderSchoolsView;
