import { prisma } from "../prisma.service";
import { PaginatedResponse } from "types";
import {
  ProviderSchool,
  Teacher,
  SchoolUser,
  Invoice,
  Expense,
  Admin,
} from "../../../../src/api/schemas/schoolManagementSchemas";
import {
  PredictiveAnalyticsData,
  CohortAnalysisData,
  ProviderFinanceDashboardData,
  SchoolHealth,
} from "../../../../src/api/schemas/commonSchemas";
import { paginate } from "../helpers";

interface PaginatedQuery {
  page?: string;
  pageSize?: string;
  search?: string;
  range?: string;
  [key: string]: any;
}

// Mock data for Provider's internal finance tools
const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    date: "2024-07-15",
    category: "Software",
    amount: 2500,
    description: "Google Cloud Platform Bill",
  },
  {
    id: "exp-2",
    date: "2024-07-12",
    category: "Marketing",
    amount: 5000,
    description: "Q3 Social Media Campaign",
  },
  {
    id: "exp-3",
    date: "2024-07-10",
    category: "Office",
    amount: 350.75,
    description: "Office Supplies",
  },
];

const mockInvoices: Invoice[] = [
  {
    id: "inv-001",
    school: "Northwood High",
    amount: 2500,
    date: "2024-07-01",
    dueDate: "2024-08-01",
    status: "Pending",
  },
  {
    id: "inv-002",
    school: "South Park Elementary",
    amount: 1500,
    date: "2024-06-15",
    dueDate: "2024-07-15",
    status: "Paid",
  },
];

export const getProviderAnalytics = async (
  query: PaginatedQuery
): Promise<any> => {
  const { range = "30d" } = query;
  console.log(`[Analytics] Fetching data for range: ${range}`);
  const schoolCount = await prisma.school.count();
  return {
    stats: [
      { label: "MRR", value: "$125,630", change: "+2.1%", icon: "DollarSign" },
      {
        label: "Active Tenants",
        value: schoolCount.toString(),
        change: "+2",
        icon: "Building",
      },
      {
        label: "Active Users",
        value: "15,789",
        change: "+8.2%",
        icon: "Users",
      },
      {
        label: "Churn Rate",
        value: "1.2%",
        change: "-0.3%",
        icon: "TrendingDown",
      },
    ],
    chartData: [
      { name: "Jan", mrr: 110000, tenants: 65 },
      { name: "Feb", mrr: 112000, tenants: 68 },
      { name: "Mar", mrr: 115000, tenants: 70 },
      { name: "Apr", mrr: 118000, tenants: 72 },
      { name: "May", mrr: 120000, tenants: 75 },
      { name: "Jun", mrr: 125630, tenants: 78 },
    ],
  };
};

export const getServiceStatus = async (): Promise<any[]> => {
  return [
    {
      name: "Authentication Service",
      status: "Operational",
      responseTime: "15ms",
      uptime: "99.99%",
    },
    {
      name: "Database Service (PostgreSQL)",
      status: "Operational",
      responseTime: "2ms",
      uptime: "99.99%",
    },
    {
      name: "AI Gateway",
      status: "Operational",
      responseTime: "250ms",
      uptime: "99.99%",
    },
    {
      name: "Real-time Service (WebSockets)",
      status: "Operational",
      responseTime: "5ms",
      uptime: "99.95%",
    },
  ];
};

export const getCommandCenterData = async (): Promise<any> => {
  const schools = await prisma.school.findMany({
    include: { _count: { select: { users: true } } },
  });

  const schoolHealth: SchoolHealth[] = schools.map((s: any) => ({
    id: s.id,
    name: s.name,
    healthScore: 85 + Math.floor(Math.random() * 15),
    keyStats: [
      { label: "Users", value: s._count.users.toLocaleString() },
      { label: "Status", value: s.status },
    ],
  }));

  return {
    overallStats: [
      {
        label: "Total Schools",
        value: schools.length.toString(),
        icon: "Building",
      },
      { label: "Platform Health", value: "99.9%", icon: "Heart" as const },
      { label: "Active Users (24h)", value: "8,123", icon: "Users" },
      { label: "Total Revenue", value: "$1.2M", icon: "DollarSign" },
    ],
    schools: schoolHealth,
  };
};

export const getProviderSchools = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<ProviderSchool>> => {
  const page = parseInt(query.page || "1");
  const pageSize = parseInt(query.pageSize || "10");

  const schools = await prisma.school.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: { _count: { select: { users: true } } },
  });

  const totalCount = await prisma.school.count();

  const formattedSchools: ProviderSchool[] = schools.map((s: any) => ({
    id: s.id,
    name: s.name,
    plan: s.plan,
    users: s._count.users,
    status: s.status,
  }));

  return paginate(formattedSchools, page, pageSize, totalCount);
};

