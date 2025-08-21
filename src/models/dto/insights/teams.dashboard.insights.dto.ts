export interface TeamsDashboardData {
  teamId: string;
  companyId: string;
  empathie: number;
  helderheidEnBegrijpelijkheid: number;
  klanttevredenheid: number;
  oplossingsgerichtheid: number;
  professionaliteit: number;
  responsiviteitLuistervaardigheid: number;
  tijdsefficientieDoelgerichtheid: number;
  avgOverall: number;
  avgSentiment: number;
  reviewCount: number;
  team: {
    _id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
