import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import { DailyTrendMetricDTO } from "@/models/dto/insights/daily.trend.metric.dto";
import { getTrends, getCriteriaSummary } from "@/services/insight.service";
import { CriterionSummaryDTO } from "@/models/dto/insights/criterion.summary.dto";

interface InsightState {
  dailyTrendMetrics: DailyTrendMetricDTO | null;
  criteriaSummary: CriterionSummaryDTO[] | null;

  isLoadingTrends: boolean;
  isLoadingCriteriaSummary: boolean;

  getDailyTrendMetrics: (filter?: string) => Promise<void>;
  fetchCriteriaSummary: (filter?: string) => Promise<void>;
  reset: () => void;
}

export const useInsightStore = create<InsightState>()(
  persist(
    (set, get) => ({
      // Remove unused 'get' parameter
      dailyTrendMetrics: null,
      criteriaSummary: null,
      isLoadingTrends: false,
      isLoadingCriteriaSummary: false,

      async getDailyTrendMetrics(filter?: string) {
        set({ isLoadingTrends: true });
        try {
          const res = await getTrends(filter);
          // Only update if data actually changed
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
