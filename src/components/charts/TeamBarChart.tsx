import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { TeamsDashboardData } from "@/models/dto/insights/teams.dashboard.insights.dto";

interface TeamsBarChartProps {
  teamData: TeamsDashboardData[] | null;
}

export default function TeamsBarChart({ teamData }: TeamsBarChartProps) {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [options, setOptions] = useState<ApexOptions>({});

  useEffect(() => {
    if (!teamData || teamData.length === 0) return;

    const categories = teamData.map((t) => t.teamName);
    const performanceData = teamData.map((t) => t.avgOverall);
    const sentimentData = teamData.map((t) => t.avgSentiment);
    const reviewCounts = teamData.map((t) => t.reviewCount);

    setSeries([
      {
        name: "Performance",
        data: performanceData,
      },
      {
        name: "Sentiment",
        data: sentimentData,
      },
    ]);

    setOptions({
      chart: {
        type: "bar",
        height: 350,
        toolbar: { show: false },
        animations: { enabled: true, speed: 800 },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "80%",
          borderRadius: 4,
          dataLabels: {
            position: "top",
          },
        },
      },
      colors: ["#3B82F6", "#10B981"],
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
        formatter: (val: number) => val.toFixed(1),
        background: {
          enabled: false,
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const team = w.globals.labels[dataPointIndex];
          const value = series[seriesIndex][dataPointIndex];
          const metric = seriesIndex === 0 ? "Performance" : "Sentiment";
          const reviews = reviewCounts[dataPointIndex];

          return `
            <div class="bg-gray-900 p-2 rounded-lg shadow-lg border border-gray-700">
              <div class="text-sm font-bold">${team}</div>
              <div class="flex items-center mt-1">
                <div class="w-3 h-3 rounded-full mr-2" style="background:${w.globals.colors[seriesIndex]}"></div>
                <span class="font-medium">${metric}:</span>
                <span class="ml-1">${value.toFixed(1)}/10</span>
              </div>
              <div class="text-tiny text-gray-400 mt-1">
                Based on ${reviews} ${reviews === 1 ? "review" : "reviews"}
              </div>
            </div>
          `;
        },
      },
      xaxis: {
        categories,
        min: 0,
        max: 10,

        title: {
          text: "Score (out of 10)",
          style: { color: "#a1a1aa" },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: "#a1a1aa" },
        },
      },
      grid: {
        borderColor: "#27272a",
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: {
          colors: "#a1a1aa",
        },
        markers: {
          size: 12,
        },
      },
    });
  }, [teamData]);

  if (!teamData || teamData.length === 0) {
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
          <p className="mt-3 text-gray-500">No team data available</p>
        </div>
      </div>
    );
  }

  return <Chart options={options} series={series} type="bar" height={350} />;
}
