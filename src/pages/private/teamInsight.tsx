import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tabs,
  Tab,
  Chip,
  Select,
  SelectItem,
  Button,
  Badge,
  Skeleton,
  Avatar,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useNavigate, useParams } from "react-router-dom";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

// Mock team data
const teamsData = [
  {
    id: "team1",
    name: "Sales Team",
    description: "Global sales and account management",
    managerIds: ["mgr1", "mgr2"],
    performance: 8.7,
    sentiment: 7.9,
    memberCount: 12,
    reviewCount: 42,
    positiveSentiment: 76,
    criteria: [
      { name: "Clarity", score: 8.2 },
      { name: "Accuracy", score: 8.9 },
      { name: "Structure", score: 7.8 },
      { name: "Product Knowledge", score: 9.1 },
      { name: "Solution Focus", score: 8.5 },
    ],
    trends: {
      month: [8.2, 8.4, 8.7],
      quarter: [7.8, 8.2, 8.5],
      year: [8.0, 8.3, 8.6],
    },
    reviewVolume: [20, 25, 30, 28, 32, 35, 38],
  },
  {
    id: "team2",
    name: "Support Team",
    description: "Technical support and troubleshooting",
    managerIds: ["mgr3"],
    performance: 7.3,
    sentiment: 6.8,
    memberCount: 8,
    reviewCount: 35,
    positiveSentiment: 62,
    criteria: [
      { name: "Clarity", score: 7.8 },
      { name: "Accuracy", score: 8.2 },
      { name: "Structure", score: 7.1 },
      { name: "Product Knowledge", score: 8.4 },
      { name: "Solution Focus", score: 7.6 },
    ],
    trends: {
      month: [7.0, 7.1, 7.3],
      quarter: [6.8, 7.0, 7.2],
      year: [6.5, 6.8, 7.0],
    },
    reviewVolume: [18, 22, 20, 25, 23, 28, 30],
  },
  {
    id: "team3",
    name: "Success Team",
    description: "Customer onboarding and retention",
    managerIds: ["mgr4", "mgr5"],
    performance: 8.9,
    sentiment: 8.5,
    memberCount: 6,
    reviewCount: 28,
    positiveSentiment: 84,
    criteria: [
      { name: "Clarity", score: 8.8 },
      { name: "Accuracy", score: 9.0 },
      { name: "Structure", score: 8.5 },
      { name: "Product Knowledge", score: 8.7 },
      { name: "Solution Focus", score: 9.2 },
    ],
    trends: {
      month: [8.6, 8.7, 8.9],
      quarter: [8.3, 8.5, 8.7],
      year: [8.0, 8.3, 8.6],
    },
    reviewVolume: [15, 18, 20, 22, 25, 24, 26],
  },
  {
    id: "team4",
    name: "Account Management",
    description: "Client relationship management",
    managerIds: ["mgr6"],
    performance: 8.2,
    sentiment: 7.7,
    memberCount: 7,
    reviewCount: 31,
    positiveSentiment: 71,
    criteria: [
      { name: "Clarity", score: 8.0 },
      { name: "Accuracy", score: 8.3 },
      { name: "Structure", score: 7.9 },
      { name: "Product Knowledge", score: 8.6 },
      { name: "Solution Focus", score: 8.4 },
    ],
    trends: {
      month: [7.9, 8.1, 8.2],
      quarter: [7.7, 7.9, 8.1],
      year: [7.5, 7.8, 8.0],
    },
    reviewVolume: [17, 19, 22, 24, 26, 28, 30],
  },
];

// Mock managers data
const managersData = [
  {
    id: "mgr1",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: "mgr2",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?u=michael",
  },
  {
    id: "mgr3",
    name: "Emma Rodriguez",
    avatar: "https://i.pravatar.cc/150?u=emma",
  },
  {
    id: "mgr4",
    name: "David Wilson",
    avatar: "https://i.pravatar.cc/150?u=david",
  },
  {
    id: "mgr5",
    name: "Priya Patel",
    avatar: "https://i.pravatar.cc/150?u=priya",
  },
  {
    id: "mgr6",
    name: "Alex Thompson",
    avatar: "https://i.pravatar.cc/150?u=alex",
  },
];

// Sentiment Meter Component
const SentimentMeter = ({
  value,
  size = "md",
}: {
  value: number;
  size?: "sm" | "md" | "lg";
}) => {
  const getColor = (val: number) => {
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

// Team Performance Comparison Chart
const TeamPerformanceChart = ({ teams }: { teams: typeof teamsData }) => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "/10";
      },
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
    },
    stroke: {
      width: 1,
      colors: ["#1e1e1e"],
    },
    xaxis: {
      categories: teams.map((t) => t.name),
      labels: {
        style: {
          colors: "#a1a1aa",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 10,
      title: { text: "Performance Score" },
      labels: { style: { colors: "#a1a1aa" } },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#3B82F6"],
    grid: {
      borderColor: "#27272a",
      padding: { bottom: 20 },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(1) + "/10";
        },
      },
    },
  };

  const series = [
    {
      name: "Performance",
      data: teams.map((t) => t.performance),
    },
  ];

  return <Chart options={options} series={series} type="bar" height={350} />;
};

