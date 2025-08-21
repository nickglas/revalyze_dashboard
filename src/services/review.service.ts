import api from "@/util/axios";
import { PaginatedResponse } from "@/models/others/PaginatedResponse";
import { ReviewSummaryDto } from "@/models/dto/reviews/review.summary.dto";
import { ReviewDetailDTO } from "@/models/dto/reviews/detail.review.dto";

export const getReviews = async (
  page = 1,
  limit = 5,
  filters: any = {}
): Promise<PaginatedResponse<ReviewSummaryDto>> => {
  const params = {
    page,
    limit,
    ...filters,
  };

  Object.keys(params).forEach(
    (key) => params[key] === undefined && delete params[key]
  );

  const res = await api.get(`/api/v1/reviews`, { params });
  return res.data;
};

export const createReview = async (
  input: CreateReviewDTO
): Promise<ReviewSummaryDto> => {
  const res = await api.post("/api/v1/reviews", input);
  return res.data;
};

export const getById = async (id: string): Promise<ReviewDetailDTO> => {
  const res = await api.get(`/api/v1/reviews/${id}`);
  return res.data;
};

export const deleteReview = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/reviews/${id}`);
};
