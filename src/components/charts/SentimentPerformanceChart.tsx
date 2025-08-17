import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function SentimentPerformanceChart() {
  const options: ApexOptions = {
    legend: {
      show: false,
    },
    chart: {
      id: "sentiment-performance",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        speed: 1500, // slower
        animateGradually: {
          enabled: true,
          delay: 300,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 1000,
        },
      },
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#3b82f6", "#10b981"],
    xaxis: {
      title: { text: undefined },
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
      labels: {
        style: {
          colors: "#a1a1aa",
        },
        offsetY: 6, // extra space below x-axis labels
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      title: { text: undefined },
      min: 0,
      max: 100,
      labels: {
        formatter: (val: number) => `${val}%`,

        style: {
          colors: "#a1a1aa",
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    grid: {
      padding: {
        bottom: 20, // spacing around the chart
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: { show: false },
      },
    },
  };

  const series = [
    {
      name: "Employee Score",
      data: [72, 75, 78, 80, 77, 79, 83, 55, 66, 88, 68, 90],
    },
    {
      name: "Company Sentiment",
      data: [65, 68, 72, 74, 73, 76, 78, 40, 50, 75, 70, 85],
    },
  ];

  return <Chart options={options} series={series} type="line" height={350} />;
}
