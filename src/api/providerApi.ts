import { serviceStatusSchema, incidentSchema, logSchema, alertSchema, type ServiceStatus, type Incident, type Alert } from '@/api/schemas/providerMonitoringSchemas';
import { apiClient } from './apiClient';
import { 
    commandCenterSchema, 
    providerSchoolDetailSchema, 
    providerProfileSchema, 
    providerAnalyticsSchema,
    revenueDataSchema,
    activeUsersDataSchema,
    growthTrendsDataSchema,
    predictiveAnalyticsSchema,
    cohortAnalysisSchema,
    providerFinanceDashboardSchema,
    type CommandCenterData, 
    type ProviderSchoolDetailData, 
    type ProviderProfile, 
    type ProviderProfileFormData,
    type ProviderAnalyticsData,
    type RevenueData,
    type ActiveUsersData,
    type GrowthTrendsData,
    type PredictiveAnalyticsData,
    type CohortAnalysisData,
    type ProviderFinanceDashboardData
} from './schemas/commonSchemas';

/**
 * Fetches general analytics data for the provider dashboard.
 * @param {string} [dateRange='30d'] - The date range for the analytics data.
 * @returns {Promise<ProviderAnalyticsData>} A promise that resolves with stats and chart data.
 */
export const getProviderAnalytics = async (dateRange: string = '30d'): Promise<ProviderAnalyticsData> => {
    const data = await apiClient<ProviderAnalyticsData>(`/provider/analytics?range=${dateRange}`);
    return providerAnalyticsSchema.parse(data);
};

/**
 * Fetches the current status of all monitored services.
 * @returns {Promise<ServiceStatus[]>} A promise that resolves with an array of service status objects, validated against a Zod schema.
 */
export const getServiceStatus = async (): Promise<ServiceStatus[]> => {
    const data = await apiClient<ServiceStatus[]>('/provider/monitoring/services');
    return serviceStatusSchema.array().parse(data);
};

/**
 * Fetches a list of active and recent incidents.
 * @returns {Promise<Incident[]>} A promise that resolves with an array of incident objects, validated against a Zod schema.
 */
export const getActiveIncidents = async (): Promise<Incident[]> => {
    const data = await apiClient<Incident[]>('/provider/monitoring/incidents');
    return incidentSchema.array().parse(data);
};

/**
 * Fetches a stream of live logs from the system.
 * @returns {Promise<string[]>} A promise that resolves with an array of log strings, validated against a Zod schema.
 */
export const getLiveLogs = async (): Promise<string[]> => {
    const data = await apiClient<string[]>('/provider/monitoring/logs');
    return logSchema.parse(data);
};

/**
 * Fetches the latest system-wide alerts.
 * @returns {Promise<Alert[]>} A promise that resolves with an array of alert objects, validated against a Zod schema.
 */
export const getSystemAlerts = async (): Promise<Alert[]> => {
    const data = await apiClient<Alert[]>('/provider/monitoring/alerts');
    return alertSchema.array().parse(data);
};

/**
 * Acknowledges a system alert.
 * @param {string} alertId - The ID of the alert to acknowledge.
 * @returns {Promise<{ success: boolean }>} A promise that resolves on success.
 */
export const acknowledgeAlert = (alertId: string): Promise<{ success: boolean }> => {
    return apiClient(`/provider/monitoring/alerts/${alertId}/ack`, { method: 'POST' });
};


/**
 * Fetches detailed revenue analytics data.
 * @param {string} [dateRange='30d'] - The date range for the analytics data.
 * @returns {Promise<RevenueData>} A promise that resolves with revenue stats, MRR breakdown, and recent transactions.
 */
export const getRevenueData = async (dateRange: string = '30d'): Promise<RevenueData> => {
    const data = await apiClient<RevenueData>(`/provider/analytics/revenue?range=${dateRange}`);
    return revenueDataSchema.parse(data);
};

