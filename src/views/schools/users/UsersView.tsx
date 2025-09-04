import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AdminsManager = lazy(() => import('@/views/schools/users/AdminsManager'));
const TeachersManager = lazy(() => import('@/views/schools/users/TeachersManager'));
const StudentsManager = lazy(() => import('@/views/schools/users/StudentsManager'));
const ParentsManager = lazy(() => import('@/views/schools/users/ParentsManager'));

const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
    </div>
);

const UsersView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route index element={<Navigate to="admins" replace />} />
                <Route path="admins" element={<AdminsManager />} />
                <Route path="teachers" element={<TeachersManager />} />
                <Route path="students" element={<StudentsManager />} />
                <Route path="parents" element={<ParentsManager />} />
            </Routes>
        </Suspense>
    );
};

export default UsersView;
