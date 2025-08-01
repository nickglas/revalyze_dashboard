import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

export default function RoleSentimentChart() {
  const options: ApexOptions = {
    chart: {
      type: "boxPlot",
      toolbar: { show: false },
    },
    plotOptions: {
      boxPlot: {
        colors: {
          upper: "#3b82f6",
          lower: "#10b981",
        },
      },
    },
    xaxis: {
      categories: [
        "Sales",
        "Support",
        "Account Mgmt",
        "Implementation",
        "Success",
      ],
      labels: { style: { colors: "#a1a1aa" } },
    },
    yaxis: {
      min: 0,
      max: 10,
      labels: { style: { colors: "#a1a1aa" } },
      title: { text: "Sentiment Score", style: { color: "#a1a1aa" } },
    },
    tooltip: {
      shared: false,
      intersect: true,
      y: {
        formatter: (val: number) => `${val.toFixed(1)}/10`,
      },
    },
    grid: {
      borderColor: "#27272a",
      padding: { bottom: 20 },
    },
  };

  const series = [
    {
      name: "Sentiment Distribution",
      type: "boxPlot",
      data: [
        {
          x: "Sales",
          y: [5.2, 6.3, 7.1, 7.9, 8.5],
        },
        {
          x: "Support",
          y: [4.8, 6.1, 6.9, 7.8, 8.3],
        },
        {
          x: "Account Mgmt",
          y: [6.5, 7.2, 7.8, 8.4, 9.0],
        },
        {
          x: "Implementation",
          y: [5.9, 6.8, 7.5, 8.1, 8.7],
        },
        {
          x: "Success",
          y: [6.8, 7.5, 8.2, 8.8, 9.3],
        },
      ],
    },
  ];

  return (
    <Chart options={options} series={series} type="boxPlot" height={350} />
  );
}
