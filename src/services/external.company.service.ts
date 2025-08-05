import api from "@/util/axios";
import { PaginatedResponse } from "@/models/others/PaginatedResponse";
import { ExternalCompany } from "@/models/api/external.company.model";

export const getCompanies = async (
  page = 1,
  limit = 20
): Promise<PaginatedResponse<ExternalCompany>> => {
  const res = await api.get(
    `/api/v1/external-companies?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const createExternalCompany = async (input: {
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}): Promise<ExternalCompany> => {
  const res = await api.post("/api/v1/external-companies", input);
  return res.data;
};

export const updateExternalCompany = async (
  id: string,
  updates: Partial<ExternalCompany>
): Promise<ExternalCompany> => {
  const res = await api.patch(`/api/v1/external-companies/${id}`, updates);
  return res.data;
};
