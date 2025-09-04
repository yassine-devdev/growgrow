import React, { lazy, Suspense } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Loader2 } from 'lucide-react';

// Lazy load the specific dashboards
const AdminDashboard = lazy(() => import('@/views/dashboards/admin/AdminDashboard'));
const TeacherDashboard = lazy(() => import('@/views/dashboards/teacher/TeacherDashboard'));
const StudentDashboard = lazy(() => import('@/views/dashboards/student/StudentDashboard'));
const ParentDashboard = lazy(() => import('@/views/dashboards/parent/ParentDashboard'));
const AdmissionsDashboard = lazy(() => import('@/views/dashboards/admissions/AdmissionsDashboard'));

/**
 * A fallback component to display while lazy-loaded dashboard sections are being fetched.
 * @returns {JSX.Element} A loading spinner.
 */
const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
    </div>
);

/**
 * A component that selects and renders the correct dashboard based on the logged-in user's role.
 * This component acts as the main content for the '/dashboard' module for all school-related roles.
 * The routing logic that renders this component is now handled in ContentArea.tsx.
 *
 * @returns {JSX.Element} The role-specific dashboard component.
 */
const SchoolDashboard: React.FC = () => {
    const user = useAppStore((state) => state.user);

    return (
        <Suspense fallback={<LoadingFallback />}>
            {(() => {
                switch(user?.role) {
                    case 'Admin': return <AdminDashboard />;
                    case 'Teacher': return <TeacherDashboard />;
                    case 'Student': return <StudentDashboard />;
                    case 'Parent': return <ParentDashboard />;
                    case 'Admissions': return <AdmissionsDashboard />;
                    default: return <div>Generic School Dashboard - Role not found or not implemented</div>;
                }
            })()}
        </Suspense>
    );
};

export default SchoolDashboard;
