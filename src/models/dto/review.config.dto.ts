export interface CreateReviewConfigDTO {
  name: string;
  description?: string;
  isActive: boolean;
  criteria: {
    criterionId: string;
    weight: number;
  }[];
  modelSettings: {
    temperature: number;
    maxTokens: number;
  };
}

export interface CriterionSelectionDTO {
  _id: string;
  title: string;
  description: string;
  weight: number;
}
