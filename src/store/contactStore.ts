import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaginationMeta } from "@/models/others/PaginationMeta";
import * as service from "@/services/contact.service";
import { toast } from "react-toastify";
import { Contact } from "@/models/api/contact.api.model";

interface ContactState {
  contacts: Contact[] | null;
  meta: PaginationMeta | null;
  isLoading: boolean;

  fetchContacts: (page?: number, limit?: number) => Promise<void>;
}

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: null,
      meta: null,
      isLoading: false,

      fetchContacts: async (page = 1, limit = 20) => {
        set({ isLoading: true });
        try {
          const res = await service.getContacts(page, limit);
          set({
            contacts: res.data,
            meta: res.meta,
          });
        } catch (err) {
          toast.error("Failed to fetch contacts");
          console.error(err);
          set({ contacts: null, meta: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),

    {
      name: "contacts-storage",
      partialize: (state) => ({
        criteria: state.contacts,
        meta: state.meta,
      }),
    }
  )
);
