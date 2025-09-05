import { PaginatedResponse } from "types";
import { Prisma, type AuditLogWhereInput } from "@prisma/client";
import {
  AuditLog,
  SecurityRole,
  ApiKey,
  Backup,
  Integration,
  MultiTenancySettings,
  BackupConfig,
  BulkOperation,
  LegalDocument,
  ApiKeyAnalytics,
} from "../../../../src/api/schemas/appModulesSchemas";
import { v4 as uuidv4 } from "uuid";
import { paginate } from "../helpers";
import { prisma } from "../prisma.service";

interface PaginatedQuery {
  page?: string;
  pageSize?: string;
  search?: string;
  range?: string;
  // Add sorting parameters to the query interface
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

const mockAuditLogs: AuditLog[] = [
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    actor: "Provider: john@growyourneed.com",
    action: "Generated new API key for 'Billing Integration'",
    ipAddress: "192.168.1.1",
  },
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    actor: "Admin: admin@northwood.com",
    action: "Changed subscription plan from 'Pro' to 'Enterprise'",
    ipAddress: "203.0.113.25",
  },
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    actor: "Provider: jane@growyourneed.com",
    action: "Deleted school 'South Park Elementary'",
    ipAddress: "198.51.100.12",
  },
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    actor: "Admin: admin@northwood.com",
    action: "Updated school branding settings",
    ipAddress: "203.0.113.25",
  },
];

const mockBackups: Backup[] = [
  {
    id: uuidv4(),
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    status: "Success",
    size: "2.5 GB",
  },
  {
    id: uuidv4(),
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: "Success",
    size: "2.4 GB",
  },
  {
    id: uuidv4(),
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: "Failed",
    size: "---",
  },
];

const mockIntegrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    status: "Connected",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    category: "File Storage",
    status: "Connected",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    category: "Accounting",
    status: "Not Connected",
  },
];

let mockMultiTenancySettings: MultiTenancySettings = {
  allowSelfSignup: false,
  enableQuotas: true,
  defaultUserLimit: 1000,
  defaultStorageLimitGb: 50,
};

let mockBackupConfig: BackupConfig = {
  frequency: "daily",
  retentionDays: 30,
  nextBackup: new Date(Date.now() + 86400000).toISOString(),
};

const mockBulkOperations: BulkOperation[] = [
  {
    id: "op-1",
    name: "Send Announcement to All Schools",
    description:
      "Broadcast a message to all administrators across all tenants.",
  },
  {
    id: "op-2",
    name: "Update Subscription Plan for a Group",
    description:
      "Bulk-update the subscription plan for a selected group of schools.",
  },
];

const mockLegalDocs: LegalDocument[] = [
  {
    id: "doc-1",
    name: "Terms of Service",
    version: "v2.1",
    lastUpdated: new Date("2024-05-20").toISOString(),
  },
  {
    id: "doc-2",
    name: "Privacy Policy",
    version: "v2.1",
    lastUpdated: new Date("2024-05-20").toISOString(),
  },
  {
    id: "doc-3",
    name: "Data Processing Addendum",
    version: "v1.8",
    lastUpdated: new Date("2024-01-15").toISOString(),
  },
];

export const getAuditLogs = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<AuditLog>> => {
  const {
    page = "1",
    pageSize = "10",
    search = "",
    sortBy = "timestamp",
    sortDirection = "desc",
  } = query;
  const pageNum = parseInt(page);
  const pageSizeNum = parseInt(pageSize);

  const where: AuditLogWhereInput = search
    ? {
        OR: [
          { actor: { contains: search, mode: "insensitive" } },
          { action: { contains: search, mode: "insensitive" } },
          { ipAddress: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [auditLogs, totalCount] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
      orderBy: {
        [sortBy]: sortDirection,
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  // The data from Prisma is already typed correctly, so we can return it directly.
  // The paginate helper is no longer needed here as Prisma handles it.
  const pageCount = Math.ceil(totalCount / pageSizeNum);
  return { rows: auditLogs, pageCount, rowCount: totalCount };
};

export const getSecurityRoles = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<SecurityRole>> => {
  const pageNum = parseInt(query.page || "1");
  const pageSizeNum = parseInt(query.pageSize || "10");

  const [roles, totalCount] = await prisma.$transaction([
    prisma.securityRole.findMany({
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
    }),
    prisma.securityRole.count(),
  ]);

  return {
    rows: roles,
    pageCount: Math.ceil(totalCount / pageSizeNum),
    rowCount: totalCount,
  };
};

export const getApiKeys = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<ApiKey>> => {
  const pageNum = parseInt(query.page || "1");
  const pageSizeNum = parseInt(query.pageSize || "10");

  const [keys, totalCount] = await prisma.$transaction([
    prisma.apiKey.findMany({
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
    }),
    prisma.apiKey.count(),
  ]);

  return {
    rows: keys,
    pageCount: Math.ceil(totalCount / pageSizeNum),
    rowCount: totalCount,
  };
};

export const getBackups = async (query: PaginatedQuery) =>
  paginate(
    mockBackups,
    parseInt(query.page || "1"),
    parseInt(query.pageSize || "10"),
    mockBackups.length
  );
export const getIntegrations = async (): Promise<Integration[]> => {
  return mockIntegrations;
};

export const getMultiTenancySettings =
  async (): Promise<MultiTenancySettings> => {
    return mockMultiTenancySettings;
  };

export const saveMultiTenancySettings = async (
  data: MultiTenancySettings
): Promise<MultiTenancySettings> => {
  mockMultiTenancySettings = data;
  return mockMultiTenancySettings;
};

export const getBackupConfig = async (): Promise<BackupConfig> => {
  return mockBackupConfig;
};

export const saveBackupConfig = async (
  data: BackupConfig
): Promise<BackupConfig> => {
  mockBackupConfig = data;
  return mockBackupConfig;
};

export const getBulkOperations = async (): Promise<BulkOperation[]> => {
  return mockBulkOperations;
};
export const getLegalDocuments = async (query: PaginatedQuery) =>
  paginate(
    mockLegalDocs,
    parseInt(query.page || "1"),
    parseInt(query.pageSize || "10"),
    mockLegalDocs.length
  );

export const getApiKeyAnalytics = async (): Promise<ApiKeyAnalytics> => ({
  stats: [
    {
      label: "Total API Calls (24h)",
      value: "1.2M",
      icon: "Activity" as const,
    },
    { label: "Error Rate", value: "0.12%", icon: "ShieldAlert" as const },
    { label: "Avg. Latency", value: "85ms", icon: "Timer" as const },
    { label: "Active Keys", value: "1", icon: "Key" as const },
  ],
  usageOverTime: [
    { date: "12:00", calls: 50000 },
    { date: "13:00", calls: 80000 },
    { date: "14:00", calls: 120000 },
    { date: "15:00", calls: 110000 },
    { date: "16:00", calls: 150000 },
    { date: "17:00", calls: 130000 },
  ],
});

export const getSystemLogs = async (): Promise<string[]> => [
  "[INFO] User provider@growyourneed.com logged in successfully.",
  "[INFO] Scheduled backup job started.",
  '[WARN] API Key "Legacy Marketing API" is expired but received a request.',
  "[INFO] Scheduled backup job completed successfully.",
  '[ERROR] Failed to connect to third-party integration "QuickBooks": Authentication error.',
];
