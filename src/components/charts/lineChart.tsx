import React from "react";
import Chart from "react-apexcharts";

export default function LineChart() {
  const options = {
    chart: {
      id: "line-chart",
    },
    stroke: {
      curve: "smooth" as "smooth", // <-- Makes the lines smooth
    },
    theme: {
      monochrome: {
        enabled: true,
        color: "#255aee",
        shadeTo: "light" as "light",
        shadeIntensity: 0.65,
      },
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997],
    },
  };

  const series = [
    {
      name: "Sales",
      data: [30, 40, 35, 50, 49, 60, 70],
    },
  ];

  return (
    <div className="line-chart">
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
}
