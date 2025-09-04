import * as schemas from './schemas/dashboardSchemas';
import { apiClient } from './apiClient';

// --- API FUNCTIONS ---
export const getAdminDashboardData = async (): Promise<schemas.AdminDashboardData> => {
    const data = await apiClient<schemas.AdminDashboardData>('/dashboards/admin');
    return schemas.adminDashboardSchema.parse(data);
};

export const getTeacherDashboardData = async (): Promise<schemas.TeacherDashboardData> => {
    const data = await apiClient<schemas.TeacherDashboardData>('/dashboards/teacher');
    return schemas.teacherDashboardSchema.parse(data);
};

// FIX: Removed unused userId parameter to align with backend API. The backend identifies the user via auth cookie.
export const getStudentDashboardData = async (): Promise<schemas.StudentDashboardData> => {
    const data = await apiClient<schemas.StudentDashboardData>('/dashboards/student');
    return schemas.studentDashboardSchema.parse(data);
};

export const getParentDashboardData = async (): Promise<schemas.ParentDashboardData> => {
    const data = await apiClient<schemas.ParentDashboardData>('/dashboards/parent');
    return schemas.parentDashboardSchema.parse(data);
};

export const getAdmissionsDashboardData = async (): Promise<schemas.AdmissionsDashboardData> => {
    const data = await apiClient<schemas.AdmissionsDashboardData>('/dashboards/admissions');
    return schemas.admissionsDashboardSchema.parse(data);
};

export const getIndividualDashboardData = async (): Promise<schemas.IndividualDashboardData> => {
    const data = await apiClient<schemas.IndividualDashboardData>('/dashboards/individual');
    return schemas.individualDashboardSchema.parse(data);
};