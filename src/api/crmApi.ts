import { buildApiUrl } from './apiHelpers';
import { apiClient } from './apiClient';
import { PaginatedResponse } from '@/types';
import { crmLeadSchema, crmDealSchema, salesAnalyticsSchema, type CrmLead, type CrmDeal, type SalesAnalyticsData, type CrmLeadFormData } from './schemas/crmSchemas';

// Leads
export const getCrmLeads = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<CrmLead>> => {
    return apiClient(buildApiUrl('/crm/leads', options));
};
export const saveCrmLead = (data: CrmLeadFormData & { id?: string }): Promise<CrmLead> => {
    return apiClient('/crm/leads', { method: 'POST', body: JSON.stringify(data) });
};
export const deleteCrmLead = (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/crm/leads/${id}`, { method: 'DELETE' });
};

// Deals
export const getCrmDeals = async (): Promise<CrmDeal[]> => {
    const data = await apiClient<CrmDeal[]>('/crm/deals');
    return crmDealSchema.array().parse(data);
};
export const updateCrmDealStage = (dealId: string, newStage: CrmDeal['stage']): Promise<CrmDeal> => {
    return apiClient('/crm/deals/stage', {
        method: 'PATCH',
        body: JSON.stringify({ dealId, newStage }),
    });
};

// Analytics
export const getCrmAnalytics = async (): Promise<SalesAnalyticsData> => {
    const data = await apiClient<SalesAnalyticsData>('/crm/analytics');
    return salesAnalyticsSchema.parse(data);
};