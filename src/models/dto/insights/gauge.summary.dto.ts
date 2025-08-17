export interface DashboardLimitData {
  users: {
    current: number;
    allowed: number;
  };
  transcripts: {
    current: number;
    allowed: number;
  };
  reviews: {
    current: number;
    allowed: number;
  };
  performance: number;
  sentiment: number;
}
