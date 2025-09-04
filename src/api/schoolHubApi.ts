import * as schemas from './schemas/schoolHubSchemas';
import type { User } from '@/types/index.ts';
import type { SchoolBillingSummary, Person, NotificationSettings, Announcement, AnnouncementFormData, GradebookData, StudentGrade, Assignment, AssignmentFormData, AssignmentSubmissions, CourseDetail, MessageFormData } from './schemas/schoolHubSchemas';
import { PaginatedResponse } from '@/types/index.ts';
import { apiClient } from './apiClient';

const buildApiUrl = (base: string, options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }) => {
    const params = new URLSearchParams({
        page: String(options.pageIndex + 1),
        pageSize: String(options.pageSize),
    });
    if (options.sorting.length > 0) {
        params.append('sortBy', options.sorting[0].id);
        params.append('order', options.sorting[0].desc ? 'desc' : 'asc');
    }
    if (options.globalFilter) {
        params.append('search', options.globalFilter);
    }
    return `${base}?${params.toString()}`;
};


// --- API FUNCTIONS ---
export const getCourses = async (role: string): Promise<schemas.Course[]> => {
    const data = await apiClient<schemas.Course[]>(`/school-hub/courses?role=${role}`);
    return schemas.courseSchema.array().parse(data);
};

export const getCourseDetails = async (courseId: string): Promise<CourseDetail> => {
    const data = await apiClient<CourseDetail>(`/school-hub/courses/${courseId}`);
    return schemas.courseDetailSchema.parse(data);
};

export const getGrades = async (studentId: string): Promise<schemas.Grade[]> => {
    const data = await apiClient<schemas.Grade[]>(`/school-hub/grades/${studentId}`);
    return schemas.gradeSchema.array().parse(data);
};

export const getSchoolBillingSummary = async (): Promise<SchoolBillingSummary> => {
    const data = await apiClient<SchoolBillingSummary>('/school-hub/billing-summary');
    return schemas.schoolBillingSummarySchema.parse(data);
};

export const getStudentsList = (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<Person>> => {
    return apiClient(buildApiUrl('/school-hub/people/students', options));
};

export const getTeachersList = (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<Person>> => {
    return apiClient(buildApiUrl('/school-hub/people/teachers', options));
};

export const getCalendarEvents = async (): Promise<schemas.CalendarEvent[]> => {
    const data = await apiClient<schemas.CalendarEvent[]>('/school-hub/calendar');
    return schemas.calendarEventSchema.array().parse(data);
};

export const getMessages = async (): Promise<schemas.Message[]> => {
    const data = await apiClient<schemas.Message[]>('/school-hub/messages');
    return schemas.messageSchema.array().parse(data);
};

export const sendMessage = (data: MessageFormData): Promise<{ success: boolean }> => {
    return apiClient('/school-hub/messages', {
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
    const data = await apiClient<Announcement[]>('/school-hub/announcements');
    return schemas.announcementSchema.array().parse(data);
};

export const addAnnouncement = (data: AnnouncementFormData): Promise<Announcement> => {
    return apiClient('/school-hub/announcements', { method: 'POST', body: JSON.stringify(data) });
};

export const updateAnnouncement = (id: number, data: AnnouncementFormData): Promise<Announcement> => {
    return apiClient(`/school-hub/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteAnnouncement = (id: number): Promise<{ success: boolean }> => {
    return apiClient(`/school-hub/announcements/${id}`, { method: 'DELETE' });
};

export const getResources = async (): Promise<schemas.Resource[]> => {
    const data = await apiClient<schemas.Resource[]>('/school-hub/resources');
    return schemas.resourceSchema.array().parse(data);
};

export const getProfile = async (user: User | null): Promise<schemas.Profile> => {
    if (!user) throw new Error("User not authenticated");
    const data = await apiClient<schemas.Profile>('/system/profile');
    return schemas.profileSchema.parse(data);
};

export const updateProfile = (data: schemas.ProfileFormData): Promise<schemas.Profile> => {
    return apiClient('/system/profile', { method: 'PUT', body: JSON.stringify(data) });
};

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
    const data = await apiClient<NotificationSettings>('/system/notification-settings');
    return schemas.notificationSettingsSchema.parse(data);
};

export const updateNotificationSettings = (data: NotificationSettings): Promise<NotificationSettings> => {
    return apiClient('/system/notification-settings', { method: 'PUT', body: JSON.stringify(data) });
};

export const getGradebookData = async (courseId: string): Promise<GradebookData> => {
    const data = await apiClient<GradebookData>(`/school-hub/gradebook/${courseId}`);
    return schemas.gradebookSchema.parse(data);
};

export const updateGrade = (data: { studentId: string, assignmentId: string, score: number | null, feedback?: string }): Promise<StudentGrade> => {
    return apiClient('/school-hub/gradebook/grade', { method: 'POST', body: JSON.stringify(data) });
};

export const generateAiFeedback = async (data: { studentName: string; assignmentTitle: string; score: number | null; maxPoints: number; currentFeedback?: string }): Promise<{ feedback: string }> => {
    const response = await apiClient<{ feedback: string }>('/school-hub/ai/feedback', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response;
};

export const getAssignments = (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<Assignment>> => {
    return apiClient(buildApiUrl('/school-hub/assignments', options));
};

export const addAssignment = (data: AssignmentFormData): Promise<Assignment> => {
    return apiClient('/school-hub/assignments', { method: 'POST', body: JSON.stringify(data) });
};

export const updateAssignment = (id: string, data: AssignmentFormData): Promise<Assignment> => {
    return apiClient(`/school-hub/assignments/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteAssignment = (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/school-hub/assignments/${id}`, { method: 'DELETE' });
};

export const getAssignmentSubmissions = async (assignmentId: string): Promise<AssignmentSubmissions> => {
    const data = await apiClient<AssignmentSubmissions>(`/school-hub/assignments/${assignmentId}/submissions`);
    return schemas.assignmentSubmissionsSchema.parse(data);
};