import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export interface IResourceGauceProps {
  title: string;
  value: number;
  total: number;
  color: string;
}

export const ResourceGauce: React.FC<IResourceGauceProps> = ({
  title,
  value,
  total,
  color,
}) => {
  const percentage = Math.round((value / total) * 100);

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      height: 200,
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        track: {
          background: "#27272a",
          startAngle: -135,
          endAngle: 135,
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "16px",
            fontWeight: 600,
            color: "#a1a1aa",
            offsetY: 60,
          },
          value: {
            offsetY: 0,
            fontSize: "28px",
            fontWeight: 700,
            color: "#fff",
            formatter: function (val) {
              return `${val}%`;
            },
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
        colorStops: [
          {
            offset: 0,
            color: color,
            opacity: 1,
          },
          {
            offset: 100,
            color: color,
            opacity: 0.6,
          },
        ],
      },
    },
    stroke: {
      dashArray: 4,
    },
    colors: [color],
    labels: [title],
  };

  const series = [percentage];

  return (
    <div className="flex flex-col items-center">
      <Chart options={options} series={series} type="radialBar" height={200} />
      <div className="text-center mt-2">
        <p className="text-lg font-semibold">
          {value} <span className="text-gray-500">of</span> {total}
        </p>
        <p className="text-sm text-gray-500 mt-1">Utilized</p>
      </div>
    </div>
  );
};
