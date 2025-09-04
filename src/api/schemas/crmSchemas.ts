import { z } from 'zod';
import { statSchema } from './commonSchemas';

// Lead
export const crmLeadSchema = z.object({
    id: z.string(),
    companyName: z.string(),
    contactName: z.string(),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Disqualified']),
    source: z.enum(['Website', 'Referral', 'Cold Call', 'Event']),
    estimatedValue: z.number(),
});
export type CrmLead = z.infer<typeof crmLeadSchema>;

export const crmLeadFormSchema = z.object({
    companyName: z.string().min(2, 'Company name is required.'),
    contactName: z.string().min(2, 'Contact name is required.'),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Disqualified']),
    source: z.enum(['Website', 'Referral', 'Cold Call', 'Event']),
    estimatedValue: z.coerce.number().min(0, 'Estimated value must be a positive number.'),
});
export type CrmLeadFormData = z.infer<typeof crmLeadFormSchema>;

// Deal
export const crmDealSchema = z.object({
    id: z.string(),
    name: z.string(),
    stage: z.enum(['Prospecting', 'Proposal Sent', 'Negotiation', 'Won', 'Lost']),
    value: z.number(),
    closeDate: z.string(),
});
export type CrmDeal = z.infer<typeof crmDealSchema>;

// Sales Analytics
export const salesAnalyticsSchema = z.object({
    stats: z.array(statSchema),
    dealsByStage: z.array(z.object({
        name: z.string(),
        value: z.number(),
    })),
    leadsBySource: z.array(z.object({
        name: z.string(),
        value: z.number(),
    })),
});
export type SalesAnalyticsData = z.infer<typeof salesAnalyticsSchema>;