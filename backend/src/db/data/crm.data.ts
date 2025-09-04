import { PaginatedResponse } from '../../../../../types';
import { CrmLead, CrmDeal, SalesAnalyticsData, CrmLeadFormData } from '../../../../../api/schemas/crmSchemas';
import { v4 as uuidv4 } from 'uuid';
import { paginate } from '../helpers';

interface PaginatedQuery {
    page?: string;
    pageSize?: string;
    search?: string;
    range?: string;
    [key: string]: any;
}

let mockCrmLeads: CrmLead[] = [
    { id: 'lead-1', companyName: 'Springfield Elementary', contactName: 'Seymour Skinner', status: 'New', source: 'Website', estimatedValue: 15000 },
    { id: 'lead-2', companyName: 'Shelbyville High', contactName: 'John Doe', status: 'Contacted', source: 'Referral', estimatedValue: 22000 },
    { id: 'lead-3', companyName: 'Capital City Prep', contactName: 'Jane Smith', status: 'Qualified', source: 'Cold Call', estimatedValue: 18000 },
    { id: 'lead-4', companyName: 'Ogdenville Academy', contactName: 'Bob Johnson', status: 'Disqualified', source: 'Website', estimatedValue: 12000 },
];

let mockCrmDeals: CrmDeal[] = [
    { id: 'deal-1', name: 'Springfield Elementary - Pro Plan', stage: 'Prospecting', value: 15000, closeDate: '2024-12-15' },
    { id: 'deal-2', name: 'Shelbyville High - Enterprise', stage: 'Proposal Sent', value: 22000, closeDate: '2024-11-30' },
    { id: 'deal-3', name: 'Capital City Prep - Enterprise', stage: 'Negotiation', value: 18000, closeDate: '2024-11-25' },
    { id: 'deal-4', name: 'North Haverbrook Institute', stage: 'Won', value: 30000, closeDate: '2024-10-15' },
    { id: 'deal-5', name: 'Brockway Tech', stage: 'Lost', value: 10000, closeDate: '2024-10-20' },
];

export const getCrmLeads = async (query: PaginatedQuery): Promise<PaginatedResponse<CrmLead>> => {
    return paginate(mockCrmLeads, parseInt(query.page || '1'), parseInt(query.pageSize || '10'), mockCrmLeads.length);
};

export const saveCrmLead = async (leadData: CrmLeadFormData & { id?: string }): Promise<CrmLead> => {
    if (leadData.id) { // Update
        const index = mockCrmLeads.findIndex(l => l.id === leadData.id);
        if (index > -1) {
            mockCrmLeads[index] = { ...mockCrmLeads[index], ...leadData };
            return Promise.resolve(mockCrmLeads[index]);
        }
    }
    // Create
    const newLead: CrmLead = { ...leadData, id: `lead-${uuidv4()}` };
    mockCrmLeads.push(newLead);
    return Promise.resolve(newLead);
};

export const deleteCrmLead = async (id: string): Promise<{ success: boolean }> => {
    mockCrmLeads = mockCrmLeads.filter(l => l.id !== id);
    return Promise.resolve({ success: true });
};


export const getCrmDeals = async (): Promise<CrmDeal[]> => {
    return Promise.resolve(mockCrmDeals);
};

export const updateCrmDealStage = async (dealId: string, newStage: CrmDeal['stage']): Promise<CrmDeal> => {
    const dealIndex = mockCrmDeals.findIndex(d => d.id === dealId);
    if (dealIndex > -1) {
        mockCrmDeals[dealIndex].stage = newStage;
        return Promise.resolve(mockCrmDeals[dealIndex]);
    }
    throw new Error('Deal not found');
};

export const getCrmAnalytics = async (): Promise<SalesAnalyticsData> => {
    const leadCount = mockCrmLeads.length;
    const dealCount = mockCrmDeals.length;
    const conversionRate = dealCount > 0 ? (dealCount / leadCount) * 100 : 0;
    const pipelineValue = mockCrmDeals
        .filter(d => d.stage !== 'Won' && d.stage !== 'Lost')
        .reduce((sum, deal) => sum + deal.value, 0);

    const dealsByStage = mockCrmDeals.reduce((acc, deal) => {
        const stage = deal.stage;
        const existing = acc.find(item => item.name === stage);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: stage, value: 1 });
        }
        return acc;
    }, [] as { name: string, value: number }[]);

    const leadsBySource = mockCrmLeads.reduce((acc, lead) => {
        const source = lead.source;
        const existing = acc.find(item => item.name === source);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: source, value: 1 });
        }
        return acc;
    }, [] as { name: string, value: number }[]);


    return Promise.resolve({
        stats: [
            { label: 'Leads', value: leadCount.toString(), icon: 'Users' as const },
            { label: 'Conversion Rate', value: `${conversionRate.toFixed(1)}%`, icon: 'TrendingUp' as const },
            { label: 'Pipeline Value', value: `$${pipelineValue.toLocaleString()}`, icon: 'DollarSign' as const },
            { label: 'Won Deals', value: mockCrmDeals.filter(d => d.stage === 'Won').length.toString(), icon: 'Trophy' as const },
        ],
        dealsByStage,
        leadsBySource
    });
};
