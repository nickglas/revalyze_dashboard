// models/dto/plan/detail.plan.dto.ts
export interface PlanDetailsDTO {
  _id: string;
  name: string;
  description: string;
  stripeProductId: string;
  currency: string;
  allowedUsers: number;
  allowedTranscripts: number;
  allowedReviews: number;
  billingOptions: BillingOptionDTO[];
  features: string[];
}

export interface BillingOptionDTO {
  interval: string;
  stripePriceId: string;
  amount: number;
  tier: number;
}
