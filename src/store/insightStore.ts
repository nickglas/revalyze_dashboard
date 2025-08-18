import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import { DailyTrendMetricDTO } from "@/models/dto/insights/daily.trend.metric.dto";
import {
  getTrends,
  getCriteriaSummary,
  getDashboardLimitData,
  getDashboardTeamsData,
  getSentimentDistributionData,
} from "@/services/insight.service";
import { CriterionSummaryDTO } from "@/models/dto/insights/criterion.summary.dto";
import { DashboardLimitData } from "@/models/dto/insights/gauge.summary.dto";
import { TeamsDashboardData } from "@/models/dto/insights/teams.dashboard.insights.dto";
import { SentimentDistributionMetric } from "@/models/dto/insights/sentiment.distribution.dto";

interface InsightState {
  dailyTrendMetrics: DailyTrendMetricDTO | null;
  criteriaSummary: CriterionSummaryDTO[] | null;
  dashboardLimitData: DashboardLimitData | null;
  dashboardTeamData: TeamsDashboardData[] | null;
  sentimentDistributionData: SentimentDistributionMetric | null;

  isLoadingTrends: boolean;
  isLoadingCriteriaSummary: boolean;
  isloadingDasboardLimitData: boolean;
  isloadingdashboardTeamData: boolean;
  isLoadingSentimentDistributionData: boolean;

  getDailyTrendMetrics: (filter?: string) => Promise<void>;
  fetchCriteriaSummary: (filter?: string) => Promise<void>;
  getDashboardLimitData: () => Promise<void>;
  getDashboardTeamData: () => Promise<void>;
  getSentimentDistributionData: () => Promise<void>;

  reset: () => void;
}

export const useInsightStore = create<InsightState>()(
  persist(
    (set, get) => ({
      dailyTrendMetrics: null,
      criteriaSummary: null,
      dashboardLimitData: null,
      dashboardTeamData: null,
      sentimentDistributionData: null,

      isLoadingTrends: false,
      isLoadingCriteriaSummary: false,
      isloadingDasboardLimitData: false,
      isloadingdashboardTeamData: false,
      isLoadingSentimentDistributionData: false,

      async getDailyTrendMetrics(filter?: string) {
        set({ isLoadingTrends: true });
        try {
          const res = await getTrends(filter);
          if (JSON.stringify(res) !== JSON.stringify(get().dailyTrendMetrics)) {
            set({ dailyTrendMetrics: res });
          }
        } catch (err) {
          toast.error("Failed to fetch daily metrics");
          console.error(err);
          set({ dailyTrendMetrics: null });
        } finally {
          set({ isLoadingTrends: false });
        }
      },

      async fetchCriteriaSummary(filter?: string) {
        set({ isLoadingCriteriaSummary: true });
        try {
          const res = await getCriteriaSummary(filter);
          set({ criteriaSummary: res });
        } catch (err) {
          toast.error("Failed to fetch daily metrics");
          console.error(err);
          set({ dailyTrendMetrics: null });
        } finally {
          set({ isLoadingCriteriaSummary: false });
        }
      },

      async getDashboardLimitData() {
        set({ isloadingDasboardLimitData: true });
        try {
          const res = await getDashboardLimitData();
          set({ dashboardLimitData: res });
        } catch (err) {
          toast.error("Failed to fetch dashboard limit metrics");
          console.error(err);
          set({ dailyTrendMetrics: null });
        } finally {
          set({ isloadingDasboardLimitData: false });
        }
      },

      async getDashboardTeamData() {
        set({ isloadingdashboardTeamData: true });
        try {
          const res = await getDashboardTeamsData();
          set({ dashboardTeamData: res });
        } catch (err) {
          toast.error("Failed to fetch dashboard team data");
          console.error(err);
          set({ dashboardTeamData: null });
        } finally {
          set({ isloadingdashboardTeamData: false });
        }
      },

      async getSentimentDistributionData() {
        set({ isLoadingSentimentDistributionData: true });
        try {
          const res = await getSentimentDistributionData();
          set({ sentimentDistributionData: res });
        } catch (err) {
          toast.error("Failed to fetch sentiment data");
          console.error(err);
          set({ sentimentDistributionData: null });
        } finally {
          set({ isLoadingSentimentDistributionData: false });
        }
      },

      reset: () =>
        set({
          dailyTrendMetrics: null,
          criteriaSummary: null,
          dashboardTeamData: null,
          isLoadingCriteriaSummary: false,
          isLoadingTrends: false,
          isloadingDasboardLimitData: false,
          isloadingdashboardTeamData: false,
        }),
    }),
    {
      name: "insight-storage",
      partialize: (state) => ({
        dailyTrendMetrics: state.dailyTrendMetrics,
        criteriaSummary: state.criteriaSummary,
        isLoadingCriteriaSummary: state.isLoadingCriteriaSummary,
        isLoadingTrends: state.isLoadingTrends,
        isloadingDasboardLimitData: state.isloadingDasboardLimitData,
        isloadingdashboardTeamData: state.isloadingdashboardTeamData,
      }),
    }
  )
);
