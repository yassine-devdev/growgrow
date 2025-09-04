import { Router } from 'express';
import {
    getProviderAnalytics,
    getServiceStatus,
    getCommandCenterData,
    getProviderSchools,
    getProviderSchoolDetails,
    getAdmins,
    getTeachers,
    getStudents,
    getParents,
    getAdminDashboardData,
    getTeacherDashboardData,
    getStudentDashboardData,
    getParentDashboardData,
    getAdmissionsDashboardData,
    getIndividualDashboardData,
    getNotifications,
    getProducts,
    getAiFeedback,
    getAcademicHealthData,
    getExpenses,
    getInvoices,
    getUpdates,
    getVersionControlCommits,
    getLessonPlans,
    saveLessonPlan,
    deleteLessonPlan,
    getAiLessonPlan,
    getDataConnectors,
    getConnectorSchema,
    addConnector,
    getMarketingCampaigns,
    addMarketingCampaign,
    getAuditLogs,
    deleteMarketingCampaign,
    getMarketingAnalytics,
    getSecurityRoles,
    getApiKeys,
    getBackups,
    getIntegrations,
    getMultiTenancySettings,
    saveMultiTenancySettings,
    getBackupConfig,
    saveBackupConfig,
    getBulkOperations,
    getLegalDocuments,
    getApiKeyAnalytics,
    getSystemLogs,
    getStudioDesignTemplates,
    getStudioBrandKits,
    getStudioVideoProjects,
    getStudioCodeProjects,
    getStudioOfficeDocs,
    getStudioMarketplaceAssets,
    getPredictiveAnalyticsData,
    getCohortAnalysisData,
    getProviderFinanceDashboardData,
    getCrmLeads,
    saveCrmLead,
    deleteCrmLead,
    getCrmDeals,
    updateCrmDealStage,
    getCrmAnalytics
} from '../controllers/data.controller';
import { authenticate, permit } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { aiFeedbackSchema, schoolIdParamSchema, lessonPlanSchema, aiLessonPlanSchema } from '../schemas/validation.schemas';

const router = Router();

// This router provides data for all endpoints that are not auth or AI concierge.
// All routes are now protected by the authentication middleware.
router.use(authenticate as any);

// --- Provider-Only Routes ---
const providerPermit = permit('Provider');
// FIX: Cast all controller handlers to `any` to resolve RequestHandler overload issues.
router.get('/provider/analytics', providerPermit as any, getProviderAnalytics as any);
router.get('/provider/analytics/predictive', providerPermit as any, getPredictiveAnalyticsData as any);
router.get('/provider/analytics/cohort', providerPermit as any, getCohortAnalysisData as any);
router.get('/provider/monitoring/services', providerPermit as any, getServiceStatus as any);
router.get('/provider/command-center', providerPermit as any, getCommandCenterData as any);
router.get('/schools/provider-view', providerPermit as any, getProviderSchools as any);
router.get('/provider/schools/:schoolId/details', providerPermit as any, validate(schoolIdParamSchema) as any, getProviderSchoolDetails as any);
router.get('/users/admins', providerPermit as any, getAdmins as any);
router.get('/users/teachers', providerPermit as any, getTeachers as any);
router.get('/users/students', providerPermit as any, getStudents as any);
router.get('/users/parents', providerPermit as any, getParents as any);
router.get('/expenses', providerPermit as any, getExpenses as any);
router.get('/billing/invoices', providerPermit as any, getInvoices as any);
router.get('/tools/updates', providerPermit as any, getUpdates as any);
router.get('/tools/version-control', providerPermit as any, getVersionControlCommits as any);
router.get('/provider/finance-dashboard', providerPermit as any, getProviderFinanceDashboardData as any);


// Marketing Tools
router.get('/tools/marketing-campaigns', providerPermit as any, getMarketingCampaigns as any);
router.post('/tools/marketing-campaigns', providerPermit as any, addMarketingCampaign as any);
router.delete('/tools/marketing-campaigns/:id', providerPermit as any, deleteMarketingCampaign as any);
router.get('/tools/marketing-analytics', providerPermit as any, getMarketingAnalytics as any);

