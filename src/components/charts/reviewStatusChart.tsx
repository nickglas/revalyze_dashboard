import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

export default function ReviewStatusChart() {
  const options: ApexOptions = {
    chart: { type: "donut" },
    labels: ["Completed", "In Progress", "Not Started"],
    colors: ["#10b981", "#f59e0b", "#64748b"],
    legend: {
      position: "bottom",
      labels: { colors: "#a1a1aa" },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Reviews",
              color: "#a1a1aa",
              formatter: () => "87",
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} reviews`,
      },
    },
  };

  const series = [42, 23, 22];

  return <Chart options={options} series={series} type="donut" height={350} />;
}
