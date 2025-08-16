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

  fetchCompanies: (
    filters: any, // Add filters parameter
    page?: number,
    limit?: number
  ) => Promise<void>;

  createCompany: (input: {
    name: string;
    email: string;
    phone: string;
    address: string;
    isActive: boolean;
  }) => Promise<ExternalCompany>;

  toggleExternalCompanyStatus: (
    externalCompany: ExternalCompany
  ) => Promise<void>;

  updateCompany: (
    id: string,
    updates: Partial<ExternalCompany>
  ) => Promise<ExternalCompany>;

  reset: () => void;
}

export const useExternalCompanyStore = create<ExternalCompanyState>()(
  persist(
    (set, get) => ({
      companies: null,
      meta: null,
      isLoading: false,

      fetchCompanies: async (filters: any = {}, page = 1, limit = 20) => {
        set({ isLoading: true });
        try {
          const res = await service.getCompanies(page, limit, filters);
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
          toast.success("External company created");
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

      toggleExternalCompanyStatus: async (externalCompany) => {
        try {
          const updated = await service.toggleStatus(externalCompany);
          toast.success("Company status updated");
          set((state) => ({
            companies: state.companies
              ? state.companies.map((c) =>
                  c._id === updated._id ? updated : c
                )
              : null,
          }));
        } catch (error) {
          toast.error("Error toggling company status");
          console.error("Failed to toggle status", error);
        }
      },

      updateCompany: async (id, updates) => {
        set({ isLoading: true });
        try {
          const updated = await service.updateExternalCompany(id, updates);
          toast.success("External company updated");
          set((state) => ({
            companies: state.companies
              ? state.companies.map((c) =>
                  c._id === updated._id ? updated : c
                )
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

      reset: () =>
        set({
          companies: null,
          meta: null,
          isLoading: false,
        }),
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
