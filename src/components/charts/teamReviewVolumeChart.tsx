import { getTeamColor } from "@/util/colors";
import React from "react";
import Chart from "react-apexcharts";

interface DataPoint {
  date: string;
  avgOverall: number;
  avgSentiment: number;
  reviewCount: number;
  teamId: string;
}

interface Team {
  teamId: string;
  teamName: string;
  data: DataPoint[];
}

interface ReviewVolumeTeamChartProps {
  teams?: Team[];
}

const ReviewVolumeTeamChart: React.FC<ReviewVolumeTeamChartProps> = ({
  teams = [],
}) => {
  // Prepare series data
  const series = teams.map((team) => ({
    name: team.teamName,
    data: team.data.map((point) => ({
      x: new Date(point.date).getTime(),
      y: point.reviewCount,
    })),
    color: getTeamColor(team.teamId, teams),
  }));

  const options = {
    chart: {
      type: "line",
      height: 350,
      zoom: {
        enabled: false,
      },
      background: "#1e1e1e",
      foreColor: "#fff",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    title: {
      text: "Review Volume Over Time",
      align: "left",
      style: {
        color: "#fff",
      },
    },
    grid: {
      borderColor: "#555",
      row: {
        colors: ["#1e1e1e", "transparent"],
        opacity: 0.5,
      },
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#fff",
        },
      },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: "#fff",
        },
        formatter: (val: number) => Math.round(val),
      },
      title: {
        text: "Number of Reviews",
        style: {
          color: "#fff",
        },
      },
      forceNiceScale: true,
    },
    legend: {
      labels: {
        colors: "#fff",
      },
    },
    tooltip: {
      theme: "dark",
      shared: true,
      intersect: false,
      x: {
        format: "dd MMM yyyy",
      },
    },
  };

  return (
    <Chart options={options as any} series={series} type="line" height={350} />
  );
};

export default ReviewVolumeTeamChart;
