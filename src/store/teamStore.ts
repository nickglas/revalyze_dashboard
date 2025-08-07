import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaginationMeta } from "@/models/others/PaginationMeta";
import * as service from "@/services/team.service";
import { toast } from "react-toastify";
import { Team } from "@/models/api/team.api.model";
import {
  CreateTeamDTO,
  CreateTeamDTOForAPI,
} from "@/models/dto/create.team.dto";
import { UpdateTeamDTO } from "@/models/dto/update.team.dto";

interface TeamState {
  teams: Team[] | null;
  meta: PaginationMeta | null;
  isLoading: boolean;

  fetchTeams: (filters: any, page?: number, limit?: number) => Promise<void>;
  createTeam: (input: CreateTeamDTO) => Promise<Team>;
  updateTeam: (id: string, input: UpdateTeamDTO) => Promise<Team>;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      teams: null,
      meta: null,
      isLoading: false,

      fetchTeams: async (filters: any = {}, page = 1, limit = 5) => {
        set({ isLoading: true });
        try {
          const res = await service.getTeams(page, limit, filters);
          set({
            teams: res.data,
            meta: res.meta,
          });
        } catch (err) {
          toast.error("Failed to fetch teams");
          console.error(err);
          set({ teams: null, meta: null });
        } finally {
          set({ isLoading: false });
        }
      },

      createTeam: async (input) => {
        set({ isLoading: true });
        try {
          const payload: CreateTeamDTOForAPI = {
            name: input.name,
            description: input.description,
            isActive: input.isActive,
            users: input.users.map(({ userId, isManager }) => ({
              userId,
              isManager,
            })),
          };

          const newTeam = await service.createTeam(payload);
          toast.success("Team created");
          set((state) => ({
            teams: state.teams ? [newTeam, ...state.teams] : [newTeam],
            meta: state.meta
              ? { ...state.meta, total: state.meta.total + 1 }
              : state.meta,
          }));
          return newTeam;
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Failed to create team");
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      updateTeam: async (id, input) => {
        set({ isLoading: true });
        try {
          const payload: CreateTeamDTOForAPI = {
            name: input.name!,
            description: input.description!,
            isActive: input.isActive!,
            users: input.users!.map(({ userId, isManager }) => ({
              userId,
              isManager,
            })),
          };

          const updated = await service.updateTeam(id, payload);
          toast.success("Team updated");
          set((state) => ({
            teams: state.teams
              ? state.teams.map((c) => (c._id === updated._id ? updated : c))
              : null,
          }));
          return updated;
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Failed to update team");
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },
    }),

    {
      name: "teams-storage",
      partialize: (state) => ({
        criteria: state.teams,
        meta: state.meta,
      }),
    }
  )
);
