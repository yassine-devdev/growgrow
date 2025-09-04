import { z } from 'zod';
import { icons } from 'lucide-react';

// FIX: Create a type-safe enum from Lucide icon names for Zod validation.
// This ensures that `z.infer` produces the correct `keyof typeof icons` union type,
// resolving type mismatches with the `StatCard` component.
const iconNames = Object.keys(icons) as [keyof typeof icons, ...(keyof typeof icons)[]];

export const statSchema = z.object({
    label: z.string(),
    value: z.string(),
    change: z.string().optional(),
    icon: z.enum(iconNames),
});
export type Stat = z.infer<typeof statSchema>;

export const providerAnalyticsSchema = z.object({
  stats: z.array(statSchema),
  chartData: z.array(z.object({
    name: z.string(),
    mrr: z.number(),
    tenants: z.number(),
  })),
});
export type ProviderAnalyticsData = z.infer<typeof providerAnalyticsSchema>;

export const transactionDataSchema = z.object({
  id: z.string(),
  school: z.string(),
  plan: z.string(),
  date: z.string(),
  amount: z.number(),
});
export type TransactionData = z.infer<typeof transactionDataSchema>;

export const revenueDataSchema = z.object({
  stats: z.array(statSchema),
  mrrByPlan: z.array(z.object({
    name: z.string(),
    value: z.number(),
    fill: z.string(),
  })),
  recentTransactions: z.array(transactionDataSchema),
});
export type RevenueData = z.infer<typeof revenueDataSchema>;

export const activeUsersDataSchema = z.object({
  stats: z.array(statSchema),
  roleDistribution: z.array(z.object({
    name: z.string(),
    value: z.number(),
  })),
  dauHistory: z.array(z.object({
    name: z.string(),
    users: z.number(),
  })),
});
export type ActiveUsersData = z.infer<typeof activeUsersDataSchema>;

export const growthTrendsDataSchema = z.object({
  stats: z.array(statSchema),
  userGrowth: z.array(z.object({
    name: z.string(),
    signups: z.number(),
    churn: z.number(),
  })),
  tenantGrowth: z.array(z.object({
    name: z.string(),
    tenants: z.number(),
  })),
});
export type GrowthTrendsData = z.infer<typeof growthTrendsDataSchema>;

export const schoolHealthSchema = z.object({
    id: z.string(),
    name: z.string(),
    healthScore: z.number().min(0).max(100),
    keyStats: z.array(z.object({
        label: z.string(),
        value: z.string(),
    })),
});
export type SchoolHealth = z.infer<typeof schoolHealthSchema>;

export const commandCenterSchema = z.object({
    overallStats: z.array(statSchema),
    schools: z.array(schoolHealthSchema),
});
export type CommandCenterData = z.infer<typeof commandCenterSchema>;

export const providerSchoolDetailSchema = z.object({
    id: z.string(),
    name: z.string(),
    stats: z.array(statSchema),
    healthHistory: z.array(z.object({
        date: z.string(),
        score: z.number(),
    })),
});
export type ProviderSchoolDetailData = z.infer<typeof providerSchoolDetailSchema>;

export const providerProfileSchema = z.object({
    companyName: z.string(),
    contactEmail: z.string().email(),
    website: z.string().url().optional().or(z.literal('')),
});
export type ProviderProfile = z.infer<typeof providerProfileSchema>;

export const providerProfileFormSchema = z.object({
    companyName: z.string().min(3, "Company name is required."),
    contactEmail: z.string().email("A valid contact email is required."),
    website: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});
export type ProviderProfileFormData = z.infer<typeof providerProfileFormSchema>;

export const predictiveAnalyticsSchema = z.object({
  stats: z.array(statSchema),
  ltvForecast: z.array(z.object({
    month: z.string(),
    predictedLtv: z.number(),
  })),
  highRiskChurnUsers: z.array(z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    churnProbability: z.number(),
  })),
});
export type PredictiveAnalyticsData = z.infer<typeof predictiveAnalyticsSchema>;

export const cohortDataSchema = z.object({
    cohort: z.string(), // e.g., "2024-01"
    values: z.array(z.number().nullable()), // [100, 85, 75, ...]
    totalUsers: z.number(),
});
export type CohortData = z.infer<typeof cohortDataSchema>;

export const cohortAnalysisSchema = z.object({
  cohorts: z.array(cohortDataSchema),
  timePeriods: z.array(z.string()), // ["Month 0", "Month 1", ...]
});
export type CohortAnalysisData = z.infer<typeof cohortAnalysisSchema>;

export const providerFinanceDashboardSchema = z.object({
  stats: z.array(statSchema),
  revenueVsExpenses: z.array(z.object({
    name: z.string(),
    revenue: z.number(),
    expenses: z.number(),
  })),
  expenseBreakdown: z.array(z.object({
    name: z.string(),
    value: z.number(),
    fill: z.string(),
  })),
});
export type ProviderFinanceDashboardData = z.infer<typeof providerFinanceDashboardSchema>;