// Review Volume Over Time Chart
const ReviewVolumeChart = ({ teams }: { teams: typeof teamsData }) => {
  const options: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"],
    markers: {
      size: 5,
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: { style: { colors: "#a1a1aa" } },
    },
    yaxis: {
      title: { text: "Review Volume" },
      labels: { style: { colors: "#a1a1aa" } },
    },
    grid: {
      borderColor: "#27272a",
      padding: { bottom: 20 },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " reviews";
        },
      },
    },
    legend: {
      position: "top",
      labels: { colors: "#a1a1aa" },
    },
  };

  const series = teams.map((team) => ({
    name: team.name,
    data: team.reviewVolume,
  }));

  return <Chart options={options} series={series} type="line" height={350} />;
};

// Sentiment Distribution Chart
const SentimentDistributionChart = () => {
  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Sentiment",
              color: "#a1a1aa",
            },
            value: {
              color: "#ffffff",
              fontSize: "24px",
              fontWeight: 700,
            },
          },
        },
      },
    },
    colors: ["#10B981", "#F59E0B", "#EF4444"],
    labels: ["Positive", "Neutral", "Negative"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      labels: { colors: "#a1a1aa" },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = [65, 25, 10];

  return <Chart options={options} series={series} type="donut" height={350} />;
};

// Criteria Radar Chart
const CriteriaRadarChart = ({ teams }: { teams: typeof teamsData }) => {
  // Extract criteria names from first team (assuming all teams have same criteria)
  const criteria = teams[0].criteria.map((c) => c.name);

  const options: ApexOptions = {
    chart: {
      type: "radar",
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "10px",
        fontWeight: 600,
      },
    },
    plotOptions: {
      radar: {
        size: 120,
        polygons: {
          strokeColors: "#27272a",
          fill: {
            colors: ["#2a2a2a", "#1e1e1e"],
          },
        },
      },
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"],
    markers: {
      size: 4,
      strokeWidth: 2,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(1) + "/10";
        },
      },
    },
    xaxis: {
      categories: criteria,
      labels: {
        style: {
          colors: "#a1a1aa",
          fontSize: "10px",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 10,
      show: false,
    },
    legend: {
      position: "bottom",
      labels: { colors: "#a1a1aa" },
    },
  };

  const series = teams.map((team) => ({
    name: team.name,
    data: team.criteria.map((c) => c.score),
  }));

  return <Chart options={options} series={series} type="radar" height={400} />;
};

