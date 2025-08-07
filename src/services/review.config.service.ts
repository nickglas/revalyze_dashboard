import api from "@/util/axios";
import { PaginatedResponse } from "@/models/others/PaginatedResponse";
import { ReviewConfig } from "@/models/api/review.config.api.model";

export const getConfigs = async (
  page = 1,
  limit = 5,
  filters: any = {}
): Promise<PaginatedResponse<ReviewConfig>> => {
  const params = {
    page,
    limit,
    ...filters,
  };

  Object.keys(params).forEach(
    (key) => params[key] === undefined && delete params[key]
  );

  const res = await api.get(`/api/v1/review-configs`, { params });
  return res.data;
};

// export const createConfig = async (input: CreateTeamDTOForAPI): Promise<Team> => {
//   console.warn(input);
//   const res = await api.post("/api/v1/teams", input);
//   return res.data;
// };

// export const toggleStatus = async (team: Team): Promise<Team> => {
//   const res = await api.patch(`/api/v1/teams/${team._id}/status`, {
//     isActive: !team.isActive,
//   });
//   return res.data;
// };

// export const updateTeam = async (
//   id: string,
//   updates: UpdateTeamDTO
// ): Promise<Team> => {
//   console.warn(id);
//   console.warn(updates);
//   const res = await api.patch(`/api/v1/teams/${id}`, updates);
//   return res.data;
// };
