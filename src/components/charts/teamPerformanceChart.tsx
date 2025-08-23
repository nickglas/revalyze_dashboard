import { getTeamColor } from "@/util/colors";
import React from "react";
import Chart from "react-apexcharts";

interface DataPoint {
  date: string;
  avgOverall: number;
  reviewCount: number;
  teamId: string;
}

interface Team {
  teamId: string;
  teamName: string;
  data: DataPoint[];
}

interface TeamPerformanceChartProps {
  teams?: Team[];
}

const TeamPerformanceChart: React.FC<TeamPerformanceChartProps> = ({
  teams = [],
}) => {
  // Prepare series data
  const series = teams.map((team) => ({
    name: team.teamName,
    data: team.data
      .filter((point) => point.avgOverall !== null)
      .map((point) => {
        const date = new Date(point.date);
        const normalized = new Date(
          Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
        );
        return {
          x: normalized.getTime(),
          y: point.avgOverall,
        };
      }),
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
      text: "Team Performance Over Time",
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
      max: 10,
      labels: {
        style: {
          colors: "#fff",
        },
      },
      title: {
        text: "Average Score",
        style: {
          color: "#fff",
        },
      },
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

export default TeamPerformanceChart;
