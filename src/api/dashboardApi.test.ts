/**
 * @jest-environment jsdom
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import * as dashboardApi from './dashboardApi';
import { apiClient } from './apiClient';
import * as schemas from './schemas/dashboardSchemas';

// Mock the apiClient module
jest.mock('./apiClient', () => ({
  apiClient: jest.fn(),
}));

const mockedApiClient = apiClient as jest.Mock;

describe('dashboardApi', () => {
  beforeEach(() => {
    mockedApiClient.mockClear();
  });

  it('getAdminDashboardData should fetch from the correct endpoint and parse data', async () => {
    const mockData: schemas.AdminDashboardData = {
      stats: [{ label: 'Students', value: '1,234', icon: 'Users' }],
      enrollmentTrend: [{ name: 'Jan', students: 1200 }],
      actionItems: [{ id: '1', text: 'Review applications', icon: 'FileCheck', link: '#' }],
      recentAnnouncements: [{ id: '1', title: 'Welcome Back', date: '2024-09-01' }],
    };
    mockedApiClient.mockImplementation(() => Promise.resolve(mockData));

    const result = await dashboardApi.getAdminDashboardData();
    
    expect(mockedApiClient).toHaveBeenCalledWith('/dashboards/admin');
    expect(result).toEqual(mockData);
    // Zod parsing is implicitly tested by the function itself
    expect(() => schemas.adminDashboardSchema.parse(result)).not.toThrow();
  });

  it('getTeacherDashboardData should fetch from the correct endpoint and parse data', async () => {
    const mockData: schemas.TeacherDashboardData = {
      stats: [{ label: 'Classes', value: '5', icon: 'BookOpen' }],
      schedule: [{ time: '09:00', subject: 'Math', class: 'Grade 10' }],
      assignmentsToGrade: [{ id: 'a1', title: 'Algebra Homework', course: 'Math', courseId: 'M10', dueDate: 'Tomorrow' }],
      classrooms: [{ id: 'c1', name: 'Homeroom 10B', attendance: { present: 28, total: 30 }, roster: ['Student A'] }]
    };
    mockedApiClient.mockImplementation(() => Promise.resolve(mockData));

    const result = await dashboardApi.getTeacherDashboardData();

    expect(mockedApiClient).toHaveBeenCalledWith('/dashboards/teacher');
    expect(result).toEqual(mockData);
    expect(() => schemas.teacherDashboardSchema.parse(result)).not.toThrow();
  });

  it('getStudentDashboardData should fetch from the correct endpoint', async () => {
    mockedApiClient.mockImplementation(() => Promise.resolve({ stats: [], grades: [], upcomingAssignments: [] }));
    await dashboardApi.getStudentDashboardData();
    expect(mockedApiClient).toHaveBeenCalledWith('/dashboards/student');
  });

  it('getParentDashboardData should fetch from the correct endpoint', async () => {
    mockedApiClient.mockImplementation(() => Promise.resolve({ children: [], announcements: [], fees: { amountDue: 0, dueDate: '' }, upcomingDeadlines: [], recentGrades: [] }));
    await dashboardApi.getParentDashboardData();
    expect(mockedApiClient).toHaveBeenCalledWith('/dashboards/parent');
  });

  it('getAdmissionsDashboardData should fetch from the correct endpoint', async () => {
    mockedApiClient.mockImplementation(() => Promise.resolve({ stats: [], applicationTrend: [], needsReview: [], applicantFunnel: [], demographics: [] }));
    await dashboardApi.getAdmissionsDashboardData();
    expect(mockedApiClient).toHaveBeenCalledWith('/dashboards/admissions');
  });

  it('getIndividualDashboardData should fetch from the correct endpoint', async () => {
    mockedApiClient.mockImplementation(() => Promise.resolve({ stats: [], recentActivity: [], suggestions: [] }));
    await dashboardApi.getIndividualDashboardData();
    expect(mockedApiClient).toHaveBeenCalledWith('/dashboards/individual');
  });
});