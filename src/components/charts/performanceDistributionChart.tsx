import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { IEmployeeDashboardData } from "@/models/dto/insights/employee.dashboard.insights.dto";

interface PerformanceDistributionChartProps {
  employees: IEmployeeDashboardData[];
}

export default function PerformanceDistributionChart({
  employees,
}: PerformanceDistributionChartProps) {
  const ranges = [
    { label: "0-2", min: 0, max: 2 },
    { label: "2-4", min: 2, max: 4 },
    { label: "4-6", min: 4, max: 6 },
    { label: "6-8", min: 6, max: 8 },
    { label: "8-10", min: 8, max: 10 },
  ];

  const distribution = ranges.map((range) => {
    const count = employees.filter((employee) => {
      const score = employee.avgOverall || 0;
      return score >= range.min && score < range.max;
    }).length;

    return { range: range.label, count };
  });

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "#1e1e1e",
      foreColor: "#a1a1aa",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        distributed: false,
        barHeight: "80%",
        dataLabels: {
          position: "bottom",
        },
      },
    },
    colors: ["#3B82F6"],
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      style: {
        colors: ["#fff"],
      },
      formatter: function (val: number) {
        return val + " employees";
      },
      offsetX: 0,
      dropShadow: {
        enabled: false,
      },
    },
    xaxis: {
      categories: distribution.map((d) => d.range),
      title: {
        text: "Number of Employees",
        style: {
          color: "#a1a1aa",
        },
      },
      labels: {
        style: {
          colors: "#a1a1aa",
        },
      },
    },
    yaxis: {
      title: {
        text: "Performance Score Range",
        style: {
          color: "#a1a1aa",
        },
      },
      labels: {
        style: {
          colors: "#a1a1aa",
        },
      },
    },
    grid: {
      borderColor: "#27272a",
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: function (val: number) {
          return val + " employees";
        },
      },
    },
  };

  const series = [
    {
      name: "Employees",
      data: distribution.map((d) => d.count),
    },
  ];

  return (
    <div className="w-full h-full">
      <Chart options={options} series={series} type="bar" height="500" />
    </div>
  );
}
