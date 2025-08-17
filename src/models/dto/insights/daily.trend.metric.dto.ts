export interface DailyTrendMetricDTO {
  filter: string;
  data: DailyTrendMetricDataDTO[];
}

export interface DailyTrendMetricDataDTO {
  date: Date;
  avgOverall: number;
  avgSentiment: number;
  reviewCount: number;
}
