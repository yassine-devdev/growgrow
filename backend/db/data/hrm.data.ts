import { PaginatedResponse } from "../../../types";
import {
  TeamMember,
  Permission,
  HrmRole,
  RolesAndPermissions,
} from "../../../src/api/schemas/hrmSchemas";
import { v4 as uuidv4 } from "uuid";
import { paginate } from "../../src/db/helpers";

// --- Permissions ---
const mockPermissions: Permission[] = [
  // Billing
  {
    id: "perm-billing-view",
    name: "View Billing",
    description: "Can view subscription and invoice data.",
    category: "Billing",
  },
  {
    id: "perm-billing-manage",
    name: "Manage Billing",
    description: "Can create and modify subscriptions and invoices.",
    category: "Billing",
  },
  // Users
  {
    id: "perm-users-view",
    name: "View Users",
    description: "Can view user lists and profiles.",
    category: "User Management",
  },
  {
    id: "perm-users-manage",
    name: "Manage Users",
    description: "Can create, edit, and delete users.",
    category: "User Management",
  },
  // Analytics
  {
    id: "perm-analytics-view",
    name: "View Analytics",
    description: "Can access all analytics dashboards.",
    category: "Analytics",
  },
  // System
  {
    id: "perm-system-manage",
    name: "Manage System Settings",
    description: "Can change system-wide settings.",
    category: "System",
  },
  // CRM
  {
    id: "perm-crm-leads",
    name: "Manage Leads",
    description: "Can view and manage CRM leads.",
    category: "CRM",
  },
  {
    id: "perm-crm-deals",
    name: "Manage Deals",
    description: "Can view and manage CRM deals pipeline.",
    category: "CRM",
  },
];

// --- Roles ---
const mockHrmRoles: HrmRole[] = [
  {
    id: "role-admin",
    name: "Platform Admin",
    description: "Has full access to all platform features.",
    permissionIds: mockPermissions.map((p) => p.id),
  },
  {
    id: "role-support",
    name: "Support Agent",
    description: "Can view users and manage support tickets.",
    permissionIds: ["perm-users-view"],
  },
  {
    id: "role-sales",
    name: "Sales Rep",
    description: "Has access to the CRM module.",
    permissionIds: ["perm-crm-leads", "perm-crm-deals"],
  },
  {
    id: "role-viewer",
    name: "Viewer",
    description: "Read-only access to dashboards and analytics.",
    permissionIds: ["perm-analytics-view"],
  },
];

// --- Team Members ---
const mockTeamMembers: TeamMember[] = [
  {
    id: "team-1",
    name: "John Provider",
    email: "john.p@growyourneed.com",
    role: "Platform Admin",
    status: "Active",
    joinedDate: new Date("2023-01-15").toISOString(),
  },
  {
    id: "team-2",
    name: "Sally Sales",
    email: "sally.s@growyourneed.com",
    role: "Sales Rep",
    status: "Active",
    joinedDate: new Date("2023-05-20").toISOString(),
  },
  {
    id: "team-3",
    name: "Sam Support",
    email: "sam.s@growyourneed.com",
    role: "Support Agent",
    status: "Active",
    joinedDate: new Date("2023-08-10").toISOString(),
  },
  {
    id: "team-4",
    name: "Victor Viewer",
    email: "victor.v@growyourneed.com",
    role: "Viewer",
    status: "Invited",
    joinedDate: new Date("2024-07-20").toISOString(),
  },
];

export const getTeamMembers = async (
  query: { page?: string; pageSize?: string } = {}
): Promise<PaginatedResponse<TeamMember>> => {
  const page = Number.isFinite(Number(query.page))
    ? Math.max(1, parseInt(query.page || "1"))
    : 1;
  const pageSize = Number.isFinite(Number(query.pageSize))
    ? Math.max(1, parseInt(query.pageSize || "10"))
    : 10;
  // paginate returns a concrete PaginatedResponse<T>
  return paginate<TeamMember>(
    mockTeamMembers,
    page,
    pageSize,
    mockTeamMembers.length
  );
};

export const getRolesAndPermissions =
  async (): Promise<RolesAndPermissions> => {
    return {
      roles: mockHrmRoles.slice(),
      permissions: mockPermissions.slice(),
    };
  };

export const getAllPermissions = async (): Promise<Permission[]> => {
  return mockPermissions.slice();
};

// Helper to add a new team member (production-safe defaults)
export const createTeamMember = async (
  data: Partial<TeamMember>
): Promise<TeamMember> => {
  const member: TeamMember = {
    id: data.id ?? `team-${uuidv4()}`,
    name: data.name ?? "Unknown",
    email:
      data.email ??
      `user+${Math.random().toString(36).slice(2, 8)}@example.com`,
    role: data.role ?? mockHrmRoles[0].name,
    status: data.status ?? "Invited",
    joinedDate: data.joinedDate ?? new Date().toISOString(),
  } as TeamMember;
  mockTeamMembers.push(member);
  return member;
};
