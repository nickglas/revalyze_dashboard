export interface TeamsDashboardData {
  teamId: string;
  companyId: string;
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
