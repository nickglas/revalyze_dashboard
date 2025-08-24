// components/EmployeeScatterPlot.tsx
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { IEmployeeDashboardData } from "@/models/dto/insights/employee.dashboard.insights.dto";

interface EmployeeScatterPlotProps {
  employees: IEmployeeDashboardData[];
}

export default function EmployeeScatterPlot({
  employees,
}: EmployeeScatterPlotProps) {
  const categorizedData = {
    "High Performer, Positive Sentiment": [] as {
      x: number;
      y: number;
      name: string;
      id: string;
    }[],
    "High Performer, Needs Support": [] as {
      x: number;
      y: number;
      name: string;
      id: string;
    }[],
    "Developing, Positive Attitude": [] as {
      x: number;
      y: number;
      name: string;
      id: string;
    }[],
    "Needs Improvement": [] as {
      x: number;
      y: number;
      name: string;
      id: string;
    }[],
  };

  employees.forEach((employee) => {
    const performance = employee.avgOverall || 0;
    const sentiment = employee.avgSentiment || 0;
    const point = {
      x: performance,
      y: sentiment,
      name: employee.employee?.name || "Unknown",
      id: employee._id,
    };

    if (performance >= 7.5 && sentiment >= 7.5) {
      categorizedData["High Performer, Positive Sentiment"].push(point);
    } else if (performance >= 7.5 && sentiment < 7.5) {
      categorizedData["High Performer, Needs Support"].push(point);
    } else if (performance < 7.5 && sentiment >= 7.5) {
      categorizedData["Developing, Positive Attitude"].push(point);
    } else {
      categorizedData["Needs Improvement"].push(point);
    }
  });

  const series = Object.entries(categorizedData).map(([name, data]) => ({
    name,
    data,
  }));

  const options: ApexOptions = {
    chart: {
      type: "scatter",
      zoom: {
        enabled: true,
        type: "xy",
      },
      background: "#1e1e1e",
      foreColor: "#a1a1aa",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: true,
        },
      },
    },
    colors: ["#10B981", "#F59E0B", "#3B82F6", "#EF4444"],
    xaxis: {
      title: {
        text: "Performance Score",
        style: {
          color: "#a1a1aa",
        },
      },
      min: 0,
      max: 10,
      tickAmount: 10,
      labels: {
        style: {
          colors: "#a1a1aa",
        },
      },
    },
    yaxis: {
      title: {
        text: "Sentiment Score",
        style: {
          color: "#a1a1aa",
        },
      },
      min: 0,
      max: 10,
      stepSize: 1,
      decimalsInFloat: 0.1,
      labels: {
        style: {
          colors: "#a1a1aa",
        },
      },
    },
    legend: {
      position: "bottom",
      labels: {
        colors: "#a1a1aa",
      },
    },
    grid: {
      borderColor: "#27272a",
    },
    tooltip: {
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const point = series[seriesIndex].data[dataPointIndex];
        return `
          <div class="apexcharts-tooltip-title">${point.name}</div>
          <div class="apexcharts-tooltip-series-group">
            <div class="apexcharts-tooltip-text">
              <div class="apexcharts-tooltip-y-group">
                <span class="apexcharts-tooltip-text-label">Performance: </span>
                <span class="apexcharts-tooltip-text-value">${point.x.toFixed(1)}</span>
              </div>
              <div class="apexcharts-tooltip-y-group">
                <span class="apexcharts-tooltip-text-label">Sentiment: </span>
                <span class="apexcharts-tooltip-text-value">${point.y.toFixed(1)}</span>
              </div>
            </div>
          </div>
        `;
      },
    },
    markers: {
      size: 4,
      strokeWidth: 0,
      hover: {
        size: 10,
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Chart options={options} series={series} type="scatter" height="500" />
    </div>
  );
}
