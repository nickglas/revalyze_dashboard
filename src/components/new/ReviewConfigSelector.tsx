// components/review/ReviewConfigSelector.tsx
import SearchConfigs from "@/components/data/reviewConfigs/searchConfigs";
import { ReviewConfig } from "@/models/api/review.config.api.model";

interface ReviewConfigSelectorProps {
  value?: ReviewConfig;
  reviewType: "sentiment" | "performance" | "both";
  onChange: (config: ReviewConfig | undefined) => void;
  error?: string;
  disabled: boolean;
}

export default function ReviewConfigSelector({
  value,
  reviewType,
  onChange,
  error,
  disabled,
}: ReviewConfigSelectorProps) {
  return (
    <div>
      <SearchConfigs
        required={reviewType === "performance" || reviewType === "both"}
        isDisabled={disabled}
        label="Set config"
        size="sm"
        onChange={onChange}
        value={value}
      />
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
}
