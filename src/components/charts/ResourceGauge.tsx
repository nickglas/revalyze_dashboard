import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface DashboardMetric {
  current: number;
  allowed: number;
}

interface IResourceGauceProps {
  title: string;
  metric: DashboardMetric | number;
  type: "count" | "score";
}

export const ResourceGauce: React.FC<IResourceGauceProps> = ({
  title,
  metric,
  type,
}) => {
  const isScore = type === "score";
  const value = isScore
    ? (metric as number)
    : (metric as DashboardMetric).current;
  const total = isScore ? 10 : (metric as DashboardMetric).allowed;
  const percentage = Math.round((value / total) * 100);

  // Pick solid color based on thresholds
  let gaugeColor = "#22c55e"; // default green

  if (!isScore) {
    // count type (Users, Transcripts, Reviews)
    if (percentage < 33)
      gaugeColor = "#22c55e"; // green
    else if (percentage < 66)
      gaugeColor = "#eab308"; // yellow
    else gaugeColor = "#ef4444"; // red
  } else {
    // score type (Performance, Sentiment)
    if (value < 5)
      gaugeColor = "#ef4444"; // red
    else if (value <= 7)
      gaugeColor = "#eab308"; // yellow
    else gaugeColor = "#22c55e"; // green
  }

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      height: 200,
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        track: {
          background: "#27272a",
          startAngle: -135,
          endAngle: 135,
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "16px",
            fontWeight: 600,
            color: "#a1a1aa",
            offsetY: 70,
          },
          value: {
            offsetY: 0,
            fontSize: "28px",
            fontWeight: 700,
            color: "#fff",
            formatter: function () {
              return isScore ? `${value.toFixed(1)}/10` : `${percentage}%`;
            },
          },
        },
      },
    },
    fill: {
      colors: [gaugeColor], // solid color only
    },
    stroke: {
      dashArray: 4,
    },
    colors: [gaugeColor],
    labels: [title],
  };

  const series = [percentage];

  return (
    <Chart options={options} series={series} type="radialBar" height={200} />
  );
};
