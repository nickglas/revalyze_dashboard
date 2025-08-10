import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaginationMeta } from "@/models/others/PaginationMeta";
import * as service from "@/services/transcript.service";
import { toast } from "react-toastify";
import { TranscriptSummaryDto } from "@/models/dto/transcripts/transcript.summary.dto";
import { CreateTranscriptDTO } from "@/models/dto/create.transcript.dto";

interface TranscriptState {
  transcripts: TranscriptSummaryDto[] | null;
  meta: PaginationMeta | null;
  isLoading: boolean;

  fetchTranscripts: (
    filters: any,
    page?: number,
    limit?: number
  ) => Promise<void>;
  createTranscript: (data: CreateTranscriptDTO) => Promise<void>;
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

      //upload transcript
      createTranscript: async (data: CreateTranscriptDTO) => {
        set({ isLoading: true });
        try {
          await service.createTranscript(data);
          toast.success("Transcript uploaded successfully!");
          // Refresh the list after creation
          await get().fetchTranscripts({}, 1, get().meta?.limit || 5);
        } catch (err) {
          toast.error("Failed to upload transcript");
          console.error(err);
        } finally {
          set({ isLoading: false });
        }
      },
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
