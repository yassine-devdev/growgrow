import { PaginatedResponse } from "types";
import {
  CampaignFormData,
  MarketingCampaign,
  MarketingAnalyticsData,
} from "../../../../src/api/schemas/appModulesSchemas";
import { v4 as uuidv4 } from "uuid";
import { paginate } from "../helpers";

interface PaginatedQuery {
  page?: string;
  pageSize?: string;
  search?: string;
  range?: string;
  [key: string]: string | undefined;
}

let marketingCampaignsStore: MarketingCampaign[] = [
  {
    id: "camp-1",
    name: "Summer 2024 Enrollment Drive",
    status: "Active",
    channel: "Social",
    spend: 5000,
    conversions: 120,
  },
  {
    id: "camp-2",
    name: "Q3 Teacher Newsletter",
    status: "Completed",
    channel: "Email",
    spend: 500,
    conversions: 45,
  },
  {
    id: "camp-3",
    name: "Website SEO Overhaul",
    status: "Paused",
    channel: "Web",
    spend: 2500,
    conversions: 88,
  },
];

export const getMarketingCampaigns = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<MarketingCampaign>> => {
  const page = parseInt(query.page || "1");
  const pageSize = parseInt(query.pageSize || "10");
  return paginate(
    marketingCampaignsStore,
    page,
    pageSize,
    marketingCampaignsStore.length
  );
};
export const addMarketingCampaign = async (
  data: CampaignFormData
): Promise<MarketingCampaign> => {
  const newCampaign: MarketingCampaign = {
    ...data,
    id: `camp-${uuidv4()}`,
    conversions: 0,
  };
  marketingCampaignsStore.push(newCampaign);
  return Promise.resolve(newCampaign);
};
export const deleteMarketingCampaign = async (
  id: string
): Promise<{ success: boolean }> => {
  marketingCampaignsStore = marketingCampaignsStore.filter((c) => c.id !== id);
  return Promise.resolve({ success: true });
};
export const getMarketingAnalytics =
  async (): Promise<MarketingAnalyticsData> => ({
    stats: [
      { label: "Total Spend", value: "$8,000", icon: "DollarSign" as const },
      { label: "Total Conversions", value: "253", icon: "Check" as const },
      {
        label: "Cost/Conversion",
        value: "$31.62",
        icon: "Calculator" as const,
      },
      { label: "Active Campaigns", value: "1", icon: "Signal" as const },
    ],
    conversionsByChannel: [
      { name: "Social", conversions: 120 },
      { name: "Email", conversions: 45 },
      { name: "Web", conversions: 88 },
    ],
  });
