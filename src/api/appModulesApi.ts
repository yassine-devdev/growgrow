import { z } from 'zod';
import * as schemas from '@/api/schemas/appModulesSchemas';
import type { MarketingCampaign, CampaignFormData, AuthSettings, VersionControlCommit, TransactionFormData, MarketingProject, DirectorySchool, DirectoryStaff, DirectoryPartner, EmailTemplate, EmailTemplateFormData, Report, Update, FinanceBudget, MarketingAnalyticsData, Transaction, AuditLog, Integration, MultiTenancySettings, BackupConfig, BulkOperation, LegalDocument, ApiKeyAnalytics, StudioDesignTemplate, StudioBrandKit, StudioVideoProject, StudioCodeProject, StudioOfficeDoc, StudioAsset } from '@/api/schemas/appModulesSchemas';
import { PaginatedResponse } from '@/types/index.ts';
import { apiClient } from './apiClient';
import { buildApiUrl } from './apiHelpers';
// FIX: Import Data Studio schemas from the consolidated appModulesSchemas file.
import { DataConnector, dataConnectorSchema, DataConnectorFormData, ConnectorSchema, connectorSchema } from '@/api/schemas/appModulesSchemas';

// --- API FUNCTIONS ---

// Tools
export const getMarketingProjects = async (): Promise<MarketingProject[]> => {
    const data = await apiClient<MarketingProject[]>('/tools/marketing-projects');
    return schemas.marketingProjectSchema.array().parse(data);
};

export const saveMarketingProject = (project: MarketingProject): Promise<MarketingProject> => {
    return apiClient('/tools/marketing-projects', { method: 'POST', body: JSON.stringify(project) });
};

export const getDashboardTemplates = async (): Promise<schemas.DashboardTemplate[]> => {
    const data = await apiClient<schemas.DashboardTemplate[]>('/tools/dashboard-templates');
    return schemas.dashboardTemplateSchema.array().parse(data);
};

export const getMarketingCampaigns = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<MarketingCampaign>> => {
    return apiClient(buildApiUrl('/tools/marketing-campaigns', options));
};
export const addCampaign = (data: CampaignFormData): Promise<MarketingCampaign> => {
    return apiClient('/tools/marketing-campaigns', { method: 'POST', body: JSON.stringify(data) });
};
export const deleteMarketingCampaign = (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/tools/marketing-campaigns/${id}`, { method: 'DELETE' });
};

export const getMarketingAnalytics = async (): Promise<MarketingAnalyticsData> => {
    const data = await apiClient<MarketingAnalyticsData>('/tools/marketing-analytics');
    return schemas.marketingAnalyticsSchema.parse(data);
};
export const getFinanceBudgets = async (): Promise<FinanceBudget[]> => {
    return apiClient('/tools/finance-budgets');
};
export const getUpdates = async (): Promise<Update[]> => {
    return apiClient('/tools/updates');
};
export const getVersionControlCommits = async (): Promise<VersionControlCommit[]> => {
    return apiClient('/tools/version-control');
};
export const getReports = async (): Promise<Report[]> => {
    return apiClient('/tools/reports');
};


// Communication
export const getEmails = async (): Promise<schemas.Email[]> => {
    const data = await apiClient<schemas.Email[]>('/communication/emails');
    return schemas.emailSchema.array().parse(data);
};
export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
    const data = await apiClient<EmailTemplate[]>('/communication/templates');
    return schemas.emailTemplateSchema.array().parse(data);
};
export const addEmailTemplate = (data: EmailTemplateFormData): Promise<EmailTemplate> => {
    return apiClient('/communication/templates', { method: 'POST', body: JSON.stringify(data) });
};
export const updateEmailTemplate = (id: string, data: EmailTemplateFormData): Promise<EmailTemplate> => {
    return apiClient(`/communication/templates/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};
