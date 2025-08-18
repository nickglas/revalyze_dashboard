import api from "@/util/axios";
import { DailyTrendMetricDTO } from "@/models/dto/insights/daily.trend.metric.dto";
import { CriterionSummaryDTO } from "@/models/dto/insights/criterion.summary.dto";
import { DashboardLimitData } from "@/models/dto/insights/gauge.summary.dto";
import { TeamsDashboardData } from "@/models/dto/insights/teams.dashboard.insights.dto";
import { SentimentDistributionMetric } from "@/models/dto/insights/sentiment.distribution.dto";

export const getTrends = async (
  filter?: string
): Promise<DailyTrendMetricDTO> => {
  const res = await api.get(`/api/v1/insights/trends?filter=${filter}`);
  return res.data;
};

export const getCriteriaSummary = async (
  filter?: string
): Promise<CriterionSummaryDTO[]> => {
  const res = await api.get(
    `/api/v1/insights/criteria-summary?filter=${filter}`
  );
  return res.data;
};

export const getDashboardLimitData = async (): Promise<DashboardLimitData> => {
  const res = await api.get(`/api/v1/insights/dashboard-metrics`);
  return res.data;
};

export const getDashboardTeamsData = async (): Promise<
  TeamsDashboardData[]
> => {
  const res = await api.get(`/api/v1/insights/teams-dashboard-metrics`);
  return res.data;
};

export const getSentimentDistributionData =
  async (): Promise<SentimentDistributionMetric> => {
    const res = await api.get(`/api/v1/insights/sentiment/distribution`);
    return res.data;
  };
