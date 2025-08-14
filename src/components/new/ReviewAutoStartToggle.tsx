import { Radio, RadioGroup } from "@heroui/react";

interface ReviewAutoStartToggle {
  autoStart: boolean;
  onAutoStartChange: (autoStart: boolean) => void;
}

export default function ReviewAutoStartToggle({
  autoStart,
  onAutoStartChange,
}: ReviewAutoStartToggle) {
  return (
    <RadioGroup
      label="Enable/disable review process"
      orientation="horizontal"
      value={autoStart ? "start" : "skip"}
      size="sm"
      onValueChange={(val) => onAutoStartChange(val === "start")}
    >
      <Radio value="start">Start review</Radio>
      <Radio value="skip">Skip review</Radio>
    </RadioGroup>
  );
}
