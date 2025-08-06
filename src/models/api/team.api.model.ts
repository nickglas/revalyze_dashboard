import { User } from "./user.model";

export interface TeamMember {
  user: User;
  isManager: boolean;
}

export interface Team {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  users: TeamMember[] | [];
}
