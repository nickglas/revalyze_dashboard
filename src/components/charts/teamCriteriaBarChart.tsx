import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { TeamsDashboardData } from "@/models/dto/insights/teams.dashboard.insights.dto";

interface TeamCriteriaBarChartProps {
  teams: TeamsDashboardData[] | null;
}

export default function TeamCriteriaBarChart({
  teams,
}: TeamCriteriaBarChartProps) {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [options, setOptions] = useState<ApexOptions>({});

  // Criteria keys in the API
  const criteriaKeys: (keyof TeamsDashboardData)[] = [
    "empathie",
    "helderheidEnBegrijpelijkheid",
    "klanttevredenheid",
    "oplossingsgerichtheid",
    "professionaliteit",
    "responsiviteitLuistervaardigheid",
    "tijdsefficientieDoelgerichtheid",
    "avgSentiment",
  ];

  // Labels to display on the x-axis
  const criteriaLabels = [
    "Empathie",
    "Helderheid & Begrijpelijkheid",
    "Klanttevredenheid",
    "Oplossingsgerichtheid",
    "Professionaliteit",
    "Responsiviteit & Luistervaardigheid",
    "Tijdsefficiëntie & Doelgerichtheid",
    "Sentiment Klant",
  ];

  useEffect(() => {
    if (!teams || teams.length === 0) return;

    // Build the series: one per team
    const newSeries = teams.map((team) => ({
      name: team.team.name,
      data: criteriaKeys.map((key) => {
        const value = team[key];
        return typeof value === "number" ? Number(value.toFixed(2)) : 0;
      }),
    }));

    setSeries(newSeries);

    setOptions({
      chart: {
        type: "bar",
        toolbar: { show: false },
        animations: { enabled: true, speed: 800 },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "65%",
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toFixed(1),
        style: {
          colors: ["#fff"],
        },
      },
      xaxis: {
        categories: criteriaLabels,
        labels: {
          style: { colors: "#a1a1aa", fontSize: "10px" },
          rotate: -30,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: 10,
        labels: {
          style: { colors: "#a1a1aa" },
          formatter: (val: number) => `${val.toFixed(1)}`,
        },
        title: {
          text: "Score (out of 10)",
          style: { color: "#a1a1aa" },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val.toFixed(1)}/10`,
        },
      },
      legend: {
        position: "top",
        labels: {
          colors: "#a1a1aa",
        },
      },
      grid: {
        borderColor: "#27272a",
      },
      colors: [
        "#3B82F6", // Blue
        "#10B981", // Green
        "#F59E0B", // Yellow
        "#EF4444", // Red
        "#8B5CF6", // Purple
        "#06B6D4", // Cyan (for more teams)
        "#E879F9", // Pink
      ],
    });
  }, [teams]);

  if (!teams || teams.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="mt-3 text-gray-500">No team criteria data available</p>
        </div>
      </div>
    );
  }

  return <Chart options={options} series={series} type="bar" height={400} />;
}
