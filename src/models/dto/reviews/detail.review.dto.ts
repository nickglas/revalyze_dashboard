export interface ReviewDetailDTO {
  _id: string;
  transcriptId: {
    _id: string;
    content: string;
  };
  reviewConfig: {
    _id: string;
    name: string;
    description: string;
    criteria: {
      criterionId: string;
      weight: number;
      title: string;
      description: string;
    }[];
    modelSettings: {
      temperature: number;
      maxTokens: number;
    };
    companyId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  reviewStatus: string;
  type: string;
  subject: string;
  criteriaScores: {
    criterionName: string;
    score: number;
    comment: string;
    quote: string;
    feedback: string;
  }[];
  overallScore: number;
  overallFeedback: string;
  externalCompanyId?: {
    _id: string;
    name: string;
    email: string;
  };
  contactId?: {
    _id: string;
    firstName: string;
    email: string;
  };
  employeeId: {
    _id: string;
    email: string;
    name: string;
  };
  companyId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  sentimentAnalysis: string;
  sentimentLabel: string;
  sentimentScore: number;
}
