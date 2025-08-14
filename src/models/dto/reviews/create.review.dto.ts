interface CreateReviewDTO {
  transcriptId: string;
  type: "sentiment" | "performance" | "both";
  reviewConfigId?: string;
  criteriaWeights?: Array<{
    criterionId: string;
    weight: number;
  }>;
}
