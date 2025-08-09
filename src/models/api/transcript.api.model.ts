export interface Transcript {
  _id: string;
  employeeId: string;
  companyId: string;
  externalCompanyId?: boolean;
  contactId?: string;
  content: string;
  timestamp: Date;
  uploadedBy: string;
  isReviewed: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