/**
 * Fetches detailed active user analytics data.
 * @param {string} [dateRange='30d'] - The date range for the analytics data.
 * @returns {Promise<ActiveUsersData>} A promise that resolves with user stats, DAU history, and role distribution data.
 */
export const getActiveUsersData = async (dateRange: string = '30d'): Promise<ActiveUsersData> => {
    const data = await apiClient<ActiveUsersData>(`/provider/analytics/users?range=${dateRange}`);
    return activeUsersDataSchema.parse(data);
};

/**
 * Fetches detailed growth trend analytics data.
 * @param {string} [dateRange='30d'] - The date range for the analytics data.
 * @returns {Promise<GrowthTrendsData>} A promise that resolves with growth stats and charts for user and tenant acquisition.
 */
export const getGrowthTrendsData = async (dateRange: string = '30d'): Promise<GrowthTrendsData> => {
    const data = await apiClient<GrowthTrendsData>(`/provider/analytics/growth?range=${dateRange}`);
    return growthTrendsDataSchema.parse(data);
};

/**
 * Fetches predictive analytics data.
 * @param {string} [dateRange='30d'] - The date range for the analytics data.
 * @returns {Promise<PredictiveAnalyticsData>} A promise that resolves with predictive stats and forecasts.
 */
export const getPredictiveAnalyticsData = async (dateRange: string = '30d'): Promise<PredictiveAnalyticsData> => {
    const data = await apiClient<PredictiveAnalyticsData>(`/provider/analytics/predictive?range=${dateRange}`);
    return predictiveAnalyticsSchema.parse(data);
};

/**
 * Fetches cohort analysis data.
 * @returns {Promise<CohortAnalysisData>} A promise that resolves with cohort retention data.
 */
export const getCohortAnalysisData = async (): Promise<CohortAnalysisData> => {
    const data = await apiClient<CohortAnalysisData>('/provider/analytics/cohort');
    return cohortAnalysisSchema.parse(data);
};

/**
 * Fetches the data for the multi-school command center.
 * @returns {Promise<CommandCenterData>} A promise that resolves with the command center data.
 */
export const getCommandCenterData = async (): Promise<CommandCenterData> => {
    const data = await apiClient<CommandCenterData>('/provider/command-center');
    return commandCenterSchema.parse(data);
};

/**
 * Fetches detailed analytics and health data for a single school.
 * @param {string} schoolId The ID of the school to fetch details for.
 * @returns {Promise<ProviderSchoolDetailData>} A promise that resolves with the detailed school data.
 */
export const getProviderSchoolDetails = async (schoolId: string): Promise<ProviderSchoolDetailData> => {
    const data = await apiClient<ProviderSchoolDetailData>(`/provider/schools/${schoolId}/details`);
    return providerSchoolDetailSchema.parse(data);
};

/**
 * Fetches the provider's own profile information.
 * @returns {Promise<ProviderProfile>} A promise that resolves with the provider's profile data.
 */
export const getProviderProfile = async (): Promise<ProviderProfile> => {
    const data = await apiClient<ProviderProfile>('/provider/profile');
    return providerProfileSchema.parse(data);
};

/**
 * Updates the provider's profile information.
 * @param {ProviderProfileFormData} data - The updated profile data.
 * @returns {Promise<ProviderProfile>} A promise that resolves with the updated profile data.
 */
export const updateProviderProfile = (data: ProviderProfileFormData): Promise<ProviderProfile> => {
    return apiClient('/provider/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    });
};

/**
 * Fetches aggregated financial data for the provider's own business dashboard.
 * @returns {Promise<ProviderFinanceDashboardData>} A promise that resolves with stats and chart data.
 */
export const getProviderFinanceDashboardData = async (): Promise<ProviderFinanceDashboardData> => {
    const data = await apiClient<ProviderFinanceDashboardData>('/provider/finance-dashboard');
    return providerFinanceDashboardSchema.parse(data);
};