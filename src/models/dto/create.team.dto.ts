//for the datatable
export interface TeamMemberDTO {
  userId: string;
  name: string;
  email: string;
  isManager: boolean;
}

//for the datatable
export interface CreateTeamDTO {
  name: string;
  description: string;
  isActive: boolean;
  users: TeamMemberDTO[];
}

//for api request
export interface CreateTeamUserDTO {
  userId: string;
  isManager: boolean;
}

//for api request
export interface CreateTeamDTOForAPI {
  name: string;
  description: string;
  isActive: boolean;
  users: CreateTeamUserDTO[];
}
