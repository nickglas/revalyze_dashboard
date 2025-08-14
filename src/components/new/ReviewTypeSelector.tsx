// components/review/ReviewTypeSelector.tsx
import { Select, SelectItem } from "@heroui/react";

interface ReviewTypeSelectorProps {
  reviewType: "sentiment" | "performance" | "both";
  onReviewTypeChange: (type: "sentiment" | "performance" | "both") => void;
  disabled?: boolean;
}

export default function ReviewTypeSelector({
  reviewType,
  onReviewTypeChange,
  disabled = false,
}: ReviewTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <Select
        label="Select review type"
        labelPlacement="outside"
        selectedKeys={[reviewType]}
        onSelectionChange={(val) => {
          if (val.anchorKey) {
            onReviewTypeChange(
              val.anchorKey as "sentiment" | "performance" | "both"
            );
          }
        }}
        size="sm"
        isDisabled={disabled}
      >
        <SelectItem key="sentiment">Sentiment analysis</SelectItem>
        <SelectItem key="performance">Performance analysis</SelectItem>
        <SelectItem key="both">Sentiment & Performance analysis</SelectItem>
      </Select>
    </div>
  );
}
