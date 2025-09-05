import { RequestHandler } from "express";
import * as db from "../../db/database.service";
// Import user-specific functions separately to resolve module resolution issues.
import {
  getAdmins,
  getTeachers,
  getStudents,
  getParents,
} from "../../db/data/user.service";
import { GoogleGenAI } from "@google/genai";
import config from "../../config";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// --- Controller Factories ---
// These helpers create Express RequestHandlers, reducing boilerplate for common operations.

/**
 * A centralized error handler for the controller factories.
 * It checks for specific error types (Prisma, Zod) and sends appropriate responses.
 */
function handleControllerError(
  error: unknown,
  next: (err: any) => void,
  res: any
) {
  if (error instanceof ZodError) {
    return res
      .status(400)
      .json({ message: "Validation error", details: error.issues });
  } else if (
    error instanceof PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return res.status(404).json({ message: "Resource not found" });
  }
  next(error); // Pass other errors to the global error handler
}

/** Factory for GET requests that may use query parameters. */
const handleGet =
  (handler: (query: any) => Promise<any>): RequestHandler =>
  async (req, res, next) => {
    try {
      const data = await handler(req.query);
      res.json(data);
    } catch (error) {
      handleControllerError(error, next, res);
    }
  };

/** Factory for GET requests that use a URL parameter (e.g., /items/:id). */
const handleGetById =
  (handler: (id: string) => Promise<any>): RequestHandler =>
  async (req, res, next) => {
    try {
      const data = await handler(req.params.id);
      if (!data) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json(data);
    } catch (error) {
      handleControllerError(error, next, res);
    }
  };

/** Factory for POST/PUT requests that process a request body. */
const handlePost =
  (handler: (body: any) => Promise<any>, createdStatus = 201): RequestHandler =>
  async (req, res, next) => {
    try {
      const result = await handler(req.body);
      res.status(createdStatus).json(result);
    } catch (error) {
      handleControllerError(error, next, res);
    }
  };

/** Factory for DELETE requests that use a URL parameter. */
const handleDelete =
  (handler: (id: string) => Promise<any>): RequestHandler =>
  async (req, res, next) => {
    try {
      await handler(req.params.id);
      res.status(204).send();
    } catch (error) {
      handleControllerError(error, next, res);
    }
  };

// --- General Data Endpoints ---
export const getProviderAnalytics = handleGet(db.getProviderAnalytics);
export const getServiceStatus = handleGet(db.getServiceStatus);
export const getCommandCenterData = handleGet(db.getCommandCenterData);
export const getProviderSchools = handleGet(db.getProviderSchools);
export const getProviderSchoolDetails = handleGetById(
  db.getProviderSchoolDetails
);
export { getAdmins, getTeachers, getStudents, getParents };
export const getAcademicHealthData = handleGet(db.getAcademicHealthData);
export const getExpenses = handleGet(db.getExpenses);
export const getInvoices = handleGet(db.getInvoices);
export const getUpdates = handleGet(db.getUpdates);
export const getVersionControlCommits = handleGet(db.getVersionControlCommits);
export const getAdminDashboardData = handleGet(db.getAdminDashboardData);
export const getTeacherDashboardData = handleGet(db.getTeacherDashboardData);
export const getStudentDashboardData = handleGet(db.getStudentDashboardData);
export const getParentDashboardData = handleGet(db.getParentDashboardData);
export const getAdmissionsDashboardData = handleGet(
  db.getAdmissionsDashboardData
);
export const getIndividualDashboardData = handleGet(
  db.getIndividualDashboardData
);
export const getNotifications = handleGet(db.getNotifications);
export const getProducts = handleGet(db.getProducts);

// Marketing Tools
export const getMarketingCampaigns = handleGet(db.getMarketingCampaigns);
export const addMarketingCampaign = handlePost(db.addMarketingCampaign);
export const deleteMarketingCampaign = handleDelete(db.deleteMarketingCampaign);
export const getMarketingAnalytics = handleGet(db.getMarketingAnalytics);

// Data Studio
export const getDataConnectors = handleGet(db.getDataConnectors);
export const getConnectorSchema: RequestHandler = async (req, res, next) => {
  try {
    const type = req.query.type as string;
    const schema = await db.getConnectorSchema(type);
    res.json(schema);
  } catch (error) {
    next(error);
  }
};
export const addConnector = handlePost(db.addConnector);