export const getProviderSchoolDetails = async (
  schoolId: string
): Promise<any> => {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: { _count: { select: { users: true } } },
  });
  if (!school) return null;
  return {
    id: school.id,
    name: school.name,
    stats: [
      {
        label: "Active Users",
        value: school._count.users.toLocaleString(),
        icon: "Users" as const,
      },
      { label: "Data Storage", value: "250 GB", icon: "Database" as const },
      { label: "MRR", value: "$2,500", icon: "DollarSign" as const },
      { label: "Support Tickets", value: "3 Open", icon: "Ticket" as const },
    ],
    healthHistory: [
      { date: "Jan", score: 90 },
      { date: "Feb", score: 92 },
      { date: "Mar", score: 91 },
      { date: "Apr", score: 95 },
      { date: "May", score: 94 },
      { date: "Jun", score: 95 },
    ],
  };
};

export const getAdmins = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<Admin>> => {
  const page = parseInt(query.page || "1");
  const pageSize = parseInt(query.pageSize || "10");
  const users = await prisma.user.findMany({
    where: { role: "Admin" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const totalCount = await prisma.user.count({ where: { role: "Admin" } });
  const formatted = users.map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: "Admin",
    school: u.schoolId || "N/A",
    lastLogin: new Date(
      Date.now() - Math.random() * 10 * 86400000
    ).toISOString(),
    status: "Active",
  }));
  return paginate(formatted, page, pageSize, totalCount);
};

