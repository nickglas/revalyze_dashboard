import api from "@/util/axios";
import { DailyTrendMetricDTO } from "@/models/dto/insights/daily.trend.metric.dto";

export const getTrends = async (
  filter?: string
): Promise<DailyTrendMetricDTO> => {
  const res = await api.get(`/api/v1/insights/trends?filter=${filter}`);
  return res.data;
};
