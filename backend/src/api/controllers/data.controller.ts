import { RequestHandler } from "express";
import * as db from "../../db/database.service";
import { GoogleGenAI } from "@google/genai";
import config from "../../config";

// A generic controller to handle all data requests
const handleRequest =
  (handler: Function): RequestHandler =>
  async (req, res, next) => {
    try {
      // Pass query params for pagination/sorting if the handler needs them
      const data = await handler(req.query);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

export const getProviderAnalytics = handleRequest(db.getProviderAnalytics);
export const getServiceStatus = handleRequest(db.getServiceStatus);
export const getCommandCenterData = handleRequest(db.getCommandCenterData);
export const getProviderSchools = handleRequest(db.getProviderSchools);

export const getProviderSchoolDetails: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const data = await db.getProviderSchoolDetails(req.params.schoolId);
    if (!data) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getAdmins = handleRequest(db.getAdmins);
export const getTeachers = handleRequest(db.getTeachers);
export const getStudents = handleRequest(db.getStudents);
export const getParents = handleRequest(db.getParents);
export const getAcademicHealthData = handleRequest(db.getAcademicHealthData);
export const getExpenses = handleRequest(db.getExpenses);
export const getInvoices = handleRequest(db.getInvoices);
export const getUpdates = handleRequest(db.getUpdates);
export const getVersionControlCommits = handleRequest(
  db.getVersionControlCommits
);
export const getAdminDashboardData = handleRequest(db.getAdminDashboardData);
export const getTeacherDashboardData = handleRequest(
  db.getTeacherDashboardData
);
export const getStudentDashboardData = handleRequest(
  db.getStudentDashboardData
);
export const getParentDashboardData = handleRequest(db.getParentDashboardData);
export const getAdmissionsDashboardData = handleRequest(
  db.getAdmissionsDashboardData
);
export const getIndividualDashboardData = handleRequest(
  db.getIndividualDashboardData
);
export const getNotifications = handleRequest(db.getNotifications);
export const getProducts = handleRequest(db.getProducts);
export const getAuditLogs = handleRequest(db.getAuditLogs);
export const getSecurityRoles = handleRequest(db.getSecurityRoles);
export const getApiKeys = handleRequest(db.getApiKeys);
export const getBackups = handleRequest(db.getBackups);
export const getIntegrations = handleRequest(db.getIntegrations);
export const getMultiTenancySettings = handleRequest(
  db.getMultiTenancySettings
);
export const getBackupConfig = handleRequest(db.getBackupConfig);
export const getBulkOperations = handleRequest(db.getBulkOperations);
export const getLegalDocuments = handleRequest(db.getLegalDocuments);
export const getApiKeyAnalytics = handleRequest(db.getApiKeyAnalytics);
export const getSystemLogs = handleRequest(db.getSystemLogs);
export const getPredictiveAnalyticsData = handleRequest(
  db.getPredictiveAnalyticsData
);
export const getCohortAnalysisData = handleRequest(db.getCohortAnalysisData);
export const getProviderFinanceDashboardData = handleRequest(
  db.getProviderFinanceDashboardData
);

export const saveMultiTenancySettings: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const updatedSettings = await db.saveMultiTenancySettings(req.body);
    res.status(200).json(updatedSettings);
  } catch (error) {
    next(error);
  }
};

export const saveBackupConfig: RequestHandler = async (req, res, next) => {
  try {
    const updatedConfig = await db.saveBackupConfig(req.body);
    res.status(200).json(updatedConfig);
  } catch (error) {
    next(error);
  }
};

// Marketing Tools
export const getMarketingCampaigns = handleRequest(db.getMarketingCampaigns);
export const addMarketingCampaign: RequestHandler = async (req, res, next) => {
  try {
    const newCampaign = await db.addMarketingCampaign(req.body);
    res.status(201).json(newCampaign);
  } catch (error) {
    next(error);
  }
};
export const deleteMarketingCampaign: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    await db.deleteMarketingCampaign(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
export const getMarketingAnalytics = handleRequest(db.getMarketingAnalytics);

// Data Studio
export const getDataConnectors = handleRequest(db.getDataConnectors);
export const getConnectorSchema: RequestHandler = async (req, res, next) => {
  try {
    const type = req.query.type as string;
    const schema = await db.getConnectorSchema(type);
    res.json(schema);
  } catch (error) {
    next(error);
  }
};
export const addConnector: RequestHandler = async (req, res, next) => {
  try {
    const newConnector = await db.addConnector(req.body);
    res.status(201).json(newConnector);
  } catch (error) {
    next(error);
  }
};

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
export const getLessonPlans = handleRequest(db.getLessonPlans);

export const saveLessonPlan: RequestHandler = async (req, res, next) => {
  try {
    const savedPlan = await db.saveLessonPlan(req.body);
    res.status(201).json(savedPlan);
  } catch (error) {
    next(error);
  }
};

export const deleteLessonPlan: RequestHandler = async (req, res, next) => {
  try {
    await db.deleteLessonPlan(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

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

export const getStudioDesignTemplates = handleRequest(
  db.getStudioDesignTemplates
);
export const getStudioBrandKits = handleRequest(db.getStudioBrandKits);
export const getStudioVideoProjects = handleRequest(db.getStudioVideoProjects);
export const getStudioCodeProjects = handleRequest(db.getStudioCodeProjects);
export const getStudioOfficeDocs = handleRequest(db.getStudioOfficeDocs);
export const getStudioMarketplaceAssets = handleRequest(
  db.getStudioMarketplaceAssets
);

// CRM Controllers
export const getCrmLeads = handleRequest(db.getCrmLeads);
export const getCrmDeals = handleRequest(db.getCrmDeals);
export const getCrmAnalytics = handleRequest(db.getCrmAnalytics);
export const saveCrmLead: RequestHandler = async (req, res, next) => {
  try {
    const savedLead = await db.saveCrmLead(req.body);
    res.status(savedLead.id === req.body.id ? 200 : 201).json(savedLead);
  } catch (error) {
    next(error);
  }
};
export const deleteCrmLead: RequestHandler = async (req, res, next) => {
  try {
    await db.deleteCrmLead(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
export const updateCrmDealStage: RequestHandler = async (req, res, next) => {
  try {
    const { dealId, newStage } = req.body;
    const updatedDeal = await db.updateCrmDealStage(dealId, newStage);
    res.status(200).json(updatedDeal);
  } catch (error) {
    next(error);
  }
};
