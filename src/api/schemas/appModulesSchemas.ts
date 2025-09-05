import { z } from 'zod';
import { statSchema } from './commonSchemas';

// PROVIDER > TOOLS

// Marketing Project
const keywordSchema = z.object({
    text: z.string(),
    trend: z.number(),
    intent: z.string(),
});
const emailSubjectSchema = z.object({
    world: z.string(),
    subjects: z.array(z.string()),
});
const adCopySchema = z.object({
    world: z.string(),
    copy: z.object({
        headline: z.string(),
        cta: z.string(),
    }),
});
const campaignSimulatorSchema = z.object({
    keywords: z.string(),
    emailSubject: z.string(),
    adCopy: z.string(),
    budget: z.number(),
});

export const marketingProjectDataSchema = z.object({
    keywords: z.array(keywordSchema),
    emailSubjects: z.array(emailSubjectSchema),
    adCopy: z.array(adCopySchema),
    competitorInsights: z.string(),
    campaignSimulator: campaignSimulatorSchema,
});

export const marketingProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    data: marketingProjectDataSchema,
});
export type MarketingProject = z.infer<typeof marketingProjectSchema>;
export type MarketingProjectData = z.infer<typeof marketingProjectDataSchema>;


export const marketingCampaignSchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(['Active', 'Paused', 'Completed']),
    channel: z.enum(['Email', 'Social', 'Web']),
    spend: z.number(),
    conversions: z.number(),
});
export type MarketingCampaign = z.infer<typeof marketingCampaignSchema>;

export const campaignFormSchema = z.object({
    name: z.string().min(3, 'Campaign name is required.'),
    channel: z.enum(['Email', 'Social', 'Web']),
    status: z.enum(['Active', 'Paused', 'Completed']),
    spend: z.coerce.number().min(0, 'Spend must be a positive number.'),
});
export type CampaignFormData = z.infer<typeof campaignFormSchema>;

export const marketingAnalyticsSchema = z.object({
    stats: z.array(statSchema),
    conversionsByChannel: z.array(z.object({
        name: z.string(),
        conversions: z.number(),
    })),
});
export type MarketingAnalyticsData = z.infer<typeof marketingAnalyticsSchema>;

export const financeBudgetSchema = z.object({
    id: z.string(),
    category: z.string(),
    budget: z.number(),
    spent: z.number(),
});
export type FinanceBudget = z.infer<typeof financeBudgetSchema>;

export const updateSchema = z.object({
    version: z.string(),
    date: z.string(),
    type: z.enum(['Major', 'Minor', 'Patch']),
    notes: z.string(),
});
export type Update = z.infer<typeof updateSchema>;

export const versionControlCommitSchema = z.object({
    hash: z.string(),
    message: z.string(),
    author: z.string(),
    date: z.string().datetime(),
});
export type VersionControlCommit = z.infer<typeof versionControlCommitSchema>;

export const reportSchema = z.object({
    id: z.string(),
    name: z.string(),
    createdBy: z.string(),
    lastModified: z.string().datetime(),
});
export type Report = z.infer<typeof reportSchema>;

// Data Studio
export const dashboardTemplateSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    config: z.object({
        source: z.string(),
        chart: z.string(),
    }),
});
export type DashboardTemplate = z.infer<typeof dashboardTemplateSchema>;

// FIX: Moved Data Studio schemas from dataStudioSchemas.ts to consolidate and fix import errors.
export const dataConnectorSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['PostgreSQL', 'Google Analytics', 'Stripe', 'CSV Upload', 'SQL Database']),
    status: z.enum(['Connected', 'Error', 'Syncing']),
    lastSync: z.string().datetime(),
});
export type DataConnector = z.infer<typeof dataConnectorSchema>;


export const dataConnectorFormSchema = z.object({
    name: z.string().min(3, 'A descriptive name is required.'),
    type: z.enum(['PostgreSQL', 'Google Analytics', 'Stripe', 'CSV Upload', 'SQL Database']),
    connectionString: z.string().optional(),
}).refine(data => {
    if (data.type === 'SQL Database') {
        return !!data.connectionString && data.connectionString.trim().length > 0;
    }
    return true;
}, {
    message: "Connection string is required for SQL Database type.",
    path: ["connectionString"],
});
export type DataConnectorFormData = z.infer<typeof dataConnectorFormSchema>;

