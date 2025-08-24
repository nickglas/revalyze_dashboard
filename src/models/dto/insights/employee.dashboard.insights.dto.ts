export interface IEmployee {
  _id: string;
  email: string;
  name: string;
  role: "employee" | "company_admin" | string;
}

export interface ITeam {
  _id: string;
  name: string;
}

export interface IEmployeeDashboardData {
  _id: string;
  companyId: string;
  employeeId: string;
  teamId?: string;
  avgOverall: number;
  empathie: number;
  helderheidEnBegrijpelijkheid: number;
  klanttevredenheid: number;
  oplossingsgerichtheid: number;
  professionaliteit: number;
  responsiviteitLuistervaardigheid: number;
  tijdsefficientieDoelgerichtheid: number;
  avgSentiment: number;
  sentimentKlant: number;
  reviewCount: number;
  employee: IEmployee;
  team?: ITeam;
}
