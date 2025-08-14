import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaginationMeta } from "@/models/others/PaginationMeta";
import * as service from "@/services/review.service";
import { toast } from "react-toastify";
import { ReviewSummaryDto } from "@/models/dto/reviews/review.summary.dto";
import { ReviewDetailDTO } from "@/models/dto/reviews/detail.review.dto";

interface ReviewState {
  reviews: ReviewSummaryDto[] | null;
  meta: PaginationMeta | null;
  isLoading: boolean;

  fetchReviews: (filters: any, page?: number, limit?: number) => Promise<void>;
  fetchById: (id: string) => Promise<ReviewDetailDTO>;
  createReview: (input: CreateReviewDTO) => Promise<ReviewSummaryDto>;
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

      fetchById: async (id: string) => {
        set({ isLoading: true });
        try {
          const selectedReview = await service.getById(id);

          set((state) => {
            const existingIndex =
              state.reviews?.findIndex((r) => r._id === selectedReview._id) ??
              -1;

            if (existingIndex !== -1 && state.reviews) {
              const updatedReviews = [...state.reviews];
              updatedReviews[existingIndex] = selectedReview;
              return { reviews: updatedReviews };
            } else {
              return {
                reviews: [selectedReview, ...(state.reviews || [])],
                meta: state.meta
                  ? { ...state.meta, total: state.meta.total + 1 }
                  : state.meta,
              };
            }
          });

          return selectedReview;
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Failed to fetch review");
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      createReview: async (input: CreateReviewDTO) => {
        set({ isLoading: true });
        try {
          const newReview = await service.createReview(input);
          set((state) => ({
            reviews: state.reviews
              ? [newReview, ...state.reviews]
              : [newReview],
            meta: state.meta
              ? { ...state.meta, total: state.meta.total + 1 }
              : state.meta,
          }));
          return newReview;
        } catch (err: any) {
          toast.error(
            err?.response?.data?.message || "Failed to create review"
          );
          throw err;
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
