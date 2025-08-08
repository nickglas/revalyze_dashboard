import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaginationMeta } from "@/models/others/PaginationMeta";
import * as service from "@/services/review.config.service";
import { toast } from "react-toastify";
import { ReviewConfig } from "@/models/api/review.config.api.model";
import {
  CreateReviewConfigDTO,
  UpdateReviewConfigDTO,
} from "@/models/dto/review.config.dto";

interface ReviewConfigState {
  reviewConfigs: ReviewConfig[] | null;
  meta: PaginationMeta | null;
  isLoading: boolean;

  fetchReviewConfigs: (
    filters: any,
    page?: number,
    limit?: number
  ) => Promise<void>;

  createReviewConfig: (data: CreateReviewConfigDTO) => Promise<void>;
  updateReviewConfig: (
    id: string,
    data: UpdateReviewConfigDTO
  ) => Promise<ReviewConfig>;
  toggleStatus: (config: ReviewConfig) => Promise<void>;
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

      createReviewConfig: async (data: CreateReviewConfigDTO) => {
        set({ isLoading: true });
        try {
          await service.createConfig(data);
          // Refresh the list after creation
          await get().fetchReviewConfigs({}, 1, get().meta?.limit || 5);
        } catch (err) {
          toast.error("Failed to create review configuration");
          console.error(err);
        } finally {
          set({ isLoading: false });
        }
      },

      updateReviewConfig: async (id, data) => {
        set({ isLoading: true });
        try {
          const updated = await service.updateConfig(id, data);
          set((state) => ({
            reviewConfigs: state.reviewConfigs
              ? state.reviewConfigs.map((c) =>
                  c._id === updated._id ? updated : c
                )
              : null,
          }));
          toast.success("Review configuration updated successfully!");
          return updated; // Return the updated config
        } catch (err: any) {
          toast.error(
            err?.response?.data?.message ||
              "Failed to update review configuration"
          );
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      toggleStatus: async (config) => {
        set({ isLoading: true });
        try {
          const updated = await service.toggleStatus(config);
          set((state) => ({
            reviewConfigs: state.reviewConfigs
              ? state.reviewConfigs.map((c) =>
                  c._id === updated._id ? updated : c
                )
              : null,
          }));
          toast.success(
            `Configuration ${updated.isActive ? "activated" : "deactivated"}`
          );
        } catch (err) {
          toast.error("Failed to update status");
          console.error(err);
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
