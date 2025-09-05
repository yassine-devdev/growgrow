import { Router, RequestHandler } from "express";
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
  getCrmAnalytics,
} from "../controllers/data.controller";
import {
  authenticate,
  permit,
  AuthenticatedUser,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  aiFeedbackSchema,
  schoolIdParamSchema,
  lessonPlanSchema,
  aiLessonPlanSchema,
} from "../schemas/validation.schemas";

const router = Router();

// This router provides data for all endpoints that are not auth or AI concierge.
// All routes are now protected by the authentication middleware.
router.use(authenticate as RequestHandler);

// --- Provider-Only Routes ---
const providerPermit = permit("Provider") as RequestHandler;
// Provider routes
router.get(
  "/provider/analytics",
  providerPermit,
  getProviderAnalytics as RequestHandler
);
router.get(
  "/provider/monitoring/services",
  providerPermit,
  getServiceStatus as RequestHandler
);
router.get(
  "/provider/command-center",
  providerPermit,
  getCommandCenterData as RequestHandler
);
router.get(
  "/schools/provider-view",
  providerPermit,
  getProviderSchools as RequestHandler
);
router.get(
  "/provider/schools/:schoolId/details",
  providerPermit,
  validate(schoolIdParamSchema) as RequestHandler,
  getProviderSchoolDetails as RequestHandler
);
router.get("/users/admins", providerPermit, getAdmins);
router.get("/users/teachers", providerPermit, getTeachers);
router.get("/users/students", providerPermit, getStudents);
router.get("/users/parents", providerPermit, getParents);
router.get("/expenses", providerPermit, getExpenses);
router.get("/billing/invoices", providerPermit, getInvoices);
router.get("/tools/updates", providerPermit, getUpdates);
router.get("/tools/version-control", providerPermit, getVersionControlCommits);
router.get(
  "/provider/finance-dashboard",
  providerPermit,
  getProviderFinanceDashboardData as RequestHandler
);

// Marketing Tools
router.get("/tools/marketing-campaigns", providerPermit, getMarketingCampaigns);
router.post("/tools/marketing-campaigns", providerPermit, addMarketingCampaign);
router.delete(
  "/tools/marketing-campaigns/:id",
  providerPermit,
  deleteMarketingCampaign
);
router.get("/tools/marketing-analytics", providerPermit, getMarketingAnalytics);

// System
router.get(
  "/system/audit-logs",
  providerPermit,
  getAuditLogs as RequestHandler
);
router.get("/system/roles", providerPermit, getSecurityRoles);
router.get("/system/api-keys", providerPermit, getApiKeys);
router.get("/system/backups", providerPermit, getBackups);
router.get("/system/integrations", providerPermit, getIntegrations);
router.get(
  "/system/multi-tenancy",
  providerPermit,
  getMultiTenancySettings as RequestHandler
);
router.post("/system/multi-tenancy", providerPermit, saveMultiTenancySettings);
router.get(
  "/system/backup-config",
  providerPermit,
  getBackupConfig as RequestHandler
);
router.post("/system/backup-config", providerPermit, saveBackupConfig);
router.get("/system/bulk-operations", providerPermit, getBulkOperations);
router.get("/system/legal-documents", providerPermit, getLegalDocuments);
router.get(
  "/system/api-key-analytics",
  providerPermit,
  getApiKeyAnalytics as RequestHandler
);
router.get("/system/system-logs", providerPermit, getSystemLogs);

// Data Studio
router.get("/datastudio/connectors", providerPermit, getDataConnectors);
router.post("/datastudio/connectors", providerPermit, addConnector);
router.get(
  "/datastudio/connectors/schema",
  providerPermit,
  getConnectorSchema as RequestHandler
);

// CRM Routes
router.get("/crm/leads", providerPermit, getCrmLeads);
router.post("/crm/leads", providerPermit, saveCrmLead);
router.delete("/crm/leads/:id", providerPermit, deleteCrmLead);
router.get("/crm/deals", providerPermit, getCrmDeals);
router.patch(
  "/crm/deals/stage",
  providerPermit,
  updateCrmDealStage as RequestHandler
);
router.get("/crm/analytics", providerPermit, getCrmAnalytics);

// Example of a more complex permission check using a function.
// This route is only accessible to the specific user 'admin@northwood.com'.
const isSpecificAdmin = (user: AuthenticatedUser) =>
  user.role === "Admin" && user.id === "jane-doe-admin-id"; // In a real app, you'd look up the email.
router.get(
  "/admin/special-report",
  permit(isSpecificAdmin) as RequestHandler,
  (req, res) => res.json({ message: "Welcome, specific admin!" })
);

// --- School-Role Routes ---
router.get(
  "/dashboards/admin",
  permit("Admin") as RequestHandler,
  getAdminDashboardData as RequestHandler
);
router.get(
  "/dashboards/teacher",
  permit("Teacher") as RequestHandler,
  getTeacherDashboardData as RequestHandler
);
router.get(
  "/dashboards/student",
  permit("Student") as RequestHandler,
  getStudentDashboardData as RequestHandler
);
router.get(
  "/dashboards/parent",
  permit("Parent") as RequestHandler,
  getParentDashboardData as RequestHandler
);
router.get(
  "/dashboards/admissions",
  permit("Admissions") as RequestHandler,
  getAdmissionsDashboardData as RequestHandler
);
router.post(
  "/school-hub/ai/feedback",
  permit("Teacher", "Admin") as RequestHandler,
  validate(aiFeedbackSchema) as RequestHandler,
  getAiFeedback as RequestHandler
);
router.get(
  "/admin/academic-health",
  permit("Admin") as RequestHandler,
  getAcademicHealthData as RequestHandler
);

// Lesson Planner Routes
const teacherAdminPermit = permit("Teacher", "Admin") as RequestHandler;
router.get("/school-hub/lesson-plans", teacherAdminPermit, getLessonPlans);
router.post(
  "/school-hub/lesson-plans",
  teacherAdminPermit,
  validate(lessonPlanSchema) as RequestHandler,
  saveLessonPlan
);
router.delete(
  "/school-hub/lesson-plans/:id",
  teacherAdminPermit,
  deleteLessonPlan
);
router.post(
  "/school-hub/ai/lesson-plan",
  teacherAdminPermit,
  validate(aiLessonPlanSchema) as RequestHandler,
  getAiLessonPlan as RequestHandler
);

// --- Individual User Routes ---
router.get(
  "/dashboards/individual",
  permit("Individual") as RequestHandler,
  getIndividualDashboardData as RequestHandler
);

// --- General Authenticated Routes ---
router.get("/notifications", getNotifications);
router.get("/market/products", getProducts);
router.get("/studio/templates", getStudioDesignTemplates);
router.get("/studio/brand-kits", getStudioBrandKits);
router.get("/studio/video-projects", getStudioVideoProjects);
router.get("/studio/code-projects", getStudioCodeProjects);
router.get("/studio/office-docs", getStudioOfficeDocs);
router.get("/studio/marketplace-assets", getStudioMarketplaceAssets);

export default router;
