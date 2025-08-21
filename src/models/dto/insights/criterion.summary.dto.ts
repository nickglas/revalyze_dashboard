export interface CriterionSummaryDTO {
  criterionName: string;
  avgScore: number;
  reviewCount: number;

  trend: [
    {
      date: Date;
      score: number;
      reviewCount: number;
    },
  ];
}
