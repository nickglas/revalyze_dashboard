import { ExternalCompany } from "./external.company.model";

export interface Contact {
  _id: string;
  externalCompanyId: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  isActive: boolean;
  externalCompany: ExternalCompany;
  createdAt: string;
  updatedAt: string;
}
