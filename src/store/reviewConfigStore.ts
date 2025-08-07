import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaginationMeta } from "@/models/others/PaginationMeta";
import * as service from "@/services/review.config.service";
import { toast } from "react-toastify";
import { ReviewConfig } from "@/models/api/review.config.api.model";

interface ReviewConfigState {
  reviewConfigs: ReviewConfig[] | null;
  meta: PaginationMeta | null;
  isLoading: boolean;

  fetchReviewConfigs: (
    filters: any,
    page?: number,
    limit?: number
  ) => Promise<void>;
}

export const useReviewConfigStore = create<ReviewConfigState>()(
  persist(
    (set, get) => ({
      reviewConfigs: null,
      meta: null,
      isLoading: false,

      fetchReviewConfigs: async (filters: any = {}, page = 1, limit = 5) => {
        set({ isLoading: true });
        try {
          const res = await service.getConfigs(page, limit, filters);
          set({
            reviewConfigs: res.data,
            meta: res.meta,
          });
        } catch (err) {
          toast.error("Failed to fetch review configurations");
          console.error(err);
          set({ reviewConfigs: null, meta: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),

    {
      name: "review-config-storage",
      partialize: (state) => ({
        criteria: state.reviewConfigs,
        meta: state.meta,
      }),
    }
  )
);