// System
router.get('/system/audit-logs', providerPermit as any, getAuditLogs as any);
router.get('/system/roles', providerPermit as any, getSecurityRoles as any);
router.get('/system/api-keys', providerPermit as any, getApiKeys as any);
router.get('/system/backups', providerPermit as any, getBackups as any);
router.get('/system/integrations', providerPermit as any, getIntegrations as any);
router.get('/system/multi-tenancy', providerPermit as any, getMultiTenancySettings as any);
router.post('/system/multi-tenancy', providerPermit as any, saveMultiTenancySettings as any);
router.get('/system/backup-config', providerPermit as any, getBackupConfig as any);
router.post('/system/backup-config', providerPermit as any, saveBackupConfig as any);
router.get('/system/bulk-operations', providerPermit as any, getBulkOperations as any);
router.get('/system/legal-documents', providerPermit as any, getLegalDocuments as any);
router.get('/system/api-key-analytics', providerPermit as any, getApiKeyAnalytics as any);
router.get('/system/system-logs', providerPermit as any, getSystemLogs as any);


// Data Studio
router.get('/datastudio/connectors', providerPermit as any, getDataConnectors as any);
router.post('/datastudio/connectors', providerPermit as any, addConnector as any);
router.get('/datastudio/connectors/schema', providerPermit as any, getConnectorSchema as any);

// CRM Routes
router.get('/crm/leads', providerPermit as any, getCrmLeads as any);
router.post('/crm/leads', providerPermit as any, saveCrmLead as any);
router.delete('/crm/leads/:id', providerPermit as any, deleteCrmLead as any);
router.get('/crm/deals', providerPermit as any, getCrmDeals as any);
router.patch('/crm/deals/stage', providerPermit as any, updateCrmDealStage as any);
router.get('/crm/analytics', providerPermit as any, getCrmAnalytics as any);


// --- School-Role Routes ---
router.get('/dashboards/admin', permit('Admin') as any, getAdminDashboardData as any);
router.get('/dashboards/teacher', permit('Teacher') as any, getTeacherDashboardData as any);
router.get('/dashboards/student', permit('Student') as any, getStudentDashboardData as any);
router.get('/dashboards/parent', permit('Parent') as any, getParentDashboardData as any);
router.get('/dashboards/admissions', permit('Admissions') as any, getAdmissionsDashboardData as any);
router.post('/school-hub/ai/feedback', permit('Teacher', 'Admin') as any, validate(aiFeedbackSchema) as any, getAiFeedback as any);
router.get('/admin/academic-health', permit('Admin') as any, getAcademicHealthData as any);

// Lesson Planner Routes
const teacherAdminPermit = permit('Teacher', 'Admin');
router.get('/school-hub/lesson-plans', teacherAdminPermit as any, getLessonPlans as any);
router.post('/school-hub/lesson-plans', teacherAdminPermit as any, validate(lessonPlanSchema) as any, saveLessonPlan as any);
router.delete('/school-hub/lesson-plans/:id', teacherAdminPermit as any, deleteLessonPlan as any);
router.post('/school-hub/ai/lesson-plan', teacherAdminPermit as any, validate(aiLessonPlanSchema) as any, getAiLessonPlan as any);


// --- Individual User Routes ---
router.get('/dashboards/individual', permit('Individual') as any, getIndividualDashboardData as any);

// --- General Authenticated Routes ---
router.get('/notifications', getNotifications as any);
router.get('/market/products', getProducts as any);
router.get('/studio/templates', getStudioDesignTemplates as any);
router.get('/studio/brand-kits', getStudioBrandKits as any);
router.get('/studio/video-projects', getStudioVideoProjects as any);
router.get('/studio/code-projects', getStudioCodeProjects as any);
router.get('/studio/office-docs', getStudioOfficeDocs as any);
router.get('/studio/marketplace-assets', getStudioMarketplaceAssets as any);


export default router;