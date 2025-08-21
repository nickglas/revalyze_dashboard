import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaginationMeta } from "@/models/others/PaginationMeta";
import * as service from "@/services/review.service";
import { toast } from "react-toastify";
import { ReviewSummaryDto } from "@/models/dto/reviews/review.summary.dto";
import { ReviewDetailDTO } from "@/models/dto/reviews/detail.review.dto";

interface ReviewState {
  reviews: ReviewSummaryDto[] | null;
  reviewDetails: Record<string, ReviewDetailDTO>;
  selectedReview: ReviewDetailDTO | null;
  meta: PaginationMeta | null;
  isLoading: boolean;
  isDeleting: boolean;

  fetchReviews: (filters: any, page?: number, limit?: number) => Promise<void>;
  fetchById: (id: string) => Promise<ReviewDetailDTO>;
  createReview: (input: CreateReviewDTO) => Promise<ReviewSummaryDto>;
  deleteReview: (id: string) => Promise<void>;
  reset: () => void;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: null,
      meta: null,
      isLoading: false,
      reviewDetails: {},
      selectedReview: null,
      isDeleting: false,

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
        const { reviewDetails } = get();

        if (reviewDetails[id]) {
          set({ selectedReview: reviewDetails[id] });
          return reviewDetails[id];
        }

        set({ isLoading: true });
        try {
          const selectedReview = await service.getById(id);
          set((state) => ({
            selectedReview,
            reviewDetails: { ...state.reviewDetails, [id]: selectedReview },
          }));
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

      deleteReview: async (id: string) => {
        set({ isDeleting: true });
        try {
          await service.deleteReview(id);
          set((state) => ({
            reviews: state.reviews
              ? state.reviews.filter((review) => review._id !== id)
              : null,
            reviewDetails: Object.fromEntries(
              Object.entries(state.reviewDetails).filter(([key]) => key !== id)
            ),
            selectedReview:
              state.selectedReview?._id === id ? null : state.selectedReview,
            meta: state.meta
              ? { ...state.meta, total: state.meta.total - 1 }
              : null,
          }));
          toast.success("Review deleted successfully");
        } catch (err: any) {
          toast.error(
            err?.response?.data?.message || "Failed to delete review"
          );
          throw err;
        } finally {
          set({ isDeleting: false });
        }
      },

      reset: () =>
        set({
          reviews: null,
          reviewDetails: {},
          meta: null,
          isLoading: false,
        }),
    }),

    {
      name: "reviews-storage",
      partialize: (state) => ({
        reviews: state.reviews,
        reviewDetails: state.reviewDetails,
        selectedReview: state.selectedReview,
        meta: state.meta,
      }),
    }
  )
);
