import api from "@/util/axios";
import { PaginatedResponse } from "@/models/others/PaginatedResponse";
import { ReviewConfig } from "@/models/api/review.config.api.model";
import {
  CreateReviewConfigDTO,
  UpdateReviewConfigDTO,
} from "@/models/dto/review.config.dto";

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

export const createConfig = async (
  input: CreateReviewConfigDTO
): Promise<ReviewConfig> => {
  const res = await api.post("/api/v1/review-configs", input);
  return res.data;
};

export const updateConfig = async (
  id: string,
  input: UpdateReviewConfigDTO
): Promise<ReviewConfig> => {
  const res = await api.patch(`/api/v1/review-configs/${id}`, input);
  return res.data;
};

export const toggleStatus = async (
  reviewConfig: ReviewConfig
): Promise<ReviewConfig> => {
  const res = await api.patch(
    `/api/v1/review-configs/${reviewConfig._id}/status`,
    {
      isActive: !reviewConfig.isActive,
    }
  );
  return res.data;
};
