import { useEffect, useRef } from "react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { format } from "date-fns";
import { useInsightStore } from "@/store/insightStore";
import { Button } from "@nextui-org/react";

interface MonthlyPerformanceChartProps {
  filter: "day" | "week" | "month" | "year";
}

export default function MonthlyPerformanceChart({
  filter,
}: MonthlyPerformanceChartProps) {
  const dailyTrendMetrics = useInsightStore((s) => s.dailyTrendMetrics);
  const isLoading = useInsightStore((s) => s.isLoadingTrends);
  const prevFilterRef = useRef<string | null>(null);

  // Get the store instance instead of the function
  const store = useInsightStore();

  useEffect(() => {
    if (filter !== prevFilterRef.current) {
      store.getDailyTrendMetrics(filter);
      prevFilterRef.current = filter;
    }
  }, [filter, store]);

  // Function to format X-axis labels based on filter
  const formatDateLabel = (date: Date) => {
    try {
      switch (filter) {
        case "day":
          return format(date, "HH:mm");
        case "week":
          return format(date, "EEE");
        case "month":
          return format(date, "MMM dd");
        case "year":
          return format(date, "MMM yyyy");
        default:
          return format(date, "MMM dd");
      }
    } catch (e) {
      console.error("Date formatting error", e);
      return "";
    }
  };

  // Prepare chart data based on store data
  let series: { name: string; data: number[] }[] = [];
  let categories: string[] = [];

  if (dailyTrendMetrics && dailyTrendMetrics.data.length > 0) {
    // Sort metrics by date ascending
    const sortedMetrics = [...dailyTrendMetrics.data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    series = [
      {
        name: "Performance",
        data: sortedMetrics.map((metric) => metric.avgOverall),
      },
      {
        name: "Sentiment",
        data: sortedMetrics.map((metric) => metric.avgSentiment),
      },
    ];

    // Update your categories generation:
    categories = sortedMetrics
      .map((metric) => {
        try {
          return formatDateLabel(new Date(metric.date));
        } catch (e) {
          console.error("Invalid date", metric.date);
          return "";
        }
      })
      .filter(Boolean);
  }

  const options: ApexOptions = {
    chart: {
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
      dashArray: [0, 5],
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "#a1a1aa" },
        formatter: (value) => {
          if (!value) return "";
          if (filter === "year") {
            return value.slice(0, 3);
          }
          return value;
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tickAmount: filter === "year" ? 12 : undefined,
    },
    yaxis: {
      min: 0,
      max: 10,
      labels: { style: { colors: "#a1a1aa" } },
    },
    colors: ["#3b82f6", "#10b981"],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => `${val.toFixed(1)}/10`,
      },
    },
    grid: {
      borderColor: "#27272a",
      padding: { bottom: 20 },
    },
    markers: {
      size: 5,
      hover: { size: 8 },
    },
    noData: {
      text: "No data available",
      align: "center",
      verticalAlign: "middle",
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-500">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (!dailyTrendMetrics || dailyTrendMetrics.data.length === 0) {
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
          <p className="mt-3 text-gray-500">No performance data available</p>
          <Button
            className="mt-2 px-4 py-2"
            color="primary"
            onPress={() => store.getDailyTrendMetrics(filter)}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return <Chart options={options} series={series} type="line" height={350} />;
}