// Low Performing Teams Table
const LowPerformingTeamsTable = ({ teams }: { teams: typeof teamsData }) => {
  // Sort teams by performance ascending
  const sortedTeams = [...teams].sort((a, b) => a.performance - b.performance);

  return (
    <Table className="w-full">
      <TableHeader>
        <TableColumn>Team</TableColumn>
        <TableColumn>Avg Score</TableColumn>
        <TableColumn>Review Count</TableColumn>
        <TableColumn>Sentiment</TableColumn>
        <TableColumn>Status</TableColumn>
      </TableHeader>
      <TableBody>
        {sortedTeams
          .filter((t) => t.performance < 8.0)
          .map((team) => (
            <TableRow
              key={team.id}
              className="hover:bg-[#2a2a2a] cursor-pointer"
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-lg w-8 h-8 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {team.name.charAt(0)}
                    </span>
                  </div>
                  <span>{team.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge color={team.performance >= 7.5 ? "warning" : "danger"}>
                  {team.performance.toFixed(1)}/10
                </Badge>
              </TableCell>
              <TableCell>{team.reviewCount}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{team.positiveSentiment}%</span>
                  <SentimentMeter value={team.sentiment} size="sm" />
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  color={team.performance >= 7.5 ? "warning" : "danger"}
                  variant="dot"
                >
                  Needs attention
                </Chip>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

// Team Summary Card
const TeamSummaryCard = ({ team }: { team: (typeof teamsData)[0] }) => {
  return (
    <Card className="bg-[#2a2a2a] hover:bg-[#333333] cursor-pointer">
      <CardBody className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {/* Top section */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold mb-1">{team.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{team.description}</p>

              <div className="flex flex-col gap-2">
                {team.managerIds.map((managerId) => {
                  const manager = managersData.find((m) => m.id === managerId);
                  return (
                    manager && (
                      <div key={manager.id} className="flex items-center gap-1">
                        <Avatar size="md" src={manager.avatar} />
                        <span className="text-xs text-gray-400">
                          {manager.name}
                        </span>
                      </div>
                    )
                  );
                })}
              </div>
            </div>

            <SentimentMeter value={team.performance} size="md" />
          </div>
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="text-center">
            <p className="text-xl font-bold">{team.performance.toFixed(1)}</p>
            <p className="text-xs text-gray-500">Avg Score</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{team.positiveSentiment}%</p>
            <p className="text-xs text-gray-500">Pos. Sentiment</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{team.reviewCount}</p>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

// Main Component
export default function TeamInsightsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">(
    "quarter"
  );
  const [viewMode, setViewMode] = useState<
    "performance" | "sentiment" | "volume"
  >("performance");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (id) {
        const team = teamsData.find((t) => t.id === id) || teamsData[0];
        setSelectedTeam(team);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [id]);

  // Filter teams based on active status
  const filteredTeams = showActiveOnly
    ? teamsData.filter((t) => t.performance >= 7.0)
    : teamsData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            &larr; Back
          </Button>
          <h1 className="text-2xl font-bold">
            {selectedTeam ? selectedTeam.name : "Team Insights"}
          </h1>
        </div>
        <Button color="primary" variant="solid">
          Generate Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-[#1e1e1e]">
        <CardBody className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Time Range
              </label>
              <Select
                size="sm"
                className="min-w-[120px]"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
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

            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                View Mode
              </label>
              <Select
                size="sm"
                className="min-w-[140px]"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
              >
                <SelectItem key="performance" value="performance">
                  Performance
                </SelectItem>
                <SelectItem key="sentiment" value="sentiment">
                  Sentiment
                </SelectItem>
                <SelectItem key="volume" value="volume">
                  Volume
                </SelectItem>
              </Select>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="active-only"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600"
              />
              <label htmlFor="active-only" className="text-sm text-gray-300">
                Show active teams only
              </label>
            </div>

            <div className="flex items-end ml-auto">
              <Button variant="flat">Apply Filters</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {selectedTeam ? (
        <>
          {/* Team Profile Header */}
          <Card className="bg-[#1e1e1e]">
            <CardBody className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-xl w-24 h-24 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {selectedTeam.name.charAt(0)}
                  </span>
                </div>

                <div className="flex-1 text-center md:text-left">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-64 mb-2 rounded-lg" />
                      <Skeleton className="h-6 w-48 mb-4 rounded-lg" />
                      <Skeleton className="h-6 w-32 rounded-lg" />
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold">
                        {selectedTeam.name}
                      </h2>
                      <p className="text-lg text-gray-400 mb-2">
                        {selectedTeam.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-gray-500">Managers: </span>
                        {selectedTeam.managerIds.map((managerId: string) => {
                          const manager = managersData.find(
                            (m) => m.id === managerId
                          );
                          return (
                            manager && (
                              <div
                                key={manager.id}
                                className="flex items-center gap-2"
                              >
                                <Avatar size="sm" src={manager.avatar} />
                                <span>{manager.name}</span>
                              </div>
                            )
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-4 md:gap-8">
                  <div className="text-center">
                    {isLoading ? (
                      <Skeleton className="h-16 w-16 rounded-full mx-auto mb-2" />
                    ) : (
                      <>
                        <SentimentMeter
                          value={selectedTeam.performance}
                          size="lg"
                        />
                        <p className="mt-2 text-sm font-medium">
                          {selectedTeam.performance}/10
                        </p>
                      </>
                    )}
                    <p className="text-sm text-gray-500">Performance</p>
                  </div>
                  <div className="text-center">
                    {isLoading ? (
                      <Skeleton className="h-16 w-16 rounded-full mx-auto mb-2" />
                    ) : (
                      <>
                        <SentimentMeter
                          value={selectedTeam.sentiment}
                          size="lg"
                        />
                        <p className="mt-2 text-sm font-medium">
                          {selectedTeam.sentiment}/10
                        </p>
                      </>
                    )}
                    <p className="text-sm text-gray-500">Sentiment</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Tabs Navigation */}
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            className="bg-[#1e1e1e] rounded-lg p-2"
          >
            <Tab key="overview" title="Overview" />
            <Tab key="performance" title="Performance Analysis" />
            <Tab key="trends" title="Performance Trends" />
            <Tab key="criteria" title="Evaluation Criteria" />
          </Tabs>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Metrics Cards */}
              <Card className="lg:col-span-3 bg-[#1e1e1e]">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Key Metrics</h2>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-[#2a2a2a]">
                      <CardBody className="p-4">
                        <h3 className="text-md font-medium">
                          Avg. Performance
                        </h3>
                        <div className="flex items-baseline gap-2 mt-2">
                          <p className="text-2xl font-bold">
                            {selectedTeam.performance.toFixed(1)}/10
                          </p>
                          <p className="text-green-500 font-medium">+0.4</p>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="bg-[#2a2a2a]">
                      <CardBody className="p-4">
                        <h3 className="text-md font-medium">
                          Positive Sentiment
                        </h3>
                        <div className="flex items-baseline gap-2 mt-2">
                          <p className="text-2xl font-bold">
                            {selectedTeam.positiveSentiment}%
                          </p>
                          <p className="text-green-500 font-medium">+5.2%</p>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="bg-[#2a2a2a]">
                      <CardBody className="p-4">
                        <h3 className="text-md font-medium">
                          Reviews Completed
                        </h3>
                        <div className="flex items-baseline gap-2 mt-2">
                          <p className="text-2xl font-bold">
                            {selectedTeam.reviewCount}
                          </p>
                          <p className="text-green-500 font-medium">+12</p>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="bg-[#2a2a2a]">
                      <CardBody className="p-4">
                        <h3 className="text-md font-medium">Team Members</h3>
                        <div className="flex items-baseline gap-2 mt-2">
                          <p className="text-2xl font-bold">
                            {selectedTeam.memberCount}
                          </p>
                          <p className="text-green-500 font-medium">+2</p>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </CardBody>
              </Card>

              {/* Criteria Performance */}
              <Card className="lg:col-span-2 bg-[#1e1e1e]">
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Evaluation Criteria Performance
                  </h2>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                  ) : (
                    <CriteriaRadarChart teams={[selectedTeam]} />
                  )}
                </CardBody>
              </Card>

              {/* Sentiment Distribution */}
              <Card className="bg-[#1e1e1e]">
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Sentiment Distribution
                  </h2>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                  ) : (
                    <SentimentDistributionChart />
                  )}
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === "performance" && (
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
                    <TeamPerformanceChart teams={filteredTeams} />
                  )}
                </CardBody>
                <CardFooter className="text-xs text-gray-500">
                  Performance scores across {filteredTeams.length} teams
                </CardFooter>
              </Card>

              <Card className="bg-[#1e1e1e]">
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Low Performing Teams
                  </h2>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-16 rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <LowPerformingTeamsTable teams={filteredTeams} />
                  )}
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === "trends" && (
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-[#1e1e1e]">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                      Review Volume Over Time
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={timeRange === "month" ? "solid" : "ghost"}
                        onClick={() => setTimeRange("month")}
                      >
                        Weekly
                      </Button>
                      <Button
                        size="sm"
                        variant={timeRange === "quarter" ? "solid" : "ghost"}
                        onClick={() => setTimeRange("quarter")}
                      >
                        Monthly
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <Skeleton className="h-[350px] w-full rounded-lg" />
                  ) : (
                    <ReviewVolumeChart teams={filteredTeams} />
                  )}
                </CardBody>
                <CardFooter className="text-xs text-gray-500">
                  Review volume trends across teams over the last 7 days
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "criteria" && (
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-[#1e1e1e]">
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Criteria-Based Team Comparison
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
                  Performance across key evaluation criteria
                </CardFooter>
              </Card>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Team Overview */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredTeams.map((team) => (
                <TeamSummaryCard key={team.id} team={team} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    <TeamPerformanceChart teams={filteredTeams} />
                  )}
                </CardBody>
                <CardFooter className="text-xs text-gray-500">
                  Performance scores across {filteredTeams.length} teams
                </CardFooter>
              </Card>

              <Card className="bg-[#1e1e1e]">
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Overall Sentiment Distribution
                  </h2>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <Skeleton className="h-[350px] w-full rounded-lg" />
                  ) : (
                    <SentimentDistributionChart />
                  )}
                </CardBody>
                <CardFooter className="text-xs text-gray-500">
                  Aggregated sentiment across all teams
                </CardFooter>
              </Card>

              <Card className="bg-[#1e1e1e] lg:col-span-2">
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Review Volume Over Time
                  </h2>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <Skeleton className="h-[350px] w-full rounded-lg" />
                  ) : (
                    <ReviewVolumeChart teams={filteredTeams} />
                  )}
                </CardBody>
                <CardFooter className="text-xs text-gray-500">
                  Review volume trends across teams over the last 7 days
                </CardFooter>
              </Card>

              <Card className="bg-[#1e1e1e] lg:col-span-2">
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Criteria-Based Team Comparison
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
                  Performance across key evaluation criteria
                </CardFooter>
              </Card>

              <Card className="bg-[#1e1e1e] lg:col-span-2">
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Low Performing Teams
                  </h2>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <LowPerformingTeamsTable teams={filteredTeams} />
                  )}
                </CardBody>
                <CardFooter className="text-xs text-gray-500">
                  Teams with performance scores below 8.0/10
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
