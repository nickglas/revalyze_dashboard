import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

export default function ScoreDistributionChart() {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        borderRadius: 4,
        barHeight: "80%",
      },
    },
    colors: ["#EF4444", "#F59E0B", "#FBBF24", "#10B981", "#3B82F6"],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + " employees";
      },
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
    },
    xaxis: {
      categories: ["0-2", "2-4", "4-6", "6-8", "8-10"],
      title: { text: "Number of Employees" },
    },
    yaxis: {
      title: { text: "Performance Score Range" },
    },
    grid: {
      borderColor: "#27272a",
      padding: { bottom: 20 },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " employees";
        },
      },
    },
  };

  const series = [
    {
      name: "Employees",
      data: [2, 5, 12, 18, 8],
    },
  ];

  return <Chart options={options} series={series} type="bar" height={350} />;
}