// System Settings
export const getAuditLogs = handleGet(db.getAuditLogs);
export const getSecurityRoles = handleGet(db.getSecurityRoles);
export const getApiKeys = handleGet(db.getApiKeys);
export const getBackups = handleGet(db.getBackups);
export const getIntegrations = handleGet(db.getIntegrations);
export const getMultiTenancySettings = handleGet(db.getMultiTenancySettings);
export const getBackupConfig = handleGet(db.getBackupConfig);
export const getBulkOperations = handleGet(db.getBulkOperations);
export const getLegalDocuments = handleGet(db.getLegalDocuments);
export const getApiKeyAnalytics = handleGet(db.getApiKeyAnalytics);
export const getSystemLogs = handleGet(db.getSystemLogs);
export const saveMultiTenancySettings = handlePost(
  db.saveMultiTenancySettings,
  200
);
export const saveBackupConfig = handlePost(db.saveBackupConfig, 200);

// Provider Analytics
export const getPredictiveAnalyticsData = handleGet(
  db.getPredictiveAnalyticsData
);
export const getCohortAnalysisData = handleGet(db.getCohortAnalysisData);
export const getProviderFinanceDashboardData = handleGet(
  db.getProviderFinanceDashboardData
);

// --- AI-related Data Endpoints ---
export const getAiFeedback: RequestHandler = async (req, res, next) => {
  try {
    const { studentName, assignmentTitle, score, maxPoints } = req.body;
    const ai = new GoogleGenAI({ apiKey: config.apiKey });
    const prompt = `Generate brief, constructive feedback for a student named ${studentName} on their assignment "${assignmentTitle}". They scored ${score} out of ${maxPoints}. The feedback should be encouraging and suggest one area for improvement.`;
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    res.json({ feedback: result.text });
  } catch (error) {
    next(error);
  }
};

// Lesson Planner Handlers
export const getLessonPlans = handleGet(db.getLessonPlans);
export const saveLessonPlan = handlePost(db.saveLessonPlan);
export const deleteLessonPlan = handleDelete(db.deleteLessonPlan);

export const getAiLessonPlan: RequestHandler = async (req, res, next) => {
  try {
    const { topic, objective } = req.body;
    const ai = new GoogleGenAI({ apiKey: config.apiKey });
    const prompt = `Generate a draft for a lesson plan. The topic is "${topic}" and the primary objective is "${objective}". Provide content for "objectives", "materials", and "activities". Return only a valid JSON object with these three keys. For activities, provide a bulleted list as a single string with newline characters.`;
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const resultText =
      result && typeof result.text === "string"
        ? result.text.replace(/```json|```/g, "").trim()
        : "";
    let parsed = {};
    try {
      parsed = resultText ? JSON.parse(resultText) : {};
    } catch (err) {
      // If parsing fails, return an error to the client
      return res
        .status(500)
        .json({ message: "Failed to parse AI response as JSON." });
    }
    res.json(parsed);
  } catch (error) {
    next(error);
  }
};

// Studio Data
export const getStudioDesignTemplates = handleGet(db.getStudioDesignTemplates);
export const getStudioBrandKits = handleGet(db.getStudioBrandKits);
export const getStudioVideoProjects = handleGet(db.getStudioVideoProjects);
export const getStudioCodeProjects = handleGet(db.getStudioCodeProjects);
export const getStudioOfficeDocs = handleGet(db.getStudioOfficeDocs);
export const getStudioMarketplaceAssets = handleGet(
  db.getStudioMarketplaceAssets
);

// CRM Controllers
export const getCrmLeads = handleGet(db.getCrmLeads);
export const getCrmDeals = handleGet(db.getCrmDeals);
export const getCrmAnalytics = handleGet(db.getCrmAnalytics);
export const saveCrmLead = handlePost(async (body) => {
  const savedLead = await db.saveCrmLead(body);
  return { status: savedLead.id === body.id ? 200 : 201, body: savedLead };
});
export const deleteCrmLead = handleDelete(db.deleteCrmLead);
export const updateCrmDealStage: RequestHandler = async (req, res, next) => {
  try {
    const { dealId, newStage } = req.body;
    const updatedDeal = await db.updateCrmDealStage(dealId, newStage);
    res.status(200).json(updatedDeal);
  } catch (error) {
    next(error);
  }
};
