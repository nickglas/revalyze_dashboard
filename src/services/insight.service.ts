import api from "@/util/axios";
import { DailyTrendMetricDTO } from "@/models/dto/insights/daily.trend.metric.dto";
import { CriterionSummaryDTO } from "@/models/dto/insights/criterion.summary.dto";
import { DashboardLimitData } from "@/models/dto/insights/gauge.summary.dto";

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