export const deleteEmailTemplate = (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/communication/templates/${id}`, { method: 'DELETE' });
};

// Directories
export const getDirectorySchools = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<DirectorySchool>> => {
    return apiClient(buildApiUrl('/directories/schools', options));
};
export const getDirectoryStaff = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<DirectoryStaff>> => {
    return apiClient(buildApiUrl('/directories/staff', options));
};
export const getDirectoryPartners = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<DirectoryPartner>> => {
    return apiClient(buildApiUrl('/directories/partners', options));
};

// System
export const getSystemBranding = async (): Promise<schemas.SystemBranding> => {
    const data = await apiClient<schemas.SystemBranding>('/system/branding');
    return schemas.systemBrandingSchema.parse(data);
};
export const getSecurityRoles = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<schemas.SecurityRole>> => {
    return apiClient(buildApiUrl('/system/roles', options));
};
export const getAuthSettings = async (): Promise<AuthSettings> => {
    const data = await apiClient<AuthSettings>('/system/auth-settings');
    return schemas.authSettingsSchema.parse(data);
};
export const saveAuthSettings = (data: AuthSettings): Promise<AuthSettings> => {
    return apiClient('/system/auth-settings', { method: 'POST', body: JSON.stringify(data) });
};
export const getApiKeys = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<schemas.ApiKey>> => {
    return apiClient(buildApiUrl('/system/api-keys', options));
};
export const getBackups = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<schemas.Backup>> => {
    return apiClient(buildApiUrl('/system/backups', options));
};
export const getAuditLogs = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<AuditLog>> => {
    return apiClient(buildApiUrl('/system/audit-logs', options));
};
export const getIntegrations = async (): Promise<Integration[]> => apiClient('/system/integrations');
export const getMultiTenancySettings = async (): Promise<MultiTenancySettings> => apiClient('/system/multi-tenancy');
export const saveMultiTenancySettings = (data: MultiTenancySettings): Promise<MultiTenancySettings> => apiClient('/system/multi-tenancy', { method: 'POST', body: JSON.stringify(data) });
export const getBackupConfig = async (): Promise<BackupConfig> => apiClient('/system/backup-config');
export const saveBackupConfig = (data: BackupConfig): Promise<BackupConfig> => apiClient('/system/backup-config', { method: 'POST', body: JSON.stringify(data) });
export const getBulkOperations = async (): Promise<BulkOperation[]> => apiClient('/system/bulk-operations');
export const getLegalDocuments = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<LegalDocument>> => apiClient(buildApiUrl('/system/legal-documents', options));
export const getApiKeyAnalytics = async (): Promise<ApiKeyAnalytics> => apiClient('/system/api-key-analytics');
export const getSystemLogs = async (): Promise<string[]> => apiClient('/system/system-logs');


// Overlay Apps
export const getMedia = async (): Promise<schemas.MediaItem[]> => apiClient('/overlay/media');
export const getLeaderboard = async (): Promise<schemas.LeaderboardEntry[]> => apiClient('/overlay/leaderboard');
export const getFlights = async (): Promise<schemas.Flight[]> => apiClient('/overlay/flights');
export const getLifestyleServices = async (): Promise<schemas.LifestyleService[]> => apiClient('/overlay/lifestyle-services');
export const getHobbies = async (): Promise<schemas.Hobby[]> => apiClient('/overlay/hobbies');
export const getKnowledgeArticles = async (): Promise<schemas.KnowledgeArticle[]> => apiClient('/overlay/knowledge');
export const getSportsGames = async (): Promise<schemas.SportsGame[]> => apiClient('/overlay/sports');
export const getReligionEvents = async (): Promise<schemas.ReligionEvent[]> => apiClient('/overlay/religion');
export const getProServices = async (): Promise<schemas.ProService[]> => apiClient('/overlay/services');
export const getFinanceData = async (): Promise<schemas.FinanceData> => apiClient('/overlay/finance');
export const addTransaction = (data: TransactionFormData): Promise<Transaction> => {
    return apiClient('/overlay/finance/transactions', { method: 'POST', body: JSON.stringify(data) });
};

// Data Studio
export const getDataConnectors = async (): Promise<DataConnector[]> => {
    const data = await apiClient<DataConnector[]>('/datastudio/connectors');
    return dataConnectorSchema.array().parse(data);
};

export const addConnector = (data: DataConnectorFormData): Promise<DataConnector> => {
    return apiClient('/datastudio/connectors', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const getConnectorSchema = async (type: DataConnectorFormData['type']): Promise<ConnectorSchema> => {
    const data = await apiClient<ConnectorSchema>(`/datastudio/connectors/schema?type=${encodeURIComponent(type)}`);
    return connectorSchema.parse(data);
};

// FIX: Add API client functions for Studio components
// Studio
export const getStudioDesignTemplates = async (): Promise<StudioDesignTemplate[]> => apiClient('/studio/templates');
export const getStudioBrandKits = async (): Promise<StudioBrandKit[]> => apiClient('/studio/brand-kits');
export const getStudioVideoProjects = async (): Promise<StudioVideoProject[]> => apiClient('/studio/video-projects');
export const getStudioCodeProjects = async (): Promise<StudioCodeProject> => apiClient('/studio/code-projects');
export const getStudioOfficeDocs = async (): Promise<StudioOfficeDoc[]> => apiClient('/studio/office-docs');
export const getStudioMarketplaceAssets = async (): Promise<StudioAsset[]> => apiClient('/studio/marketplace-assets');