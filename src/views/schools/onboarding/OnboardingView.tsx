import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const NewSchoolForm = lazy(() => import('@/views/schools/onboarding/NewSchoolForm'));
const OnboardingDocs = lazy(() => import('@/views/schools/onboarding/OnboardingDocs'));
const OnboardingConfig = lazy(() => import('@/views/schools/onboarding/OnboardingConfig'));

/**
 * A fallback component to display while lazy-loaded onboarding sections are being fetched.
 * @returns {JSX.Element} A loading spinner.
 */
const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
    </div>
);

/**
 * A router for the 'Onboarding' section within the Provider's 'Schools' module.
 * It handles navigation between the new school form, documentation, and configuration pages.
 *
 * @returns {JSX.Element} The rendered router for the onboarding section.
 */
const OnboardingView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route index element={<Navigate to="new-school-wizard" replace />} />
                <Route path="new-school-wizard" element={<NewSchoolForm />} />
                <Route path="required-docs" element={<OnboardingDocs />} />
                <Route path="config-setup" element={<OnboardingConfig />} />
            </Routes>
        </Suspense>
    );
};

export default OnboardingView;