import api from "@/util/axios";
import { CompanyDetails } from "@/models/dto/company/company.detailed.dto";
import { CompanyUpdateDTO } from "@/models/dto/company/company.update.dto";

export const getCompanyDetail = async (): Promise<CompanyDetails | null> => {
  const res = await api.get(`/api/v1/companies`);
  return res.data;
};

export const updateCompanyDetail = async (
  updateData: Partial<CompanyUpdateDTO>
): Promise<CompanyDetails> => {
  const res = await api.patch(`/api/v1/companies`, updateData);
  return res.data;
};

export const cancelScheduledDowngrade = async (): Promise<void> => {
  await api.delete(`/api/v1/companies/subscriptions/scheduled`);
};

export const updateSubscription = async (priceId: string): Promise<void> => {
  await api.patch(`/api/v1/companies/subscriptions`, {
    priceId: priceId,
  });
};
