import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaginationMeta } from "@/models/others/PaginationMeta";
import * as service from "@/services/external.company.service";
import { toast } from "react-toastify";
import { ExternalCompany } from "@/models/api/external.company.model";

interface ExternalCompanyState {
  companies: ExternalCompany[] | null;
  meta: PaginationMeta | null;
  isLoading: boolean;

  fetchCompanies: (page?: number, limit?: number) => Promise<void>;
  createCompany: (input: {
    name: string;
    email: string;
    phone: string;
    address: string;
    isActive: boolean;
  }) => Promise<ExternalCompany>;
}

export const useExternalCompanyStore = create<ExternalCompanyState>()(
  persist(
    (set, get) => ({
      companies: null,
      meta: null,
      isLoading: false,

      fetchCompanies: async (page = 1, limit = 20) => {
        set({ isLoading: true });
        try {
          const res = await service.getCompanies(page, limit);
          set({
            companies: res.data,
            meta: res.meta,
          });
        } catch (err) {
          toast.error("Failed to fetch companies");
          console.error(err);
          set({ companies: null, meta: null });
        } finally {
          set({ isLoading: false });
        }
      },

      createCompany: async (input) => {
        set({ isLoading: true });
        try {
          const newExternalCompany = await service.createExternalCompany(input);
          toast.success("Criterion created");
          set((state) => ({
            companies: state.companies
              ? [newExternalCompany, ...state.companies]
              : [newExternalCompany],
            meta: state.meta
              ? { ...state.meta, total: state.meta.total + 1 }
              : state.meta,
          }));
          return newExternalCompany;
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Failed to create");
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },
    }),

    {
      name: "companies-storage",
      partialize: (state) => ({
        criteria: state.companies,
        meta: state.meta,
      }),
    }
  )
);
