import api from "@/util/axios";
import { Criterion } from "@/models/api/criteria.api";
import { PaginatedResponse } from "@/models/others/PaginatedResponse";

export const getCriteria = async (
  page = 1,
  limit = 20
): Promise<PaginatedResponse<Criterion>> => {
  const res = await api.get(`/api/v1/criteria?page=${page}&limit=${limit}`);
  return res.data;
};

export const createCriterion = async (input: {
  title: string;
  description: string;
  isActive: boolean;
}): Promise<Criterion> => {
  const res = await api.post("/api/v1/criteria", input);
  return res.data;
};

export const toggleStatus = async (
  criterion: Criterion
): Promise<Criterion> => {
  const res = await api.patch(`/api/v1/criteria/${criterion._id}/status`, {
    isActive: !criterion.isActive,
  });
  return res.data;
};

export const updateCriterion = async (
  id: string,
  updates: Partial<Criterion>
): Promise<Criterion> => {
  const res = await api.patch(`/api/v1/criteria/${id}`, updates);
  return res.data;
};
