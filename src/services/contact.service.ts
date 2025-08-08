import api from "@/util/axios";
import { PaginatedResponse } from "@/models/others/PaginatedResponse";
import { Contact } from "@/models/api/contact.api.model";

export const getContacts = async (
  page = 1,
  limit = 20,
  filters: any = {}
): Promise<PaginatedResponse<Contact>> => {
  const params = {
    page,
    limit,
    ...filters,
  };

  Object.keys(params).forEach(
    (key) => params[key] === undefined && delete params[key]
  );

  const res = await api.get("/api/v1/contacts", { params });
  return res.data;
};

export const createContact = async (input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  isActive: boolean;
  externalCompanyId: string;
}): Promise<Contact> => {
  const res = await api.post("/api/v1/contacts", input);
  return res.data;
};

export const updateContact = async (
  id: string,
  updates: Partial<Contact>
): Promise<Contact> => {
  const res = await api.patch(`/api/v1/contacts/${id}`, updates);
  return res.data;
};
