import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

interface ScoreTrendChartProps {
  range: "month" | "quarter" | "year";
}

export default function ScoreTrendChart({ range }: ScoreTrendChartProps) {
  const getData = () => {
    if (range === "month") {
      return {
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
          "Oct",
          "Nov",
          "Dec",
        ],
        employee: [7.2, 7.5, 7.8, 8.0, 7.7, 7.9, 8.3, 8.1, 8.6, 8.4, 8.7, 8.9],
        team: [6.8, 6.9, 7.1, 7.3, 7.2, 7.4, 7.6, 7.5, 7.8, 7.7, 7.9, 8.1],
      };
    } else if (range === "quarter") {
      return {
        categories: [
          "Q1 2024",
          "Q2 2024",
          "Q3 2024",
          "Q4 2024",
          "Q1 2025",
          "Q2 2025",
          "Q3 2025",
        ],
        employee: [7.2, 7.8, 8.1, 8.3, 8.0, 8.2, 8.5],
        team: [6.8, 7.1, 7.3, 7.5, 7.4, 7.6, 7.8],
      };
    } else {
      return {
        categories: ["2020", "2021", "2022", "2023", "2024", "2025"],
        employee: [6.5, 7.0, 7.3, 7.8, 8.1, 8.4],
        team: [6.2, 6.5, 6.8, 7.1, 7.4, 7.6],
      };
    }
  };

  const data = getData();

  const options: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    colors: ["#3B82F6", "#10B981"],
    xaxis: {
      categories: data.categories,
    },
    yaxis: {
      min: 5,
      max: 10,
      title: { text: "Performance Score" },
    },
    markers: {
      size: 5,
    },
    grid: {
      borderColor: "#27272a",
      padding: { bottom: 20 },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(1)}/10`,
      },
    },
    legend: {
      position: "top",
    },
  };

  const series = [
    {
      name: "Selected Employee",
      data: data.employee,
    },
    {
      name: "Team Average",
      data: data.team,
    },
  ];

  return <Chart options={options} series={series} type="line" height={350} />;
}
