import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import { DailyTrendMetricDTO } from "@/models/dto/insights/daily.trend.metric.dto";
import {
  getTrends,
  getCriteriaSummary,
  getDashboardLimitData,
} from "@/services/insight.service";
import { CriterionSummaryDTO } from "@/models/dto/insights/criterion.summary.dto";
import { DashboardLimitData } from "@/models/dto/insights/gauge.summary.dto";

interface InsightState {
  dailyTrendMetrics: DailyTrendMetricDTO | null;
  criteriaSummary: CriterionSummaryDTO[] | null;
  dashboardLimitData: DashboardLimitData | null;

  isLoadingTrends: boolean;
  isLoadingCriteriaSummary: boolean;
  isloadingDasboardLimitData: boolean;

  getDailyTrendMetrics: (filter?: string) => Promise<void>;
  fetchCriteriaSummary: (filter?: string) => Promise<void>;
  getDashboardLimitData: () => Promise<void>;

  reset: () => void;
}

export const useInsightStore = create<InsightState>()(
  persist(
    (set, get) => ({
      dailyTrendMetrics: null,
      criteriaSummary: null,
      dashboardLimitData: null,

      isLoadingTrends: false,
      isLoadingCriteriaSummary: false,
      isloadingDasboardLimitData: false,

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

      reset: () =>
        set({
          dailyTrendMetrics: null,
          criteriaSummary: null,
          isLoadingCriteriaSummary: false,
          isLoadingTrends: false,
        }),
    }),
    {
      name: "insight-storage",
      partialize: (state) => ({
        dailyTrendMetrics: state.dailyTrendMetrics,
        criteriaSummary: state.criteriaSummary,
        isLoadingCriteriaSummary: state.isLoadingCriteriaSummary,
        isLoadingTrends: state.isLoadingTrends,
      }),
    }
  )
);
