import api from "@/util/axios";
import { PaginatedResponse } from "@/models/others/PaginatedResponse";
import { User } from "@/models/api/user.model";
import { CreateUserDto } from "@/models/dto/users/create.user.dto";
import { Team } from "@/models/api/team.api.model";

export const getUsers = async (
  page = 1,
  limit = 20,
  filters: any = {}
): Promise<PaginatedResponse<User>> => {
  const params = {
    page,
    limit,
    ...filters,
  };

  Object.keys(params).forEach(
    (key) => params[key] === undefined && delete params[key]
  );

  const res = await api.get("/api/v1/users", { params });
  return res.data;
};

export const createUser = async (input: CreateUserDto): Promise<User> => {
  const res = await api.post("/api/v1/users", input);
  return res.data;
};

export const updateUser = async (
  id: string,
  updates: Partial<User>
): Promise<User> => {
  const res = await api.patch(`/api/v1/users/${id}`, updates);
  return res.data;
};

export const toggleUserStatus = async (user: User): Promise<User> => {
  const res = await api.patch(`/api/v1/users/${user._id}/toggle-status`, {
    isActive: !user.isActive,
  });
  return res.data;
};

export const getUserActiveTeams = async (userId: string): Promise<Team[]> => {
  const res = await api.get(`/api/v1/users/${userId}/teams`);
  return res.data;
};
