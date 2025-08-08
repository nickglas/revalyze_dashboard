import api from "@/util/axios";
import { PaginatedResponse } from "@/models/others/PaginatedResponse";
import { ExternalCompany } from "@/models/api/external.company.model";

// Updated to accept filters
export const getCompanies = async (
  page = 1,
  limit = 20,
  filters: any = {}
): Promise<PaginatedResponse<ExternalCompany>> => {
  const params = {
    page,
    limit,
    ...filters,
  };

  Object.keys(params).forEach(
    (key) => params[key] === undefined && delete params[key]
  );

  const res = await api.get("/api/v1/external-companies", { params });
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

export const toggleStatus = async (
  externalCompany: ExternalCompany
): Promise<ExternalCompany> => {
  const res = await api.patch(
    `/api/v1/external-companies/${externalCompany._id}/status`,
    { isActive: !externalCompany.isActive }
  );
  return res.data;
};
