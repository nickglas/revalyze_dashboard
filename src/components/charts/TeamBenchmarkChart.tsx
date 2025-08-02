import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

interface TeamBenchmarkChartProps {
  employeeScore: number;
  teamAverage: number;
}

export default function TeamBenchmarkChart({
  employeeScore,
  teamAverage,
}: TeamBenchmarkChartProps) {
  const options: ApexOptions = {
    chart: {
      type: "radar",
      toolbar: { show: false },
    },
    colors: ["#3B82F6", "#10B981"],
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.1,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: [
        "Product Knowledge",
        "Communication",
        "Problem Solving",
        "Empathy",
        "Efficiency",
      ],
    },
    yaxis: {
      show: false,
      min: 0,
      max: 10,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(1)}/10`,
      },
    },
    legend: {
      position: "bottom",
    },
  };

  const series = [
    {
      name: "Employee",
      data: [
        employeeScore * 0.95,
        employeeScore * 1.05,
        employeeScore * 0.98,
        employeeScore * 0.85,
        employeeScore * 1.1,
      ],
    },
    {
      name: "Team Average",
      data: [
        teamAverage * 0.97,
        teamAverage * 1.03,
        teamAverage * 0.99,
        teamAverage * 0.92,
        teamAverage * 1.05,
      ],
    },
  ];

  return <Chart options={options} series={series} type="radar" height={350} />;
}
