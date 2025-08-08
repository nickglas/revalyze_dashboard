import api from "@/util/axios";
import { PaginatedResponse } from "@/models/others/PaginatedResponse";
import { User } from "@/models/api/user.model";

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

export const createUser = async (input: {
  name: string;
  email: string;
  role: "employee" | "company_admin";
  isActive: boolean;
}): Promise<User> => {
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
