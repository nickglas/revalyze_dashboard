import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaginationMeta } from "@/models/others/PaginationMeta";
import * as service from "@/services/user.service";
import { toast } from "react-toastify";
import { User } from "@/models/api/user.model";
import { CreateUserDto } from "@/models/dto/users/create.user.dto";
import { Team } from "@/models/api/team.api.model";

interface UserState {
  users: User[] | null;
  selectedUserTeams: Team[] | null;
  meta: PaginationMeta | null;
  isLoading: boolean;
  isLoadingTeam: boolean;

  fetchUsers: (filters: any, page?: number, limit?: number) => Promise<void>;
  fetchTeams: (userId: string) => Promise<void>;
  createUser: (input: CreateUserDto) => Promise<User>;
  updateUser: (id: string, updates: Partial<User>) => Promise<User>;
  toggleUserStatus: (user: User) => Promise<User | undefined>;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: null,
      selectedUserTeams: null,
      meta: null,
      isLoading: false,
      isLoadingTeam: false,

      fetchUsers: async (filters: any = {}, page = 1, limit = 20) => {
        set({ isLoading: true });
        try {
          const res = await service.getUsers(page, limit, filters);
          set({
            users: res.data,
            meta: res.meta,
          });
        } catch (err) {
          toast.error("Failed to fetch users");
          console.error(err);
          set({ users: null, meta: null });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchTeams: async (userId: string) => {
        set({ isLoading: true });
        try {
          const res = await service.getUserActiveTeams(userId);
          set({
            selectedUserTeams: res,
          });
        } catch (err) {
          toast.error("Failed to fetch users");
          console.error(err);
          set({ users: null, meta: null });
        } finally {
          set({ isLoading: false });
        }
      },

      createUser: async (input) => {
        set({ isLoading: true });
        try {
          const newUser = await service.createUser(input);
          set((state) => ({
            users: state.users ? [newUser, ...state.users] : [newUser],
            meta: state.meta
              ? { ...state.meta, total: state.meta.total + 1 }
              : state.meta,
          }));
          return newUser;
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Failed to create user");
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      updateUser: async (id, updates) => {
        set({ isLoading: true });
        try {
          const updated = await service.updateUser(id, updates);
          toast.success("User updated");
          set((state) => ({
            users: state.users
              ? state.users.map((u) => (u._id === updated._id ? updated : u))
              : null,
          }));
          return updated;
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Failed to update user");
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      toggleUserStatus: async (user) => {
        try {
          const updated = await service.toggleUserStatus(user);
          toast.success("User status updated");
          set((state) => ({
            users: state.users
              ? state.users.map((u) => (u._id === updated._id ? updated : u))
              : null,
          }));
          return updated;
        } catch (error) {
          toast.error("Error toggling user status");
          console.error("Failed to toggle status", error);
        }
      },

      reset: () =>
        set({
          users: null,
          meta: null,
          isLoading: false,
        }),
    }),

    {
      name: "users-storage",
      partialize: (state) => ({
        users: state.users,
        meta: state.meta,
      }),
    }
  )
);