export const getTeachers = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<Teacher>> => {
  const page = parseInt(query.page || "1");
  const pageSize = parseInt(query.pageSize || "10");
  const teachers = await prisma.user.findMany({
    where: { role: "Teacher" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const totalCount = await prisma.user.count({ where: { role: "Teacher" } });
  const formatted = teachers.map((t: any) => ({
    id: t.id,
    name: t.name,
    email: t.email,
    school: t.schoolId || "N/A",
    subject: "Mathematics",
    yearsExperience: 5,
    status: "Active",
  }));
  return paginate(formatted, page, pageSize, totalCount);
};

export const getStudents = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<SchoolUser>> => {
  const page = parseInt(query.page || "1");
  const pageSize = parseInt(query.pageSize || "10");
  const students = await prisma.user.findMany({
    where: { role: "Student" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const totalCount = await prisma.user.count({ where: { role: "Student" } });
  const formatted = students.map((s: any) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    school: s.schoolId || "N/A",
    grade: 10,
    status: "Active",
  }));
  return paginate(formatted, page, pageSize, totalCount);
};

export const getParents = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<SchoolUser>> => {
  const page = parseInt(query.page || "1");
  const pageSize = parseInt(query.pageSize || "10");
  const parents = await prisma.user.findMany({
    where: { role: "Parent" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const totalCount = await prisma.user.count({ where: { role: "Parent" } });
  const formatted = parents.map((p: any) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    school: p.schoolId || "N/A",
    children: ["Alex Doe"],
    status: "Active",
  }));
  return paginate(formatted, page, pageSize, totalCount);
};

export const getExpenses = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<Expense>> => {
  const page = parseInt(query.page || "1");
  const pageSize = parseInt(query.pageSize || "10");
  return paginate(mockExpenses, page, pageSize, mockExpenses.length);
};

export const getInvoices = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<Invoice>> => {
  const page = parseInt(query.page || "1");
  const pageSize = parseInt(query.pageSize || "10");
  return paginate(mockInvoices, page, pageSize, mockInvoices.length);
};

export const getUpdates = async (): Promise<any[]> => [
  {
    version: "2.1.0",
    date: "2024-07-15",
    type: "Minor",
    notes: "Added AI-powered expense categorization and recurring expenses.",
  },
  {
    version: "2.0.1",
    date: "2024-07-10",
    type: "Patch",
    notes:
      "Fixed a bug in the student dashboard where mood check-ins were not saving correctly.",
  },
  {
    version: "2.0.0",
    date: "2024-07-01",
    type: "Major",
    notes:
      "Launched the new Provider Tools module with Finance, Marketing, and Data Studio sections.",
  },
];

export const getVersionControlCommits = async (): Promise<any[]> => [
  {
    hash: "a1b2c3d",
    message: "feat(finance): add recurring expenses",
    author: "Jane Doe",
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    hash: "e4f5g6h",
    message: "fix(student): resolve mood check-in bug",
    author: "John Smith",
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    hash: "i7j8k9l",
    message: "refactor(api): optimize data fetching for dashboards",
    author: "Jane Doe",
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    hash: "m0n1o2p",
    message: "docs(readme): update setup instructions",
    author: "Chris Green",
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

export const getPredictiveAnalyticsData = async (
  query: PaginatedQuery
): Promise<PredictiveAnalyticsData> => {
  return {
    stats: [
      { label: "Predicted Churn (30d)", value: "1.1%", icon: "UserX" as const },
      { label: "Predicted LTV", value: "$8,450", icon: "TrendingUp" as const },
      { label: "High-Risk Tenants", value: "4", icon: "ShieldAlert" as const },
      {
        label: "Expansion Opportunity",
        value: "12 Tenants",
        icon: "Plus" as const,
      },
    ],
    ltvForecast: [
      { month: "Jul", predictedLtv: 8450 },
      { month: "Aug", predictedLtv: 8520 },
      { month: "Sep", predictedLtv: 8600 },
      { month: "Oct", predictedLtv: 8750 },
      { month: "Nov", predictedLtv: 8900 },
    ],
    highRiskChurnUsers: [
      {
        id: "user-1",
        name: "John Doe",
        email: "john.d@example.com",
        churnProbability: 0.85,
      },
      {
        id: "user-2",
        name: "Jane Smith",
        email: "jane.s@example.com",
        churnProbability: 0.78,
      },
      {
        id: "user-3",
        name: "Sam Wilson",
        email: "sam.w@example.com",
        churnProbability: 0.72,
      },
    ],
  };
};

export const getCohortAnalysisData = async (): Promise<CohortAnalysisData> => {
  return {
    timePeriods: [
      "Month 0",
      "Month 1",
      "Month 2",
      "Month 3",
      "Month 4",
      "Month 5",
    ],
    cohorts: [
      {
        cohort: "Jan 2024",
        totalUsers: 120,
        values: [100, 85, 78, 72, 68, 65],
      },
      {
        cohort: "Feb 2024",
        totalUsers: 150,
        values: [100, 88, 82, 79, 75, null],
      },
      {
        cohort: "Mar 2024",
        totalUsers: 180,
        values: [100, 90, 85, 81, null, null],
      },
      {
        cohort: "Apr 2024",
        totalUsers: 210,
        values: [100, 92, 88, null, null, null],
      },
      {
        cohort: "May 2024",
        totalUsers: 250,
        values: [100, 95, null, null, null, null],
      },
      {
        cohort: "Jun 2024",
        totalUsers: 280,
        values: [100, null, null, null, null, null],
      },
    ],
  };
};

export const getProviderFinanceDashboardData =
  async (): Promise<ProviderFinanceDashboardData> => {
    const totalRevenue = mockInvoices
      .filter((i) => i.status === "Paid")
      .reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin =
      totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const stats = [
      {
        label: "Total Revenue (YTD)",
        value: `$${totalRevenue.toLocaleString()}`,
        icon: "DollarSign" as const,
      },
      {
        label: "Total Expenses (YTD)",
        value: `$${totalExpenses.toLocaleString()}`,
        icon: "FileText" as const,
      },
      {
        label: "Net Profit (YTD)",
        value: `$${netProfit.toLocaleString()}`,
        icon: "TrendingUp" as const,
      },
      // FIX: Replaced the icon name with one that is compatible with the inferred type to resolve the TypeScript error.
      {
        label: "Profit Margin",
        value: `${profitMargin.toFixed(1)}%`,
        icon: "TrendingUp" as const,
      },
    ];

    const months = ["May", "Jun", "Jul"];
    const revenueVsExpenses = months.map((monthName, i) => {
      const monthIndex = 4 + i;
      const revenue = mockInvoices
        .filter(
          (inv) =>
            new Date(inv.date).getMonth() === monthIndex &&
            inv.status === "Paid"
        )
        .reduce((sum, inv) => sum + inv.amount, 0);
      const expenses = mockExpenses
        .filter((exp) => new Date(exp.date).getMonth() === monthIndex)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return { name: monthName, revenue, expenses };
    });

    const expenseBreakdown = mockExpenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const colors = {
      Software: "#4f46e5",
      Marketing: "#34d399",
      Office: "#f59e0b",
      Travel: "#ef4444",
    };
    const formattedBreakdown = Object.entries(expenseBreakdown).map(
      ([name, value]) => ({
        name,
        value,
        fill: colors[name as keyof typeof colors] || "#6b7280",
      })
    );

    return { stats, revenueVsExpenses, expenseBreakdown: formattedBreakdown };
  };
