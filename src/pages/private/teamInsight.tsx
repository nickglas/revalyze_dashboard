// src/pages/insights/teams/index.tsx
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Skeleton,
  Select,
  SelectItem,
  Button,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Badge,
} from "@heroui/react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

// Mock data structure
interface Team {
  id: string;
  name: string;
  manager: string;
  memberCount: number;
  avgPerformance: number;
  avgSentiment: number;
  reviewCompletion: number;
  trend: { month: string; performance: number; sentiment: number }[];
  criteriaScores: { criterion: string; score: number }[];
}

// Mock data
const mockTeams: Team[] = [
  {
    id: "sales",
    name: "Sales Team",
    manager: "Sarah Johnson",
    memberCount: 12,
    avgPerformance: 8.7,
    avgSentiment: 7.9,
    reviewCompletion: 85,
    trend: [
      { month: "Jan", performance: 7.8, sentiment: 7.2 },
      { month: "Feb", performance: 8.1, sentiment: 7.5 },
      { month: "Mar", performance: 8.4, sentiment: 7.7 },
      { month: "Apr", performance: 8.7, sentiment: 7.9 },
    ],
    criteriaScores: [
      { criterion: "Product Knowledge", score: 9.2 },
      { criterion: "Communication", score: 8.5 },
      { criterion: "Problem Solving", score: 8.1 },
      { criterion: "Empathy", score: 7.8 },
    ],
  },
  {
    id: "support",
    name: "Support Team",
    manager: "Michael Chen",
    memberCount: 15,
    avgPerformance: 7.6,
    avgSentiment: 6.8,
    reviewCompletion: 72,
    trend: [
      { month: "Jan", performance: 7.2, sentiment: 6.4 },
      { month: "Feb", performance: 7.4, sentiment: 6.5 },
      { month: "Mar", performance: 7.5, sentiment: 6.7 },
      { month: "Apr", performance: 7.6, sentiment: 6.8 },
    ],
    criteriaScores: [
      { criterion: "Product Knowledge", score: 8.3 },
      { criterion: "Communication", score: 8.1 },
      { criterion: "Problem Solving", score: 7.9 },
      { criterion: "Empathy", score: 7.2 },
    ],
  },
  {
    id: "success",
    name: "Customer Success",
    manager: "Priya Patel",
    memberCount: 10,
    avgPerformance: 8.9,
    avgSentiment: 8.3,
    reviewCompletion: 92,
    trend: [
      { month: "Jan", performance: 8.2, sentiment: 7.8 },
      { month: "Feb", performance: 8.5, sentiment: 8.0 },
      { month: "Mar", performance: 8.7, sentiment: 8.1 },
      { month: "Apr", performance: 8.9, sentiment: 8.3 },
    ],
    criteriaScores: [
      { criterion: "Product Knowledge", score: 9.4 },
      { criterion: "Communication", score: 9.1 },
      { criterion: "Problem Solving", score: 8.8 },
      { criterion: "Empathy", score: 8.7 },
    ],
  },
];

// Sentiment Meter Component
const SentimentMeter = ({ value }: { value: number }) => {
  const getColor = (val: number) => {
    if (val >= 8) return "#10B981";
    if (val >= 5) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="relative">
      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
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
        <span className="font-bold text-sm">{value.toFixed(1)}</span>
      </div>
    </div>
  );
};

// Performance Trend Chart
const PerformanceTrendChart = ({
  teams,
  timeRange,
}: {
  teams: Team[];
  timeRange: string;
}) => {
  const categories = teams[0]?.trend.map((t) => t.month) || [];

  const options: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"],
    xaxis: {
      categories,
      labels: { style: { colors: "#a1a1aa" } },
    },
    yaxis: {
      min: 5,
      max: 10,
      title: { text: "Performance Score" },
      labels: { style: { colors: "#a1a1aa" } },
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
      labels: { colors: "#a1a1aa" },
    },
  };

  const series = teams.map((team) => ({
    name: team.name,
    data: team.trend.map((t) => t.performance),
  }));

  return <Chart options={options} series={series} type="line" height={350} />;
};

