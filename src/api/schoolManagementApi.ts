import {
    type Admin,
    type Teacher,
    type SchoolUser,
    type Domain,
    type BrandingSettings,
    type AdminFormData,
    type TeacherFormData,
    type StudentFormData,
    type ParentFormData,
    type DomainFormData,
    type Invoice,
    type InvoiceFormData,
    type Expense,
    type ExpenseFormData,
    type ProviderSchool,
    type ProviderSchoolFormData,
    type SupportTicket,
    type KbAnalytics,
    type Subscription,
    type Theme,
} from '@/api/schemas/schoolManagementSchemas';
import { PaginatedResponse } from '@/types/index.ts';
import { apiClient } from './apiClient';
import { buildApiUrl } from './apiHelpers';

// --- API FUNCTIONS ---

// Provider Schools
export const getProviderSchools = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<ProviderSchool>> => {
    return apiClient(buildApiUrl('/schools/provider-view', options));
};
export const updateSchool = (id: string, data: ProviderSchoolFormData): Promise<ProviderSchool> => {
    return apiClient(`/schools/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};
export const deleteSchool = (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/schools/${id}`, { method: 'DELETE' });
};

// Admins
export const getAdmins = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<Admin>> => {
    return apiClient(buildApiUrl('/users/admins', options));
};
export const addAdmin = (data: AdminFormData): Promise<Admin> => {
    return apiClient('/users/admins', { method: 'POST', body: JSON.stringify(data) });
};
export const updateAdmin = (id: string, data: AdminFormData): Promise<Admin> => {
    return apiClient(`/users/admins/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};
export const deleteAdmin = (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/users/admins/${id}`, { method: 'DELETE' });
};

// Teachers
export const getTeachers = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<Teacher>> => {
    return apiClient(buildApiUrl('/users/teachers', options));
};
export const addTeacher = (data: TeacherFormData): Promise<Teacher> => {
    return apiClient('/users/teachers', { method: 'POST', body: JSON.stringify(data) });
};
export const updateTeacher = (id: string, data: TeacherFormData): Promise<Teacher> => {
    return apiClient(`/users/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};
export const deleteTeacher = (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/users/teachers/${id}`, { method: 'DELETE' });
};

// Students
export const getStudents = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<SchoolUser>> => {
    return apiClient(buildApiUrl('/users/students', options));
};
export const addStudent = (data: StudentFormData): Promise<SchoolUser> => {
    return apiClient('/users/students', { method: 'POST', body: JSON.stringify(data) });
};
export const updateStudent = (id: string, data: StudentFormData): Promise<SchoolUser> => {
    return apiClient(`/users/students/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};
export const deleteStudent = (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/users/students/${id}`, { method: 'DELETE' });
};

// Parents
export const getParents = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<SchoolUser>> => {
    return apiClient(buildApiUrl('/users/parents', options));
};
export const addParent = (data: ParentFormData): Promise<SchoolUser> => {
    return apiClient('/users/parents', { method: 'POST', body: JSON.stringify(data) });
};
export const updateParent = (id: string, data: ParentFormData): Promise<SchoolUser> => {
    return apiClient(`/users/parents/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};
export const deleteParent = (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/users/parents/${id}`, { method: 'DELETE' });
};

// Billing
export const getSubscriptions = (options: { planFilter: string; statusFilter: string; }): Promise<Subscription[]> => {
    const params = new URLSearchParams();
    if (options.planFilter !== 'All') params.append('plan', options.planFilter);
    if (options.statusFilter !== 'All') params.append('status', options.statusFilter);
    return apiClient(`/billing/subscriptions?${params.toString()}`);
};
export const getInvoices = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<Invoice>> => {
    return apiClient(buildApiUrl('/billing/invoices', options));
};
export const addInvoice = (data: InvoiceFormData): Promise<Invoice> => {
    return apiClient('/billing/invoices', { method: 'POST', body: JSON.stringify(data) });
};
export const updateInvoice = (id: string, data: InvoiceFormData): Promise<Invoice> => {
    return apiClient(`/billing/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};
export const deleteInvoice = (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/billing/invoices/${id}`, { method: 'DELETE' });
};

// Expenses
export const getExpenses = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<Expense>> => {
    return apiClient(buildApiUrl('/expenses', options));
};

export const addExpense = async (data: ExpenseFormData): Promise<Expense> => {
    return apiClient('/expenses', { method: 'POST', body: JSON.stringify(data) });
};

export const updateExpense = async (id: string, data: ExpenseFormData): Promise<Expense> => {
    return apiClient(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteExpense = async (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/expenses/${id}`, { method: 'DELETE' });
};


// White Label
export const getBrandingSettings = (): Promise<BrandingSettings> => apiClient('/whitelabel/branding');
export const saveBrandingSettings = (data: BrandingSettings): Promise<{ success: boolean; message: string }> => {
    return apiClient('/whitelabel/branding', { method: 'POST', body: JSON.stringify(data) });
};
export const getDomains = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<Domain>> => {
    return apiClient(buildApiUrl('/whitelabel/domains', options));
};
export const addDomain = (data: DomainFormData): Promise<Domain> => {
    return apiClient('/whitelabel/domains', { method: 'POST', body: JSON.stringify(data) });
};
export const updateDomain = (id: string, data: DomainFormData): Promise<Domain> => {
    return apiClient(`/whitelabel/domains/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};
export const deleteDomain = (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/whitelabel/domains/${id}`, { method: 'DELETE' });
};
export const getThemes = (): Promise<Theme[]> => apiClient('/whitelabel/themes');

// Support
export const getSupportTickets = (): Promise<SupportTicket[]> => apiClient('/support/tickets');
export const getKbAnalytics = (): Promise<KbAnalytics> => apiClient('/support/kb-analytics');

// AI Helpers
export const getAiExpenseCategory = async (description: string): Promise<{ category: 'Marketing' | 'Software' | 'Office' | 'Travel' }> => {
    return apiClient('/ai/categorize-expense', {
        method: 'POST',
        body: JSON.stringify({ description }),
    });
};