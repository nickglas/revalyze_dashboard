import { getTeamColor } from "@/util/colors";
import React from "react";
import Chart from "react-apexcharts";

interface DataPoint {
  date: string;
  avgSentiment: number;
  reviewCount: number;
  teamId: string;
}

interface Team {
  teamId: string;
  teamName: string;
  data: DataPoint[];
}

interface TeamSentimentChartProps {
  teams?: Team[];
}

const TeamSentimentChart: React.FC<TeamSentimentChartProps> = ({
  teams = [],
}) => {
  const series = teams.map((team) => ({
    name: team.teamName,
    data: team.data
      .filter((point) => point.avgSentiment !== null)
      .map((point) => ({
        x: new Date(point.date).getTime(),
        y: point.avgSentiment,
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
      text: "Sentiment Performance Over Time",
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
        text: "Sentiment Score",
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
      x: {
        format: "dd MMM yyyy",
      },
    },
  };

  return (
    <Chart options={options as any} series={series} type="line" height={350} />
  );
};

export default TeamSentimentChart;
