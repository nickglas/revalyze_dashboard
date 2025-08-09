export enum ReviewStatus {
  NOT_STARTED = "NOT_STARTED",
  STARTED = "STARTED",
  REVIEWED = "REVIEWED",
  ERROR = "ERROR",
}

export interface TranscriptSummaryDto {
  id: string;
  uploadedByName: string;
  employeeName: string;
  contactName: string;
  externalCompany: string | null;
  timestamp: Date;
  reviewStatus: ReviewStatus;
  isReviewed: boolean;
  contentPreview: string;
}
