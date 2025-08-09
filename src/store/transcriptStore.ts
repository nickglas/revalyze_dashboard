import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaginationMeta } from "@/models/others/PaginationMeta";
import * as service from "@/services/transcript.service";
import { toast } from "react-toastify";
import { TranscriptSummaryDto } from "@/models/dto/transcripts/transcript.summary.dto";

interface TranscriptState {
  transcripts: TranscriptSummaryDto[] | null;
  meta: PaginationMeta | null;
  isLoading: boolean;

  fetchTranscripts: (
    filters: any,
    page?: number,
    limit?: number
  ) => Promise<void>;
  // createCriterion: (input: {
  //   title: string;
  //   description: string;
  //   isActive: boolean;
  // }) => Promise<Criterion>;
  // toggleCriterionStatus: (criterion: Criterion) => Promise<void>;
  // updateCriterion: (
  //   id: string,
  //   updates: Partial<Criterion>
  // ) => Promise<Criterion>;
}

export const useTranscriptStore = create<TranscriptState>()(
  persist(
    (set, get) => ({
      transcripts: null,
      meta: null,
      isLoading: false,
      fetchTranscripts: async (filters: any = {}, page = 1, limit = 5) => {
        set({ isLoading: true });
        try {
          const res = await service.getTranscripts(page, limit, filters);
          set({
            transcripts: res.data,
            meta: res.meta,
          });
        } catch (err) {
          toast.error("Failed to fetch transcripts");
          console.error(err);
          set({ transcripts: [], meta: null });
        } finally {
          set({ isLoading: false });
        }
      },

      // createCriterion: async (input) => {
      //   set({ isLoading: true });
      //   try {
      //     const newCriterion = await service.createCriterion(input);
      //     toast.success("Criterion created");
      //     set((state) => ({
      //       criteria: state.criteria
      //         ? [newCriterion, ...state.criteria]
      //         : [newCriterion],
      //       meta: state.meta
      //         ? { ...state.meta, total: state.meta.total + 1 }
      //         : state.meta,
      //     }));
      //     return newCriterion;
      //   } catch (err: any) {
      //     toast.error(err?.response?.data?.message || "Failed to create");
      //     throw err;
      //   } finally {
      //     set({ isLoading: false });
      //   }
      // },

      // toggleCriterionStatus: async (criterion) => {
      //   try {
      //     console.warn(criterion);
      //     const updated = await service.toggleStatus(criterion);
      //     toast.success("Criterion status updated");
      //     set((state) => ({
      //       criteria: state.criteria
      //         ? state.criteria.map((c) => (c._id === updated._id ? updated : c))
      //         : null,
      //     }));
      //   } catch (error) {
      //     toast.error("Error toggling criterion status");
      //     console.error("Failed to toggle status", error);
      //   }
      // },

      // updateCriterion: async (id, updates) => {
      //   set({ isLoading: true });
      //   try {
      //     const updated = await service.updateCriterion(id, updates);
      //     toast.success("Criterion updated");
      //     set((state) => ({
      //       criteria: state.criteria
      //         ? state.criteria.map((c) => (c._id === updated._id ? updated : c))
      //         : null,
      //     }));
      //     return updated;
      //   } catch (err: any) {
      //     toast.error(err?.response?.data?.message || "Failed to update");
      //     throw err;
      //   } finally {
      //     set({ isLoading: false });
      //   }
      // },
    }),

    {
      name: "transcripts-storage",
      partialize: (state) => ({
        transcripts: state.transcripts,
        meta: state.meta,
      }),
    }
  )
);