// Team Comparison Chart
const TeamComparisonChart = ({ teams }: { teams: Team[] }) => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
      },
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B"],
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: ["Performance", "Sentiment", "Review Completion"],
      labels: { style: { colors: "#a1a1aa" } },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: { style: { colors: "#a1a1aa" } },
    },
    grid: {
      borderColor: "#27272a",
      padding: { bottom: 20 },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + (val > 10 ? "%" : "/10");
        },
      },
    },
  };

  const series = teams.map((team) => ({
    name: team.name,
    data: [team.avgPerformance, team.avgSentiment, team.reviewCompletion],
  }));

  return <Chart options={options} series={series} type="bar" height={350} />;
};

// Criteria Radar Chart
const CriteriaRadarChart = ({ teams }: { teams: Team[] }) => {
  const criteria = teams[0]?.criteriaScores.map((c) => c.criterion) || [];

  const options: ApexOptions = {
    chart: {
      type: "radar",
      toolbar: { show: false },
    },
    xaxis: {
      categories,
    },
    yaxis: {
      show: false,
      min: 0,
      max: 10,
    },
    markers: {
      size: 4,
    },
    fill: {
      opacity: 0.1,
    },
    stroke: {
      width: 2,
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B"],
    legend: {
      position: "bottom",
      labels: { colors: "#a1a1aa" },
    },
  };

  const series = teams.map((team) => ({
    name: team.name,
    data: team.criteriaScores.map((c) => c.score),
  }));

  return <Chart options={options} series={series} type="radar" height={400} />;
};

export default function TeamInsightsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>("quarter");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([
    "sales",
    "support",
    "success",
  ]);
  const [activeTab, setActiveTab] = useState("overview");
  const [teamDetails, setTeamDetails] = useState<Team | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredTeams = mockTeams.filter((team) =>
    selectedTeams.includes(team.id)
  );

  const teamMetrics = [
    { title: "Avg. Performance", value: "8.4/10", change: "+1.2%" },
    { title: "Team Sentiment", value: "7.8/10", change: "+0.8%" },
    { title: "Reviews Completed", value: "83%", change: "+12%" },
    { title: "Team Members", value: "37", change: "+2" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Performance Insights</h1>
        <Button color="primary" variant="solid">
          Generate Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-[#1e1e1e]">
        <CardBody className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-gray-400 mb-1 block">
                Select Teams
              </label>
              <Select
                selectedKeys={selectedTeams}
                onSelectionChange={(keys) =>
                  setSelectedTeams(Array.from(keys) as string[])
                }
                className="w-full"
              >
                {mockTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="min-w-[150px]">
              <label className="text-sm text-gray-400 mb-1 block">
                Time Range
              </label>
              <Select
                selectedKeys={[timeRange]}
                onSelectionChange={(keys) =>
                  setTimeRange(Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="month" value="month">
                  Last Month
                </SelectItem>
                <SelectItem key="quarter" value="quarter">
                  Last Quarter
                </SelectItem>
                <SelectItem key="year" value="year">
                  Last Year
                </SelectItem>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="flat">Apply Filters</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMetrics.map((metric, index) => (
          <Card key={index} className="bg-[#1e1e1e] shadow-sm">
            <CardBody className="p-4">
              {isLoading ? (
                <Skeleton className="h-6 w-3/4 rounded-lg" />
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <h3 className="text-foreground text-lg font-medium">
                      {metric.title}
                    </h3>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-green-500 text-sm mt-1">
                        {metric.change}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="bg-[#1e1e1e] rounded-lg p-2"
      >
        <Tab key="overview" title="Team Comparison" />
        <Tab key="performance" title="Performance Trends" />
        <Tab key="criteria" title="Criteria Analysis" />
      </Tabs>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-4">
          <Card className="bg-[#1e1e1e]">
            <CardHeader>
              <h2 className="text-lg font-semibold">
                Team Performance Comparison
              </h2>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Skeleton className="h-[350px] w-full rounded-lg" />
              ) : (
                <TeamComparisonChart teams={filteredTeams} />
              )}
            </CardBody>
            <CardFooter className="text-xs text-gray-500">
              Comparison of key metrics across selected teams
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map((team) => (
              <Card
                key={team.id}
                className="bg-[#1e1e1e] cursor-pointer hover:bg-[#2a2a2a]"
                onClick={() => setTeamDetails(team)}
              >
                <CardBody className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gray-700 rounded-lg p-2">
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                        <span className="font-bold">{team.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{team.name}</h3>
                      <p className="text-gray-500 text-sm">
                        Managed by {team.manager}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between gap-4">
                    <div className="text-center">
                      <SentimentMeter value={team.avgPerformance} />
                      <p className="mt-2 text-sm">Performance</p>
                    </div>
                    <div className="text-center">
                      <SentimentMeter value={team.avgSentiment} />
                      <p className="mt-2 text-sm">Sentiment</p>
                    </div>
                    <div className="text-center flex flex-col justify-center">
                      <div className="text-2xl font-bold">
                        {team.reviewCompletion}%
                      </div>
                      <p className="text-sm">Reviews</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Members</span>
                      <span>{team.memberCount}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(team.memberCount / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "performance" && (
        <div className="grid grid-cols-1 gap-4">
          <Card className="bg-[#1e1e1e]">
            <CardHeader>
              <h2 className="text-lg font-semibold">Performance Trend</h2>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Skeleton className="h-[350px] w-full rounded-lg" />
              ) : (
                <PerformanceTrendChart
                  teams={filteredTeams}
                  timeRange={timeRange}
                />
              )}
            </CardBody>
            <CardFooter className="text-xs text-gray-500">
              Performance trends over time for selected teams
            </CardFooter>
          </Card>

          <Card className="bg-[#1e1e1e]">
            <CardHeader>
              <h2 className="text-lg font-semibold">Sentiment Trend</h2>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Skeleton className="h-[350px] w-full rounded-lg" />
              ) : (
                <PerformanceTrendChart
                  teams={filteredTeams}
                  timeRange={timeRange}
                />
              )}
            </CardBody>
            <CardFooter className="text-xs text-gray-500">
              Sentiment trends over time for selected teams
            </CardFooter>
          </Card>
        </div>
      )}

      {activeTab === "criteria" && (
        <div className="grid grid-cols-1 gap-4">
          <Card className="bg-[#1e1e1e]">
            <CardHeader>
              <h2 className="text-lg font-semibold">
                Evaluation Criteria Comparison
              </h2>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full rounded-lg" />
              ) : (
                <CriteriaRadarChart teams={filteredTeams} />
              )}
            </CardBody>
            <CardFooter className="text-xs text-gray-500">
              Comparison of evaluation criteria performance across teams
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTeams.map((team) => (
              <Card key={team.id} className="bg-[#1e1e1e]">
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    {team.name} Criteria Scores
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {team.criteriaScores.map((criteria, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{criteria.criterion}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-700 rounded-full h-2.5">
                            <div
                              className="bg-blue-500 h-2.5 rounded-full"
                              style={{ width: `${criteria.score * 10}%` }}
                            ></div>
                          </div>
                          <Badge color="primary">
                            {criteria.score.toFixed(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Team Detail View */}
      {teamDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <Card className="bg-[#1e1e1e] w-full max-w-3xl">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{teamDetails.name}</h2>
              <Button variant="ghost" onClick={() => setTeamDetails(null)}>
                ✕
              </Button>
            </CardHeader>
            <CardBody className="max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Team Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Manager:</span>
                      <span>{teamDetails.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Members:</span>
                      <span>{teamDetails.memberCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Avg. Performance:</span>
                      <span>{teamDetails.avgPerformance}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Avg. Sentiment:</span>
                      <span>{teamDetails.avgSentiment}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Review Completion:</span>
                      <span>{teamDetails.reviewCompletion}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-center mb-4">
                    <SentimentMeter value={teamDetails.avgPerformance} />
                    <p className="mt-2">Performance</p>
                  </div>
                  <div className="text-center">
                    <SentimentMeter value={teamDetails.avgSentiment} />
                    <p className="mt-2">Sentiment</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
              <PerformanceTrendChart
                teams={[teamDetails]}
                timeRange={timeRange}
              />

              <h3 className="text-lg font-semibold mt-6 mb-4">
                Criteria Scores
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamDetails.criteriaScores.map((criteria, index) => (
                  <Card key={index} className="bg-[#2a2a2a]">
                    <CardBody>
                      <div className="flex justify-between items-center">
                        <span>{criteria.criterion}</span>
                        <Badge color="primary">{criteria.score}/10</Badge>
                      </div>
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${criteria.score * 10}%` }}
                        ></div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </CardBody>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="flat" onClick={() => setTeamDetails(null)}>
                Close
              </Button>
              <Button color="primary">View Detailed Report</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