export const connectorSchema = z.object({
    columns: z.array(z.string()),
});
export type ConnectorSchema = z.infer<typeof connectorSchema>;


// PROVIDER > COMMUNICATION
export const emailSchema = z.object({
    id: z.string().uuid(),
    from: z.string(),
    subject: z.string(),
    snippet: z.string(),
    read: z.boolean(),
    date: z.string().datetime(),
});
export type Email = z.infer<typeof emailSchema>;

export const emailTemplateSchema = z.object({
    id: z.string(),
    name: z.string(),
    subject: z.string(),
    body: z.string(),
});
export type EmailTemplate = z.infer<typeof emailTemplateSchema>;

export const emailTemplateFormSchema = z.object({
    name: z.string().min(3, 'Template name must be at least 3 characters.'),
    subject: z.string().min(3, 'Subject must be at least 3 characters.'),
    body: z.string().min(10, 'Body must be at least 10 characters.'),
});
export type EmailTemplateFormData = z.infer<typeof emailTemplateFormSchema>;


// PROVIDER > DIRECTORIES
export const directorySchoolSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    plan: z.enum(['Basic', 'Pro', 'Enterprise']),
    users: z.number(),
    status: z.enum(['Active', 'Inactive']),
});
export type DirectorySchool = z.infer<typeof directorySchoolSchema>;
export const directoryStaffSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    role: z.string(),
    email: z.string().email(),
});
export type DirectoryStaff = z.infer<typeof directoryStaffSchema>;
export const directoryPartnerSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.string(),
    contact: z.string().email(),
});
export type DirectoryPartner = z.infer<typeof directoryPartnerSchema>;

// PROVIDER > SYSTEM
export const systemBrandingSchema = z.object({
    primaryColor: z.string(),
    logoUrl: z.string().url(),
});
export type SystemBranding = z.infer<typeof systemBrandingSchema>;
export const authSettingsSchema = z.object({
    enableSso: z.boolean(),
    ssoProvider: z.enum(['Google', 'Microsoft', 'Okta', 'None']),
    enforceMfa: z.boolean(),
    sessionTimeout: z.coerce.number().min(5, 'Timeout must be at least 5 minutes.'),
});
export type AuthSettings = z.infer<typeof authSettingsSchema>;
export const securityRoleSchema = z.object({
    id: z.string(),
    name: z.string(),
    permissions: z.string(),
});
export type SecurityRole = z.infer<typeof securityRoleSchema>;
export const apiKeySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    lastUsed: z.string().datetime(),
    status: z.enum(['Active', 'Revoked']),
});
export type ApiKey = z.infer<typeof apiKeySchema>;
export const backupSchema = z.object({
    id: z.string().uuid(),
    date: z.string().datetime(),
    status: z.enum(['Success', 'Failed']),
    size: z.string(),
});
export type Backup = z.infer<typeof backupSchema>;

export const auditLogSchema = z.object({
    id: z.string().uuid(),
    timestamp: z.string().datetime(),
    actor: z.string(),
    action: z.string(),
    details: z.record(z.string(), z.any()).optional(),
    ipAddress: z.string().optional(),
});
export type AuditLog = z.infer<typeof auditLogSchema>;

// NEW SYSTEM SCHEMAS
export const integrationSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  status: z.enum(['Connected', 'Not Connected']),
});
export type Integration = z.infer<typeof integrationSchema>;

export const multiTenancySettingsSchema = z.object({
  allowSelfSignup: z.boolean(),
  enableQuotas: z.boolean(),
  defaultUserLimit: z.coerce.number().int().positive(),
  defaultStorageLimitGb: z.coerce.number().positive(),
});
export type MultiTenancySettings = z.infer<typeof multiTenancySettingsSchema>;

export const backupConfigSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  retentionDays: z.coerce.number().int().positive(),
  nextBackup: z.string().datetime(),
});
export type BackupConfig = z.infer<typeof backupConfigSchema>;

export const bulkOperationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});
export type BulkOperation = z.infer<typeof bulkOperationSchema>;

export const legalDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  lastUpdated: z.string().datetime(),
});
export type LegalDocument = z.infer<typeof legalDocumentSchema>;

