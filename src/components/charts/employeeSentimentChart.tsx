import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router-dom";

// 1. Add employees with IDs
const employees = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Sales Executive",
    performance: 8.2,
    sentiment: 7.5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Support Specialist",
    performance: 6.8,
    sentiment: 5.2,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Account Manager",
    performance: 9.1,
    sentiment: 8.7,
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Implementation Lead",
    performance: 7.5,
    sentiment: 6.9,
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "Customer Success",
    performance: 8.9,
    sentiment: 8.3,
  },
  {
    id: 6,
    name: "Alex Thompson",
    role: "Technical Support",
    performance: 5.4,
    sentiment: 4.8,
  },
  {
    id: 7,
    name: "Jamie Smith",
    role: "Sales Manager",
    performance: 9.3,
    sentiment: 8.9,
  },
  {
    id: 8,
    name: "Taylor Kim",
    role: "Customer Onboarding",
    performance: 7.8,
    sentiment: 7.1,
  },
  {
    id: 9,
    name: "Jordan Lee",
    role: "Account Executive",
    performance: 8.5,
    sentiment: 7.8,
  },
  {
    id: 10,
    name: "Morgan Davis",
    role: "Support Lead",
    performance: 6.2,
    sentiment: 5.5,
  },
  {
    id: 11,
    name: "Liam Parker",
    role: "Sales Lead",
    performance: 8.0,
    sentiment: 9.0,
  },
  {
    id: 12,
    name: "Ava Martinez",
    role: "CS Manager",
    performance: 9.2,
    sentiment: 8.5,
  },
  { id: 13, name: "Noah Smith", role: "BDR", performance: 8.5, sentiment: 6.2 },
  {
    id: 14,
    name: "Isabella Green",
    role: "Sales Dev",
    performance: 7.6,
    sentiment: 5.9,
  },
  {
    id: 15,
    name: "Ethan Brown",
    role: "Support Trainee",
    performance: 6.3,
    sentiment: 8.0,
  },
  {
    id: 16,
    name: "Mia Clark",
    role: "Junior AM",
    performance: 5.5,
    sentiment: 7.6,
  },
  {
    id: 17,
    name: "Lucas White",
    role: "Tech Support",
    performance: 4.5,
    sentiment: 4.9,
  },
  {
    id: 18,
    name: "Sophia Hall",
    role: "Trainee",
    performance: 5.0,
    sentiment: 3.8,
  },
];

// 2. Categorize points
type EmployeePoint = { x: number; y: number; name: string; id: number };

const categorizedData: Record<string, EmployeePoint[]> = {
  "High Performer, Positive Sentiment": [],
  "High Performer, Needs Support": [],
  "Developing, Positive Attitude": [],
  "Needs Improvement": [],
};

employees.forEach(({ id, name, performance, sentiment }) => {
  const point = { x: performance, y: sentiment, name, id };
  if (performance >= 7.5 && sentiment >= 7.5) {
    categorizedData["High Performer, Positive Sentiment"].push(point);
  } else if (performance >= 7.5 && sentiment < 7.5) {
    categorizedData["High Performer, Needs Support"].push(point);
  } else if (performance < 7.5 && sentiment >= 7.5) {
    categorizedData["Developing, Positive Attitude"].push(point);
  } else {
    categorizedData["Needs Improvement"].push(point);
  }
});

const chartSeries = Object.entries(categorizedData).map(([name, data]) => ({
  name,
  data,
}));

export default function EmployeeScatterPlot() {
  const navigate = useNavigate();

  const options: ApexOptions = {
    chart: {
      type: "scatter",
      zoom: {
        enabled: true,
        type: "xy",
      },
      events: {
        dataPointSelection: function (
          event,
          chartContext,
          { seriesIndex, dataPointIndex }
        ) {
          try {
            const point = chartSeries[seriesIndex].data[dataPointIndex];
            if (point && point.id) {
              navigate(`/users`);
            }
          } catch (error) {
            console.error("Failed to get data point:", error);
          }
        },
      },
    },
    xaxis: {
      title: { text: "Performance score" },
      min: 0,
      max: 10,
    },
    yaxis: {
      title: { text: "Sentiment score" },
      min: 0,
      max: 10,
    },
    legend: { position: "bottom" },
    tooltip: {
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const point = chartSeries[seriesIndex].data[dataPointIndex];
        return `<div style="padding: 8px;">
          <strong>${point.name}</strong><br/>
          Performance: ${point.x}<br/>
          Sentiment: ${point.y}
        </div>`;
      },
    },
    markers: { size: 5 },
  };

  return (
    <Chart options={options} series={chartSeries} type="scatter" height={400} />
  );
}
