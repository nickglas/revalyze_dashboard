import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface SentimentDistributionChartProps {
  data: {
    negative: number;
    neutral: number;
    positive: number;
    negativePercentage: number;
    neutralPercentage: number;
    positivePercentage: number;
    total: number;
  } | null;
}

export default function SentimentDistributionChart({
  data,
}: SentimentDistributionChartProps) {
  const [options, setOptions] = useState<ApexOptions>({});
  const [series, setSeries] = useState<number[]>([]);

  useEffect(() => {
    if (!data || data.total === 0) return;

    setSeries([data.negative, data.neutral, data.positive]);

    setOptions({
      chart: {
        type: "donut",
        toolbar: { show: false },
      },
      labels: [
        `Negative (${data.negativePercentage.toFixed(1)}%)`,
        `Neutral (${data.neutralPercentage.toFixed(1)}%)`,
        `Positive (${data.positivePercentage.toFixed(1)}%)`,
      ],
      colors: ["#EF4444", "#F59E0B", "#10B981"],
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
        dropShadow: {
          enabled: false,
        },
      },
      legend: {
        position: "bottom",
        labels: {
          colors: "#a1a1aa",
        },
      },
      tooltip: {
        custom: function ({ seriesIndex }) {
          const labels = ["Negative", "Neutral", "Positive"];
          const counts = [data.negative, data.neutral, data.positive];

          return `
            <div class="bg-gray-900 p-2 rounded-lg shadow-lg border border-gray-700">
              <div class="text-sm font-bold">${labels[seriesIndex]}</div>
              <div class="flex items-center mt-1">
                <span class="font-medium">Reviews:</span>
                <span class="ml-1">${counts[seriesIndex]} (${series[seriesIndex].toFixed(1)}%)</span>
              </div>
              <div class="text-tiny text-gray-400 mt-1">
                Total reviews: ${data.total}
              </div>
            </div>
          `;
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total",
                color: "#a1a1aa",
                formatter: () => data.total.toString(),
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    });
  }, [data]);

  if (!data || data.total === 0) {
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
          <p className="mt-3 text-gray-500">No sentiment data available</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Chart options={options} series={series} type="donut" height={350} />
    </div>
  );
}
