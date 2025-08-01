import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

export default function CriteriaChart() {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: "70%",
        distributed: false,
        dataLabels: { position: "bottom" },
      },
    },
    xaxis: {
      categories: [
        "Product Knowledge",
        "Communication",
        "Problem Solving",
        "Empathy",
        "Efficiency",
      ],
      labels: { style: { colors: "#a1a1aa" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      max: 10,
      labels: { style: { colors: "#a1a1aa" } },
    },
    colors: ["#3b82f6", "#60a5fa", "#93c5fd"],
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(1)}/10`,
      },
    },
    grid: {
      borderColor: "#27272a",
      padding: { bottom: 20 },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      style: { colors: ["#fff"] },
      offsetX: -10,
      formatter: function (val: any, opt: any) {
        return val;
      },
    },
  };

  const series = [
    {
      name: "Score",
      data: [8.7, 7.9, 8.2, 7.5, 8.4],
    },
  ];

  return <Chart options={options} series={series} type="bar" height={350} />;
}
