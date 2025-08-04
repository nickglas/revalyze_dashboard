import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Criterion } from "@/models/api/criteria.api";
import { PaginationMeta } from "@/models/others/PaginationMeta";
import * as service from "@/services/criteria.service";
import { toast } from "react-toastify";

interface CriteriaState {
  criteria: Criterion[] | null;
  meta: PaginationMeta | null;
  isLoading: boolean;

  fetchCriteria: (page?: number, limit?: number) => Promise<void>;
  createCriterion: (input: {
    title: string;
    description: string;
    isActive: boolean;
  }) => Promise<Criterion>;
  toggleCriterionStatus: (criterion: Criterion) => Promise<void>;
  updateCriterion: (
    id: string,
    updates: Partial<Criterion>
  ) => Promise<Criterion>;
}

export const useCriteriaStore = create<CriteriaState>()(
  persist(
    (set, get) => ({
      criteria: null,
      meta: null,
      isLoading: false,

      fetchCriteria: async (page = 1, limit = 20) => {
        set({ isLoading: true });
        try {
          const res = await service.getCriteria(page, limit);
          set({
            criteria: res.data,
            meta: res.meta,
          });
        } catch (err) {
          toast.error("Failed to fetch criteria");
          console.error(err);
          set({ criteria: null, meta: null });
        } finally {
          set({ isLoading: false });
        }
      },

      createCriterion: async (input) => {
        set({ isLoading: true });
        try {
          const newCriterion = await service.createCriterion(input);
          toast.success("Criterion created");
          set((state) => ({
            criteria: state.criteria
              ? [newCriterion, ...state.criteria]
              : [newCriterion],
            meta: state.meta
              ? { ...state.meta, total: state.meta.total + 1 }
              : state.meta,
          }));
          return newCriterion;
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Failed to create");
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      toggleCriterionStatus: async (criterion) => {
        try {
          console.warn(criterion);
          const updated = await service.toggleStatus(criterion);
          toast.success("Criterion status updated");
          set((state) => ({
            criteria: state.criteria
              ? state.criteria.map((c) => (c._id === updated._id ? updated : c))
              : null,
          }));
        } catch (error) {
          toast.error("Error toggling criterion status");
          console.error("Failed to toggle status", error);
        }
      },

      updateCriterion: async (id, updates) => {
        set({ isLoading: true });
        try {
          const updated = await service.updateCriterion(id, updates);
          toast.success("Criterion updated");
          set((state) => ({
            criteria: state.criteria
              ? state.criteria.map((c) => (c._id === updated._id ? updated : c))
              : null,
          }));
          return updated;
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Failed to update");
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },
    }),

    {
      name: "criteria-storage",
      partialize: (state) => ({
        criteria: state.criteria,
        meta: state.meta,
      }),
    }
  )
);
