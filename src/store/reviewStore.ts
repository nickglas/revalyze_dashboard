import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaginationMeta } from "@/models/others/PaginationMeta";
import * as service from "@/services/review.service";
import { toast } from "react-toastify";
import { ReviewSummaryDto } from "@/models/dto/reviews/review.summary.dto";

interface ReviewState {
  reviews: ReviewSummaryDto[] | null;
  meta: PaginationMeta | null;
  isLoading: boolean;

  fetchReviews: (filters: any, page?: number, limit?: number) => Promise<void>;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: null,
      meta: null,
      isLoading: false,

      fetchReviews: async (filters: any = {}, page = 1, limit = 5) => {
        set({ isLoading: true });
        try {
          const res = await service.getReviews(page, limit, filters);
          set({
            reviews: res.data,
            meta: res.meta,
          });
        } catch (err) {
          toast.error("Failed to fetch teams");
          console.error(err);
          set({ reviews: null, meta: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),

    {
      name: "reviews-storage",
      partialize: (state) => ({
        reviews: state.reviews,
        meta: state.meta,
      }),
    }
  )
);
