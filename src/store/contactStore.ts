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
  createContact: (input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    isActive: boolean;
    externalCompanyId: string;
  }) => Promise<Contact>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<Contact>;
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

      createContact: async (input) => {
        set({ isLoading: true });
        try {
          const newContact = await service.createContact(input);
          toast.success("Contact created");
          set((state) => ({
            contacts: state.contacts
              ? [newContact, ...state.contacts]
              : [newContact],
            meta: state.meta
              ? { ...state.meta, total: state.meta.total + 1 }
              : state.meta,
          }));
          return newContact;
        } catch (err: any) {
          toast.error(
            err?.response?.data?.message || "Failed to create contact"
          );
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      updateContact: async (id, updates) => {
        set({ isLoading: true });
        try {
          const updated = await service.updateContact(id, updates);
          toast.success("Contact updated");
          set((state) => ({
            contacts: state.contacts
              ? state.contacts.map((c) => (c._id === updated._id ? updated : c))
              : null,
          }));
          return updated;
        } catch (err: any) {
          toast.error(
            err?.response?.data?.message || "Failed to update contact"
          );
          throw err;
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
