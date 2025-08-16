export interface subscriptionDetailsDTO {
  id: string;
  isTrial: boolean;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  priceId: string;
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  interval: string;
  allowedUsers: number;
  allowedTranscripts: number;
  allowedReviews: number;
  tier: number;
  scheduledUpdate?: scheduledUpdateDTO;
  createdAt: Date;
  updatedAt: Date;
}

export interface scheduledUpdateDTO {
  productName: string;
  effectiveDate: Date;
  priceId: string;
  productId: string;
  amount: number;
  interval: string;
  allowedUsers: number;
  allowedTranscripts: number;
  allowedReviews: number;
  tier: number;
  scheduleId: string;
}
