export interface CreateTranscriptDTO {
  content: string;
  employeeId?: string;
  externalCompanyId?: string;
  contactId?: string;
  timestamp: string;
  autoStartReview: boolean;
  reviewConfigId?: string;
  reviewType?: "sentiment" | "performance" | "both";
}
