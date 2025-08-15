import api from "@/util/axios";
import { PlanDetailsDTO } from "@/models/dto/plan/detail.plan.dto";

export const getPlans = async (): Promise<PlanDetailsDTO[]> => {
  const res = await api.get(`/api/v1/subscriptions`);
  return res.data;
};
