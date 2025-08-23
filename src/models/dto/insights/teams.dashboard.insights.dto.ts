export interface TeamsDashboardData {
  teamId: string;
  teamName: string;
  avgOverall: number;
  avgSentiment: number;
  reviewCount: number;
  empathie: number;
  oplossingsgerichtheid: number;
  professionaliteit: number;
  klanttevredenheid: number;
  sentimentKlant: number;
  helderheidEnBegrijpelijkheid: number;
  responsiviteitLuistervaardigheid: number;
  tijdsefficientieDoelgerichtheid: number;
  data: {
    period: Date;
    avgOverall: number | null;
    avgSentiment: number | null;
    reviewCount: number;
  }[];
}
