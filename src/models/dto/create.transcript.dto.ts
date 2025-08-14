export interface CriteriaWeight {
  criterionId: string;
  weight: number;
}

export interface CreateTranscriptDTO {
  content: string;
  employeeId?: string;
  externalCompanyId?: string;
  contactId?: string;
  timestamp: string;
  autoStartReview: boolean;
  reviewConfigId?: string;
  criteriaWeights?: CriteriaWeight[];
  reviewType?: "sentiment" | "performance" | "both";
}
