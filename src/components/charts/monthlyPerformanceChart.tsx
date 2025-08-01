import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

export default function MonthlyPerformanceChart() {
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
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
      labels: { style: { colors: "#a1a1aa" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
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
  };

  const series = [
    {
      name: "Performance",
      data: [7.2, 7.5, 7.8, 8.0, 7.7, 7.9, 8.3, 8.1, 8.6],
    },
    {
      name: "Sentiment",
      data: [6.5, 6.8, 7.2, 7.4, 7.3, 7.6, 7.8, 7.5, 8.0],
    },
  ];

  return <Chart options={options} series={series} type="line" height={350} />;
}
