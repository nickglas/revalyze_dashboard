import { Team } from "@/models/api/team.api.model";

export interface SelectedTeamDTO {
  team: Team;
  isManager: boolean;
}

export interface SelectedTeamDTOID {
  id: string;
  isManager: boolean;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  teams: SelectedTeamDTOID[];
}
