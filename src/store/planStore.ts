import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PlanDetailsDTO } from "@/models/dto/plan/detail.plan.dto";
import { getPlans } from "@/services/plan.service";
import { toast } from "react-toastify";

interface PlanState {
  plans: PlanDetailsDTO[] | null;
  isLoading: boolean;

  getPlans: () => Promise<void>;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      plans: null,
      isLoading: false,

      async getPlans() {
        set({ isLoading: true });
        try {
          const res = await getPlans();
          set({
            plans: res,
          });
        } catch (err) {
          toast.error("Failed to fetch plans");
          console.error(err);
          set({ plans: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "plans-storage",
      partialize: (state) => ({
        plans: state.plans,
      }),
    }
  )
);
