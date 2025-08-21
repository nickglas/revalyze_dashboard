// src/components/charts/CriteriaBarChart.tsx
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { CriterionSummaryDTO } from "@/models/dto/insights/criterion.summary.dto";

interface CriteriaBarChartProps {
  criteriaSummary: CriterionSummaryDTO[] | null;
  filter: string;
}

export default function CriteriaBarChart({
  criteriaSummary,
  filter,
}: CriteriaBarChartProps) {
  const [series, setSeries] = useState<{ data: number[] }[]>([]);
  const [options, setOptions] = useState<ApexOptions>({});

  useEffect(() => {
    if (!criteriaSummary || criteriaSummary.length === 0) return;

    const categories = criteriaSummary.map((c) => c.criterionName);
    const scores = criteriaSummary.map((c) => c.avgScore);

    // Calculate change percentage based on trend data
    const changePercentages = criteriaSummary.map((c) => {
      if (c.trend && c.trend.length > 1) {
        const firstValue = c.trend[0].score;
        const lastValue = c.trend[c.trend.length - 1].score;
        return ((lastValue - firstValue) / firstValue) * 100;
      }
      return 0;
    });

    const colors = changePercentages.map(
      (change) =>
        change > 0
          ? "#10B981" // Green for positive change
          : change < 0
            ? "#EF4444" // Red for negative change
            : "#6B7280" // Gray for no change
    );

    setSeries([{ data: scores }]);

    setOptions({
      legend: {
        show: false,
      },
      chart: {
        toolbar: { show: false },
        animations: { enabled: true, speed: 800 },
        type: "bar",
      },
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 4,
          horizontal: false,
          columnWidth: "70%",
        },
      },
      xaxis: {
        categories,
        labels: {
          style: { colors: "#a1a1aa", fontSize: "10px" },
          rotate: -45,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: 10,
        labels: {
          style: { colors: "#a1a1aa" },
          formatter: (val: number) => `${val.toFixed(1)}`,
        },
        title: {
          text: "Score (out of 10)",
          style: { color: "#a1a1aa" },
        },
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const criterion = w.globals.labels[dataPointIndex];
          const score = series[seriesIndex][dataPointIndex];
          const change = changePercentages[dataPointIndex];
          const isPositive = change > 0;
          const reviewCount = criteriaSummary[dataPointIndex].reviewCount;

          return `
            <div class="bg-gray-900 p-2 rounded-lg shadow-lg">
              <div class="text-sm font-bold">${criterion}</div>
              <div class="text-sm">Score: ${score.toFixed(1)}/10</div>
              <div class="text-sm">Based on ${reviewCount} reviews</div>
              <div class="text-tiny ${isPositive ? "text-green-500" : change < 0 ? "text-red-500" : "text-gray-500"}">
                ${change !== 0 ? `Change: ${isPositive ? "+" : ""}${change.toFixed(1)}% compared to last ${filter}` : "No change data available"}
              </div>
            </div>
          `;
        },
      },
      colors,
      grid: {
        borderColor: "#27272a",
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toFixed(1),
        style: {
          colors: ["#fff"],
        },
      },
    });
  }, [criteriaSummary, filter]);

  if (!criteriaSummary || criteriaSummary.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="mt-3 text-gray-500">No criteria data available</p>
        </div>
      </div>
    );
  }

  return <Chart options={options} series={series} type="bar" height={350} />;
}
