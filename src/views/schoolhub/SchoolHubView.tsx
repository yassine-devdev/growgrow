import React, { lazy, Suspense } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getCourses, getGrades } from '../../api/schoolHubApi';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import * as schemas from '../../api/schemas/schoolHubSchemas';
import { Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import EmptyState from '../EmptyState';


const TeacherGradebook = lazy(() => import('./academics/TeacherGradebook'));
const AssignmentView = lazy(() => import('./academics/AssignmentView'));
const PaymentView = lazy(() => import('./billing/PaymentView'));
const BillingSummary = lazy(() => import('./billing/BillingSummary'));
const AssignmentsManager = lazy(() => import('./academics/AssignmentsManager'));
const TeacherAssignmentSubmissions = lazy(() => import('./academics/TeacherAssignmentSubmissions'));
const StudentAssignments = lazy(() => import('./academics/StudentAssignments'));
const LessonPlannerView = lazy(() => import('./planning/LessonPlannerView'));
const TeachersManager = lazy(() => import('@/views/schools/users/TeachersManager'));
const StudentsManager = lazy(() => import('@/views/schools/users/StudentsManager'));
const ParentsManager = lazy(() => import('@/views/schools/users/ParentsManager'));
const CourseDetailView = lazy(() => import('./academics/CourseDetailView'));


const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

type Course = z.infer<typeof schemas.courseSchema>;
type Grade = z.infer<typeof schemas.gradeSchema>;

// --- ROLE-SPECIFIC COMPONENTS ---
const TeacherCourses = () => {
    const { data, isLoading } = useQuery<Course[]>({ queryKey: ['courses', 'Teacher'], queryFn: () => getCourses('Teacher') });
    if (isLoading) return <LoadingSpinner />;
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data?.map((c) => (
                    <Link key={c.id} to={`/school-hub/academics/courses/${c.id}`} className="block p-4 bg-brand-surface-alt rounded-lg hover:shadow-md hover:ring-2 hover:ring-brand-primary transition-all">
                        <p className="font-bold">{c.name}</p>
                        <p className="text-sm">{c.students} students</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const StudentCourseList = () => {
    const { data, isLoading } = useQuery<Course[]>({ queryKey: ['courses', 'Student'], queryFn: () => getCourses('Student') });
     if (isLoading) return <LoadingSpinner />;
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.map((c) => (
                     <Link key={c.id} to={`/school-hub/academics/courses/${c.id}`} className="block p-4 bg-brand-surface-alt rounded-lg hover:shadow-md hover:ring-2 hover:ring-brand-primary transition-all">
                        <p className="font-bold">{c.name}</p>
                        <p className="text-sm">Taught by {c.teacher}</p>
                        <p className="text-sm">Period {c.period}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

const StudentGrades = () => {
    const { data, isLoading } = useQuery<Grade[]>({ queryKey: ['grades', 'some-student-id'], queryFn: () => getGrades('some-student-id') });
    if (isLoading) return <LoadingSpinner />;
    return <div className="grid grid-cols-3 gap-4">{data?.map((g) => <div key={g.courseId} className="p-4 bg-brand-surface-alt rounded-lg"><p className="font-bold">{g.courseName}</p><p className="text-2xl font-bold text-brand-primary">{g.grade}</p></div>)}</div>;
};

const HubRouter: React.FC = () => {
    const user = useAppStore((state) => state.user);
    const { l1_id, l2_id } = useParams();

    if (!user || !l1_id) return <Navigate to="/" />;

    // Redirect base L1 paths to their first L2 child if l2_id is not present
    if (!l2_id) {
        if (l1_id === 'people') return <Navigate to="teachers" replace />;
        // Add other L1 redirects as needed, otherwise show an empty state or the first child's content
    }

    // --- Student & Parent Views ---
    if (user.role === 'Student' || user.role === 'Parent') {
        if (l1_id === 'academics') {
            if (l2_id === 'courses') return <StudentCourseList />;
            if (l2_id === 'assignments') return <StudentAssignments />;
            if (l2_id === 'grades') return <StudentGrades />;
        }
        if (l1_id === 'billing') {
            if (l2_id === 'pay-fees') return <PaymentView />;
        }
        return <EmptyState message={`This view is not available for your role.`} />;
    }

    // --- Teacher & Admin Views ---
    if (user.role === 'Teacher' || user.role === 'Admin' || user.role === 'Admissions') {
        if (l1_id === 'academics') {
            if (l2_id === 'courses') return <TeacherCourses />;
            if (l2_id === 'assignments') return <AssignmentsManager />;
            if (l2_id === 'grades') return <TeacherGradebook />;
        }
        if (l1_id === 'people') {
            if (l2_id === 'students') return <StudentsManager />;
            if (l2_id === 'teachers') return <TeachersManager />;
            if (l2_id === 'parents') return <ParentsManager />;
        }
        if (l1_id === 'planning') {
             if (l2_id === 'lesson-plans') return <LessonPlannerView />;
        }
         if (l1_id === 'billing') {
            return <BillingSummary />;
        }
    }

    return <EmptyState message={`The view for ${l1_id}/${l2_id} is under construction.`} />;
}


const SchoolHubView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route index element={<Navigate to="academics/courses" replace />} />
                <Route path="academics/courses/:courseId" element={<CourseDetailView />} />
                <Route path="academics/assignments/:assignmentId" element={<AssignmentView />} />
                <Route path="academics/assignments/:assignmentId/submissions" element={<TeacherAssignmentSubmissions />} />
                
                {/* Let HubRouter handle both L1-only and L1/L2 routes */}
                <Route path=":l1_id" element={<HubRouter />} />
                <Route path=":l1_id/:l2_id/*" element={<HubRouter />} />
            </Routes>
        </Suspense>
    );
};

export default SchoolHubView;