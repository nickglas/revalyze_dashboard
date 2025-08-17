import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import { DailyTrendMetricDTO } from "@/models/dto/insights/daily.trend.metric.dto";
import { getTrends } from "@/services/insight.service";

interface InsightState {
  dailyTrendMetrics: DailyTrendMetricDTO | null;
  isLoadingTrends: boolean;

  getDailyTrendMetrics: (filter?: string) => Promise<void>;
  reset: () => void;
}

export const useInsightStore = create<InsightState>()(
  persist(
    (set, get) => ({
      // Remove unused 'get' parameter
      dailyTrendMetrics: null,
      isLoadingTrends: false,

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

      reset: () =>
        set({
          dailyTrendMetrics: null,
          isLoadingTrends: false,
        }),
    }),
    {
      name: "insight-storage",
      partialize: (state) => ({
        dailyTrendMetrics: state.dailyTrendMetrics,
      }),
    }
  )
);
