import { Criterion, CriterionWeight } from "./criteria.api.model";

export interface ReviewConfig {
  _id: string;
  name: string;
  description?: string;
  criteria: CriterionWeight[];
  modelSettings: {
    temperature: number;
    maxTokens: 2000;
  };
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
