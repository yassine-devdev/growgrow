import { prisma } from "../prisma.service";
import { PaginatedResponse } from "types";
type Invoice = {
  id: string;
  school: string;
  amount: number;
  date: string;
  dueDate: string;
  status: string;
};
type Expense = {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
};
type DBSchool = {
  id: string;
  name: string;
  status: string;
  plan: string;
  _count: { users: number };
};
type PredictiveAnalyticsData = {
  stats: Array<{ label: string; value: string; icon: string }>;
  ltvForecast: Array<{ month: string; predictedLtv: number }>;
  highRiskChurnUsers: Array<{
    id: string;
    name: string;
    email: string;
    churnProbability: number;
  }>;
};
type CohortAnalysisData = {
  timePeriods: string[];
  cohorts: Array<{ cohort: string; totalUsers: number; values: number[] }>;
};
type ProviderFinanceDashboardData = {
  stats: Array<{ label: string; value: string; icon: string }>;
  revenueVsExpenses: Array<{ name: string; revenue: number; expenses: number }>;
  expenseBreakdown: Array<{ name: string; value: number; fill: string }>;
};
type SchoolHealth = {
  id: string;
  name: string;
  healthScore: number;
  keyStats: Array<{ label: string; value: string }>;
};
import { paginate } from "../helpers";

// Local DTOs for provider-facing data shapes to avoid importing frontend schema files
type ProviderSchool = {
  id: string;
  name: string;
  plan: string;
  users: number;
  status: "Active" | "Inactive";
};

// Concrete types for provider dashboard data to avoid using wide types.
type StatItem = {
  label: string;
  value: string;
  change?: string;
  icon?: string;
};
type ChartPoint = {
  name: string;
  revenue?: number;
  expenses?: number;
  value?: number;
  fill?: string;
};

interface PaginatedQuery {
  page?: string;
  pageSize?: string;
  search?: string;
  range?: string;
}
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
): Promise<
  ProviderFinanceDashboardData | { stats: StatItem[]; chartData: ChartPoint[] }
> => {
  const { range = "30d" } = query;
  // Derive real metrics from the database instead of using mocked/random values.
  const schoolCount = await prisma.school.count();
  const activeUsers = await prisma.user.count({ where: {} });

  // MRR approximation: sum of invoices in the last `range` days (if invoices exist).
  const days = parseInt(range.replace(/[^0-9]/g, "")) || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const invoiceSum = await prisma.invoice.aggregate({
    _sum: { amount: true },
    where: { date: { gte: since } },
  });
  const mrr = invoiceSum._sum.amount || 0;

  // Churn rate approximation: users deleted in the range divided by users at period start.
  // If there is no deletion audit, fallback to 0.
  // NOTE: This is a simple heuristic for demo/dev usage.
  const usersAtStart = Math.max(1, await prisma.user.count());
  const churnRate = 0; // keep conservative default — accurate churn requires events/audit log

  return {
    stats: [
      {
        label: "MRR",
        value: `$${Math.round(mrr)}`,
        change: "0%",
        icon: "DollarSign",
      },
      {
        label: "Active Tenants",
        value: schoolCount.toString(),
        change: "0%",
        icon: "Building",
      },
      {
        label: "Active Users",
        value: activeUsers.toString(),
        change: "0%",
        icon: "Users",
      },
      {
        label: "Churn Rate",
        value: `${churnRate}%`,
        change: "0%",
        icon: "TrendingDown",
      },
    ] as StatItem[],
    chartData: [] as ChartPoint[],
  };
};

export const getServiceStatus = async (): Promise<
  { name: string; status: string; responseTime: string; uptime: string }[]
