export interface CreateReviewConfigDTO {
  name: string;
  description?: string;
  isActive: boolean;
  criteriaIds: string[];
  modelSettings: {
    temperature: number;
    maxTokens: number;
  };
}

export interface CriterionSelectionDTO {
  _id: string;
  title: string;
  description: string;
}
