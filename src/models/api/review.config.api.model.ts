import { Criterion } from "./criteria.api.model";

export interface ReviewConfig {
  _id: string;
  name: string;
  criteria: Criterion[];
  modelSettings: {
    temperature: number;
    maxTokens: 2000;
  };
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