> => {
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

export const getCommandCenterData = async (): Promise<{
  overallStats: StatItem[];
  schools: SchoolHealth[];
}> => {
  const schools = await prisma.school.findMany({
    include: { _count: { select: { users: true } } },
  });

  const totalSchools = schools.length;
  const activeSchools = await prisma.school.count({
    where: { status: "Active" },
  });

  const schoolHealth: SchoolHealth[] = schools.map(
    (s: DBSchool & { _count: { users: number } }) => ({
      id: s.id,
      name: s.name,
      healthScore: Math.min(
        100,
        Math.round((s._count.users / Math.max(1, 200)) * 100)
      ),
      keyStats: [
        { label: "Users", value: String(s._count?.users ?? 0) },
        { label: "Status", value: String(s.status ?? "Inactive") },
      ],
    })
  );

  const totalRevenueAgg = await prisma.invoice.aggregate({
    _sum: { amount: true },
  });
  const totalRevenue = totalRevenueAgg._sum.amount || 0;

  const overall: StatItem[] = [
    {
      label: "Total Schools",
      value: totalSchools.toString(),
      icon: "Building",
    },
    {
      label: "Platform Health",
      value: `${Math.round((activeSchools / Math.max(1, totalSchools)) * 100)}%`,
      icon: "Heart",
    },
    {
      label: "Active Users (24h)",
      value: (await prisma.user.count()).toString(),
      icon: "Users",
    },
    {
      label: "Total Revenue",
      value: `$${Math.round(totalRevenue)}`,
      icon: "DollarSign",
    },
  ];

  return { overallStats: overall, schools: schoolHealth };
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

  const formattedSchools: ProviderSchool[] = schools.map(
    (s: DBSchool & { _count: { users: number } }) => ({
      id: s.id,
      name: s.name,
      plan: s.plan || "standard",
      users: s._count.users,
      // Map Prisma enum/status values to the ProviderSchool status union used by the
      // frontend (only 'Active' or 'Inactive'). Other DB status values will be
      // treated as 'Inactive' for provider views.
      status: s.status === "Active" ? "Active" : "Inactive",
    })
  );

  return paginate(formattedSchools, page, pageSize, totalCount);
};

export const getProviderSchoolDetails = async (
  schoolId: string
): Promise<{
  id: string;
  name: string;
  stats: StatItem[];
  healthHistory: { date: string; score: number }[];
}> => {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: { _count: { select: { users: true } } },
  });
  if (!school) {
    return {
      id: schoolId,
      name: "Unknown School",
      stats: [] as StatItem[],
      healthHistory: [],
    };
  }

  const stats: StatItem[] = [
    {
      label: "Active Users",
      value: school._count.users.toLocaleString(),
      icon: "Users",
    },
    { label: "Data Storage", value: "250 GB", icon: "Database" },
    { label: "MRR", value: "$2,500", icon: "DollarSign" },
    { label: "Support Tickets", value: "3 Open", icon: "Ticket" },
  ];

  const healthHistory = [
    { date: "Jan", score: 90 },
    { date: "Feb", score: 92 },
    { date: "Mar", score: 91 },
    { date: "Apr", score: 95 },
    { date: "May", score: 94 },
    { date: "Jun", score: 95 },
  ];

  return { id: school.id, name: school.name, stats, healthHistory };
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

export const getUpdates = async (): Promise<
  Array<{ version: string; date: string; type: string; notes: string }>
> => [
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

export const getVersionControlCommits = async (): Promise<
  Array<{ hash: string; message: string; author: string; date: string }>
> => [
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
        values: [100, 88, 82, 79, 75, 0],
      },
      {
        cohort: "Mar 2024",
        totalUsers: 180,
        values: [100, 90, 85, 81, 0, 0],
      },
      {
        cohort: "Apr 2024",
        totalUsers: 210,
        values: [100, 92, 88, 0, 0, 0],
      },
      {
        cohort: "May 2024",
        totalUsers: 250,
        values: [100, 95, 0, 0, 0, 0],
      },
      {
        cohort: "Jun 2024",
        totalUsers: 280,
        values: [100, 0, 0, 0, 0, 0],
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