export const apiKeyAnalyticsSchema = z.object({
  stats: z.array(statSchema),
  usageOverTime: z.array(z.object({
    date: z.string(),
    calls: z.number(),
  })),
});
export type ApiKeyAnalytics = z.infer<typeof apiKeyAnalyticsSchema>;


// OVERLAY APPS
export const mediaItemSchema = z.object({
    id: z.number(),
    type: z.enum(['image', 'video']),
    url: z.string().url(),
    title: z.string(),
});
export type MediaItem = z.infer<typeof mediaItemSchema>;
export const leaderboardEntrySchema = z.object({
    rank: z.number(),
    name: z.string(),
    points: z.number(),
});
export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;
export const flightSchema = z.object({
    id: z.number(),
    from: z.string(),
    to: z.string(),
    price: z.number(),
    airline: z.string(),
});
export type Flight = z.infer<typeof flightSchema>;
export const lifestyleServiceSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
});
export type LifestyleService = z.infer<typeof lifestyleServiceSchema>;
export const hobbySchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
});
export type Hobby = z.infer<typeof hobbySchema>;
export const knowledgeArticleSchema = z.object({
    id: z.string(),
    title: z.string(),
    snippet: z.string(),
    category: z.string(),
});
export type KnowledgeArticle = z.infer<typeof knowledgeArticleSchema>;
export const sportsGameSchema = z.object({
    id: z.string(),
    teamA: z.string(),
    teamB: z.string(),
    time: z.string(),
});
export type SportsGame = z.infer<typeof sportsGameSchema>;
export const religionEventSchema = z.object({
    id: z.string(),
    name: z.string(),
    location: z.string(),
});
export type ReligionEvent = z.infer<typeof religionEventSchema>;
export const proServiceSchema = z.object({
    id: z.string(),
    name: z.string(),
});
export type ProService = z.infer<typeof proServiceSchema>;
export const kanbanDataSchema = z.object({
    tasks: z.record(z.string(), z.object({ id: z.string(), content: z.string() })),
    columns: z.record(z.string(), z.object({ id: z.string(), title: z.string(), taskIds: z.array(z.string()) })),
    columnOrder: z.array(z.string()),
});
export type KanbanData = z.infer<typeof kanbanDataSchema>;

export const transactionSchema = z.object({
    id: z.number(),
    type: z.enum(['income', 'expense']),
    description: z.string(),
    amount: z.number(),
    date: z.string(),
});
export type Transaction = z.infer<typeof transactionSchema>;

export const financeDataSchema = z.object({
    totalIncome: z.number(),
    totalExpenses: z.number(),
    monthlyBreakdown: z.array(z.object({
        name: z.string(),
        income: z.number(),
        expenses: z.number(),
    })),
    transactions: z.array(transactionSchema),
});
export type FinanceData = z.infer<typeof financeDataSchema>;
export const transactionFormSchema = z.object({
    description: z.string().min(3, 'Description is required.'),
    amount: z.coerce.number().positive('Amount must be positive.'),
    type: z.enum(['income', 'expense']),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
});
export type TransactionFormData = z.infer<typeof transactionFormSchema>;

// FIX: Add schemas for Studio components
// Studio > Designer
export const studioDesignTemplateSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    thumbnailUrl: z.string().url(),
});
export type StudioDesignTemplate = z.infer<typeof studioDesignTemplateSchema>;

export const studioBrandKitSchema = z.object({
    id: z.string(),
    name: z.string(),
    colors: z.array(z.string()),
});
export type StudioBrandKit = z.infer<typeof studioBrandKitSchema>;

// Studio > Video
export const studioVideoProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    duration: z.string(),
    status: z.string(),
    thumbnailUrl: z.string().url(),
});
export type StudioVideoProject = z.infer<typeof studioVideoProjectSchema>;

// Studio > Coder
export const studioCodeProjectSchema = z.any();
export type StudioCodeProject = z.infer<typeof studioCodeProjectSchema>;

// Studio > Office
export const studioOfficeDocSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    lastModified: z.string(),
});
export type StudioOfficeDoc = z.infer<typeof studioOfficeDocSchema>;

// Studio > Marketplace
export const studioAssetSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    price: z.number(),
    thumbnailUrl: z.string().url(),
});
export type StudioAsset = z.infer<typeof studioAssetSchema>;