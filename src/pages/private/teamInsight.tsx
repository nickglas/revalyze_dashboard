import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Button,
  Avatar,
  CardHeader,
  CardFooter,
} from "@heroui/react";
import { useInsightStore } from "@/store/insightStore";
import TeamGroupedCriteriaBarChart from "@/components/charts/teamGroupedCriteriaBarChart";
import TeamCriteriaBarChart from "@/components/charts/teamCriteriaBarChart";
import TeamPerformanceChart from "@/components/charts/teamPerformanceChart";
import ReviewVolumeTeamChart from "@/components/charts/teamReviewVolumeChart";
import TeamSentimentChart from "@/components/charts/teamSentimentChart";

// Sentiment Meter Component
const SentimentMeter = ({
  value,
  size = "md",
}: {
  value: number;
  size?: "sm" | "md" | "lg";
}) => {
  const getColor = (val: number) => {
    console.warn(val);
    if (val >= 8) return "#10B981";
    if (val >= 5) return "#F59E0B";
    return "#EF4444";
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  return (
    <div className="relative">
      <svg
        className={`${sizeClasses[size]} transform -rotate-90`}
        viewBox="0 0 36 36"
      >
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="2"
        />
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke={getColor(value)}
          strokeWidth="2"
          strokeDasharray={`${value * 10}, 100`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-bold ${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"}`}
        >
          {value.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

// Main Component
export default function TeamInsightsPage() {
  const [filterKey, setFilterKey] = useState<"week" | "month" | "year">(
    "month"
  );
  const [teamCriteriaBarChartViewMode, setTeamCriteriaBarChartViewMode] =
    useState<"groupedTeams" | "groupedCriteria">("groupedTeams");

  const {
    dashboardTeamData,
    getDashboardTeamData,
    isloadingdashboardTeamData,
  } = useInsightStore();

  useEffect(() => {
    getDashboardTeamData(filterKey);
  }, [filterKey]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Performance Dashboard</h1>
        <div className="flex gap-4">
          <Select
            defaultSelectedKeys={[filterKey]}
            className="max-w-lg w-[100px]"
            size="sm"
            onSelectionChange={(key) => setFilterKey(key.anchorKey)}
          >
            <SelectItem key={"day"}>Day</SelectItem>
            <SelectItem key={"week"}>Week</SelectItem>
            <SelectItem key={"month"}>Month</SelectItem>
            <SelectItem key={"year"}>Year</SelectItem>
          </Select>
          <Button color="primary" variant="solid" size="sm">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Team Overview */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dashboardTeamData?.map((teamData) => (
            <Card className="bg-[#1e1e1e] hover:bg-[#333333] cursor-pointer">
              <CardBody className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  {/* Top section */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        {teamData.teamName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Some random description that is not provided in the team
                        data yet
                      </p>

                      <div className="flex flex-col gap-2">
                        <div key={`1`} className="flex items-center gap-2">
                          <Avatar size="md" />
                          <span className="text-gray-400">Nick</span>
                        </div>
                      </div>
                    </div>

                    <SentimentMeter
                      value={(teamData.avgOverall + teamData.avgSentiment) / 2}
                      size="md"
                    />
                  </div>
                </div>

                {/* Bottom stats */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center">
                    <p className="text-xl font-bold">
                      {teamData.avgOverall.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">Avg Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">
                      {teamData.avgSentiment.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">Sentiment</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{teamData.reviewCount}</p>
                    <p className="text-xs text-gray-500">Reviews</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="bg-[#1e1e1e]">
            <CardHeader className="pb-0 pt-4 px-4 justify-between">
              <h2 className="text-lg font-semibold">
                Criteria scores per team
              </h2>
              <Select
                className="max-w-[200px]"
                size="sm"
                defaultSelectedKeys={[teamCriteriaBarChartViewMode]}
                onSelectionChange={(k) => {
                  switch (k.anchorKey) {
                    case "groupedCriteria":
                      setTeamCriteriaBarChartViewMode("groupedCriteria");
                      break;
                    case "groupedTeams":
                      setTeamCriteriaBarChartViewMode("groupedTeams");
                      break;
                    default:
                      setTeamCriteriaBarChartViewMode("groupedCriteria");
                      break;
                  }
                }}
              >
                <SelectItem key={"groupedCriteria"}>
                  Grouped by criteria
                </SelectItem>
                <SelectItem key={"groupedTeams"}>Grouped by team</SelectItem>
              </Select>
            </CardHeader>
            <CardBody className="px-2">
              <CardBody className="px-2 overflow-hidden">
                {teamCriteriaBarChartViewMode === "groupedTeams" ? (
                  <TeamGroupedCriteriaBarChart teams={dashboardTeamData} />
                ) : (
                  <TeamCriteriaBarChart teams={dashboardTeamData} />
                )}
              </CardBody>
            </CardBody>
            <CardFooter className="px-4 pb-2 text-xs text-gray-500">
              2025 monthly performance progression
            </CardFooter>
          </Card>

          <Card className="bg-[#1e1e1e]">
            <CardHeader className="pb-0 pt-4 px-4 justify-between">
              <h2 className="text-lg font-semibold">
                Team Performance Over Time
              </h2>
            </CardHeader>
            <CardBody className="px-2 overflow-hidden">
              <TeamPerformanceChart teams={dashboardTeamData || []} />
            </CardBody>
            <CardFooter className="px-4 pb-2 text-xs text-gray-500">
              2025 performance progression
            </CardFooter>
          </Card>

          <Card className="bg-[#1e1e1e]">
            <CardHeader className="pb-0 pt-4 px-4 justify-between">
              <h2 className="text-lg font-semibold">
                Sentiment Performance Over Time
              </h2>
            </CardHeader>
            <CardBody className="px-2 overflow-hidden">
              <TeamSentimentChart teams={dashboardTeamData || []} />
            </CardBody>
            <CardFooter className="px-4 pb-2 text-xs text-gray-500">
              2025 performance progression
            </CardFooter>
          </Card>

          <Card className="bg-[#1e1e1e]">
            <CardHeader className="pb-0 pt-4 px-4 justify-between">
              <h2 className="text-lg font-semibold">Review Volume Over Time</h2>
            </CardHeader>
            <CardBody className="px-2 overflow-hidden">
              <ReviewVolumeTeamChart teams={dashboardTeamData || []} />
            </CardBody>
            <CardFooter className="px-4 pb-2 text-xs text-gray-500">
              2025 performance progression
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
