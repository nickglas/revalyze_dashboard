import api from "@/util/axios";
import { PaginatedResponse } from "@/models/others/PaginatedResponse";
import { Contact } from "@/models/api/contact.api.model";

export const getContacts = async (
  page = 1,
  limit = 20
): Promise<PaginatedResponse<Contact>> => {
  const res = await api.get(`/api/v1/contacts?page=${page}&limit=${limit}`);
  return res.data;
};
