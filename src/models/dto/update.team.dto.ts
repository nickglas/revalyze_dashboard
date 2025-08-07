export interface UpdateTeamUserDTO {
  userId: string;
  isManager: boolean;
}

export interface UpdateTeamDTO {
  name?: string;
  description?: string;
  isActive?: boolean;
  users?: UpdateTeamUserDTO[];
}
