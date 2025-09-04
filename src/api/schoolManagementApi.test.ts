/**
 * @jest-environment jsdom
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import * as schoolManagementApi from './schoolManagementApi';
import { apiClient } from './apiClient';

// Mock the apiClient module
jest.mock('./apiClient', () => ({
  apiClient: jest.fn(),
}));

// Type cast the mocked apiClient to make TypeScript happy
const mockedApiClient = apiClient as jest.Mock;

describe('schoolManagementApi', () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockedApiClient.mockClear();
  });

  describe('URL construction for paginated endpoints', () => {
    it('should construct the correct URL with pagination', async () => {
      await schoolManagementApi.getAdmins({ pageIndex: 0, pageSize: 10, sorting: [] });
      expect(mockedApiClient).toHaveBeenCalledWith('/users/admins?page=1&pageSize=10');
    });

    it('should construct the correct URL with sorting', async () => {
      await schoolManagementApi.getTeachers({ pageIndex: 0, pageSize: 10, sorting: [{ id: 'name', desc: true }] });
      expect(mockedApiClient).toHaveBeenCalledWith('/users/teachers?page=1&pageSize=10&sortBy=name&order=desc');
    });
    
    it('should construct the correct URL with ascending sorting', async () => {
      await schoolManagementApi.getStudents({ pageIndex: 1, pageSize: 20, sorting: [{ id: 'grade', desc: false }] });
      expect(mockedApiClient).toHaveBeenCalledWith('/users/students?page=2&pageSize=20&sortBy=grade&order=asc');
    });

    it('should construct the correct URL with a global filter', async () => {
      await schoolManagementApi.getParents({ pageIndex: 0, pageSize: 10, sorting: [], globalFilter: 'smith' });
      expect(mockedApiClient).toHaveBeenCalledWith('/users/parents?page=1&pageSize=10&search=smith');
    });

    it('should construct the correct URL with all options combined', async () => {
      await schoolManagementApi.getProviderSchools({ pageIndex: 2, pageSize: 15, sorting: [{ id: 'users', desc: true }], globalFilter: 'High School' });
      expect(mockedApiClient).toHaveBeenCalledWith('/schools/provider-view?page=3&pageSize=15&sortBy=users&order=desc&search=High+School');
    });
  });

  describe('Data fetching functions', () => {
    it('getAdmins should fetch data and return it', async () => {
      const mockResponse = { rows: [{ id: 'uuid-1', name: 'Admin User', email: 'admin@test.com', role: 'Admin' as const, school: 'Test School', lastLogin: new Date().toISOString(), status: 'Active' as const }], pageCount: 1, rowCount: 1 };
      mockedApiClient.mockImplementation(() => Promise.resolve(mockResponse));

      const result = await schoolManagementApi.getAdmins({ pageIndex: 0, pageSize: 10, sorting: [] });
      
      expect(result).toEqual(mockResponse);
      expect(mockedApiClient).toHaveBeenCalledWith('/users/admins?page=1&pageSize=10');
    });

    it('getSubscriptions should construct URL with filters', async () => {
      const mockResponse = [{ id: 'sub1', school: 'Test School', plan: 'Pro', status: 'Active', mrr: 500, nextBillingDate: '2025-01-01' }];
      mockedApiClient.mockImplementation(() => Promise.resolve(mockResponse));

      const result = await schoolManagementApi.getSubscriptions({ planFilter: 'Pro', statusFilter: 'Active' });

      expect(result).toEqual(mockResponse);
      expect(mockedApiClient).toHaveBeenCalledWith('/billing/subscriptions?plan=Pro&status=Active');
    });
  });

  describe('Data creation (add) functions', () => {
    it('addAdmin should call apiClient with POST method and correct data', async () => {
      const newAdminData = { name: 'New Admin', email: 'new@admin.com', school: 'Test School', status: 'Active' as const };
      const mockResponse = { id: 'new-uuid', ...newAdminData, role: 'Admin' as const, lastLogin: new Date().toISOString() };
      mockedApiClient.mockImplementation(() => Promise.resolve(mockResponse));

      const result = await schoolManagementApi.addAdmin(newAdminData);

      expect(result).toEqual(mockResponse);
      expect(mockedApiClient).toHaveBeenCalledWith('/users/admins', {
        method: 'POST',
        body: JSON.stringify(newAdminData),
      });
    });
  });
  
  describe('Data update functions', () => {
    it('updateTeacher should call apiClient with PUT method and correct data', async () => {
        const teacherId = 'teacher-123';
        const updatedTeacherData = { name: 'Updated Teacher', email: 'updated@teacher.com', school: 'New School', subject: 'Math', yearsExperience: 5, status: 'Active' as const };
        const mockResponse = { id: teacherId, ...updatedTeacherData };
        mockedApiClient.mockImplementation(() => Promise.resolve(mockResponse));

        const result = await schoolManagementApi.updateTeacher(teacherId, updatedTeacherData);
        
        expect(result).toEqual(mockResponse);
        expect(mockedApiClient).toHaveBeenCalledWith(`/users/teachers/${teacherId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedTeacherData),
        });
    });
  });
  
  describe('Data deletion functions', () => {
      it('deleteSchool should call apiClient with DELETE method', async () => {
          const schoolId = 'school-to-delete';
          const mockResponse = { success: true };
          mockedApiClient.mockImplementation(() => Promise.resolve(mockResponse));

          const result = await schoolManagementApi.deleteSchool(schoolId);

          expect(result).toEqual(mockResponse);
          expect(mockedApiClient).toHaveBeenCalledWith(`/schools/${schoolId}`, {
              method: 'DELETE',
          });
      });
  });

  describe('Response Handling', () => {
    it('should correctly handle and return realistic API responses', async () => {
        const mockApiResponse = {
            rows: [
                { id: 'uuid-1', name: 'John Doe', email: 'john@example.com', role: 'Admin', school: 'Main High', lastLogin: new Date().toISOString(), status: 'Active' }
            ],
            pageCount: 5,
            rowCount: 50,
        };
        mockedApiClient.mockImplementation(() => Promise.resolve(mockApiResponse));

        const result = await schoolManagementApi.getAdmins({ pageIndex: 0, pageSize: 10, sorting: [] });

        expect(result).toBe(mockApiResponse);
        expect(result.rows[0].name).toBe('John Doe');
        expect(result.pageCount).toBe(5);
    });
  });
});