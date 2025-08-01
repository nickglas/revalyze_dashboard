import React from "react";

interface SentimentMeterProps {
  value: number;
  size?: "sm" | "md" | "lg";
}

const SentimentMeter: React.FC<SentimentMeterProps> = ({
  value,
  size = "md",
}) => {
  const getColor = (val: number) => {
    if (val >= 8) return "#10B981"; // Green
    if (val >= 5) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  return (
    <div className="relative">
      <svg
        className={`${sizeClasses[size]} transform -rotate-90`}
        viewBox="0 0 36 36"
      >
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="2"
        />
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke={getColor(value)}
          strokeWidth="2"
          strokeDasharray={`${value * 10}, 100`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-bold ${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"}`}
        >
          {value.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

export default SentimentMeter;
