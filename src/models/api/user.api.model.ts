export interface User {
  _id: string;
  name: string;
  email: string;
  companyId: string;
  isActive: boolean;
  role: "employee" | "admin";
  createdAt: string;
  updatedAt: string;
}
