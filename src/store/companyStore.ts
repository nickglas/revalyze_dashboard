import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaginationMeta } from "@/models/others/PaginationMeta";
import { CompanyDetails } from "@/models/dto/company/company.detailed.dto";
import {
  getCompanyDetail,
  updateCompanyDetail,
} from "@/services/company.service";
import { toast } from "react-toastify";

interface CompanyState {
  companyDetails: CompanyDetails | null;

  meta: PaginationMeta | null;
  isLoading: boolean;
  isUpdating: boolean;

  getCompanyDetails: () => Promise<CompanyDetails | null>;
  updateCompanyDetails: (updateData: Partial<CompanyDetails>) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      companyDetails: null,
      meta: null,
      isLoading: false,
      isUpdating: false,

      async getCompanyDetails() {
        const { companyDetails } = get();

        if (companyDetails) {
          return null;
        }

        set({ isLoading: true });
        try {
          const companyDetails = await getCompanyDetail();
          set((state) => ({
            companyDetails,
          }));
          return companyDetails;
        } catch (err: any) {
          toast.error(
            err?.response?.data?.message || "Failed to company details"
          );
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      async updateCompanyDetails(updateData: Partial<CompanyDetails>) {
        set({ isUpdating: true });
        try {
          const updatedDetails = await updateCompanyDetail(updateData);
          set({ companyDetails: updatedDetails });
          toast.success("Company details updated successfully");
        } catch (err: any) {
          toast.error(
            err?.response?.data?.message || "Failed to update company details"
          );
          throw err;
        } finally {
          set({ isUpdating: false });
        }
      },
    }),

    {
      name: "company-storage",
      partialize: (state) => ({
        companyDetails: state.companyDetails,
        meta: state.meta,
      }),
    }
  )
);
