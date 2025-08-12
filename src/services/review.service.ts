import api from "@/util/axios";
import { PaginatedResponse } from "@/models/others/PaginatedResponse";
import { ReviewSummaryDto } from "@/models/dto/reviews/review.summary.dto";

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
