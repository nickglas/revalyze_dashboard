import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Skeleton,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Select,
  SelectItem,
  Button,
  Badge,
  Link,
} from "@heroui/react";
import { useNavigate, useParams } from "react-router-dom";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

// Mock data
const teamPerformance = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Sales",
    performance: 9.2,
    sentiment: 8.7,
    reviewCount: 15,
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Support",
    performance: 7.8,
    sentiment: 6.2,
    reviewCount: 12,
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    role: "Account",
    performance: 8.9,
    sentiment: 8.1,
    reviewCount: 18,
  },
  {
    id: "4",
    name: "David Wilson",
    role: "Implementation",
    performance: 7.2,
    sentiment: 6.8,
    reviewCount: 10,
  },
  {
    id: "5",
    name: "Priya Patel",
    role: "Success",
    performance: 8.5,
    sentiment: 8.3,
    reviewCount: 20,
  },
  {
    id: "6",
    name: "Alex Thompson",
    role: "Support",
    performance: 6.4,
    sentiment: 5.8,
    reviewCount: 8,
  },
  {
    id: "7",
    name: "Jamie Smith",
    role: "Sales",
    performance: 9.3,
    sentiment: 8.9,
    reviewCount: 22,
  },
  {
    id: "8",
    name: "Taylor Kim",
    role: "Onboarding",
    performance: 7.8,
    sentiment: 7.1,
    reviewCount: 14,
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

// Score Distribution Chart
const ScoreDistributionChart = () => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        borderRadius: 4,
        barHeight: "80%",
      },
    },
    colors: ["#EF4444", "#F59E0B", "#FBBF24", "#10B981", "#3B82F6"],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + " employees";
      },
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
    },
    xaxis: {
      categories: ["0-2", "2-4", "4-6", "6-8", "8-10"],
      title: { text: "Number of Employees" },
      labels: { style: { colors: "#a1a1aa" } },
    },
    yaxis: {
      title: { text: "Performance Score Range" },
      labels: { style: { colors: "#a1a1aa" } },
    },
    grid: {
      borderColor: "#27272a",
      padding: { bottom: 20 },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " employees";
        },
      },
    },
  };

  const series = [
    {
      name: "Employees",
      data: [2, 5, 12, 18, 8],
    },
  ];

  return <Chart options={options} series={series} type="bar" height={350} />;
};

// Review Funnel Chart
const ReviewFunnelChart = ({
  totalEmployees,
  assignedReviews,
  startedReviews,
  completedReviews,
}: {
  totalEmployees: number;
  assignedReviews: number;
  startedReviews: number;
  completedReviews: number;
}) => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        distributed: true,
        barHeight: "80%",
        dataLabels: {
          position: "bottom",
        },
      },
    },
    colors: ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"],
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return `${val} employees`;
      },
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
    },
    xaxis: {
      categories: [
        "Total Employees",
        "Assigned Reviews",
        "Started Reviews",
        "Completed Reviews",
      ],
      labels: { style: { colors: "#a1a1aa" } },
    },
    yaxis: {
      reversed: true,
      labels: { style: { colors: "#a1a1aa" } },
    },
    grid: {
      borderColor: "#27272a",
      padding: { bottom: 20 },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} employees`;
        },
      },
    },
  };

  const series = [
    {
      name: "Employees",
      data: [totalEmployees, assignedReviews, startedReviews, completedReviews],
    },
  ];

  return <Chart options={options} series={series} type="bar" height={350} />;
};

// Top/Bottom Performers Chart
const TopBottomPerformersChart = ({
  topPerformers,
  bottomPerformers,
}: {
  topPerformers: Array<{ name: string; performance: number }>;
  bottomPerformers: Array<{ name: string; performance: number }>;
}) => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "80%",
      },
    },
    colors: ["#10B981", "#EF4444"],
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
      },
    },
    xaxis: {
      categories: [
        ...topPerformers.map((p) => p.name),
        ...bottomPerformers.map((p) => p.name),
      ],
      labels: { style: { colors: "#a1a1aa" } },
    },
    yaxis: {
      labels: { style: { colors: "#a1a1aa" } },
    },
    grid: {
      borderColor: "#27272a",
      padding: { bottom: 20 },
    },
    legend: {
      position: "top",
      labels: { colors: "#a1a1aa" },
    },
  };

  const series = [
    {
      name: "Top Performers",
      data: [
        ...topPerformers.map((p) => p.performance),
        ...Array(bottomPerformers.length).fill(null),
      ],
    },
    {
      name: "Needs Improvement",
      data: [
        ...Array(topPerformers.length).fill(null),
        ...bottomPerformers.map((p) => p.performance),
      ],
    },
  ];

  return <Chart options={options} series={series} type="bar" height={350} />;
};

// Sentiment Trend by Role Chart
const SentimentTrendByRoleChart = ({
  range,
}: {
  range: "month" | "quarter" | "year";
}) => {
  // Mock data
  const roles = ["Sales", "Support", "Account Management"];

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
        series: roles.map((role) => ({
          name: role,
          data: Array(12)
            .fill(0)
            .map(() => Math.random() * 2 + 6 + Math.random()),
        })),
      };
    } else if (range === "quarter") {
      return {
        categories: ["Q1", "Q2", "Q3", "Q4"],
        series: roles.map((role) => ({
          name: role,
          data: Array(4)
            .fill(0)
            .map(() => Math.random() * 2 + 6 + Math.random()),
        })),
      };
    } else {
      return {
        categories: ["2022", "2023", "2024"],
        series: roles.map((role) => ({
          name: role,
          data: Array(3)
            .fill(0)
            .map(() => Math.random() * 2 + 6 + Math.random()),
        })),
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
    colors: ["#3B82F6", "#10B981", "#F59E0B"],
    xaxis: {
      categories: data.categories,
      labels: { style: { colors: "#a1a1aa" } },
    },
    yaxis: {
      min: 5,
      max: 10,
      title: { text: "Sentiment Score" },
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

  return (
    <Chart options={options} series={data.series} type="line" height={350} />
  );
};

// Review Turnaround Chart
const ReviewTurnaroundChart = () => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        distributed: false,
      },
    },
    colors: ["#60A5FA"],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + " reviews";
      },
      style: {
        colors: ["#fff"],
      },
    },
    xaxis: {
      categories: ["< 1 day", "1-3 days", "3-7 days", "1-2 weeks", "> 2 weeks"],
      title: { text: "Number of Reviews" },
      labels: { style: { colors: "#a1a1aa" } },
    },
    yaxis: {
      title: { text: "Time to Complete" },
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
  };

  const series = [
    {
      name: "Reviews",
      data: [12, 25, 18, 8, 4],
    },
  ];

  return <Chart options={options} series={series} type="bar" height={350} />;
};

// Team Performance Overview (Scatter Plot)
const EmployeeSentimentChart = () => {
  const employees = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Sales",
      performance: 9.2,
      sentiment: 8.7,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Support",
      performance: 7.8,
      sentiment: 6.2,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Account",
      performance: 8.9,
      sentiment: 8.1,
    },
    {
      id: 4,
      name: "David Wilson",
      role: "Implementation",
      performance: 7.2,
      sentiment: 6.8,
    },
    {
      id: 5,
      name: "Priya Patel",
      role: "Success",
      performance: 8.5,
      sentiment: 8.3,
    },
    {
      id: 6,
      name: "Alex Thompson",
      role: "Support",
      performance: 6.4,
      sentiment: 5.8,
    },
    {
      id: 7,
      name: "Jamie Smith",
      role: "Sales",
      performance: 9.3,
      sentiment: 8.9,
    },
    {
      id: 8,
      name: "Taylor Kim",
      role: "Onboarding",
      performance: 7.8,
      sentiment: 7.1,
    },
  ];

  const categorizedData: Record<
    string,
    Array<{ x: number; y: number; name: string; id: number }>
  > = {
    "High Performer, Positive Sentiment": [],
    "High Performer, Needs Support": [],
    "Developing, Positive Attitude": [],
    "Needs Improvement": [],
  };

  employees.forEach(({ id, name, performance, sentiment }) => {
    const point = { x: performance, y: sentiment, name, id };
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

  const chartSeries = Object.entries(categorizedData).map(([name, data]) => ({
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
    },
    xaxis: {
      title: { text: "Performance score" },
      min: 0,
      max: 10,
      labels: { style: { colors: "#a1a1aa" } },
    },
    yaxis: {
      title: { text: "Sentiment score" },
      min: 0,
      max: 10,
      labels: { style: { colors: "#a1a1aa" } },
    },
    legend: {
      position: "bottom",
      labels: { colors: "#a1a1aa" },
    },
    tooltip: {
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const point = chartSeries[seriesIndex].data[dataPointIndex];
        return `<div style="padding: 8px; background: #1e1e1e; color: #fff; border: 1px solid #333;">
          <strong>${point.name}</strong><br/>
          Performance: ${point.x.toFixed(1)}<br/>
          Sentiment: ${point.y.toFixed(1)}
        </div>`;
      },
    },
    markers: { size: 8 },
    grid: {
      borderColor: "#27272a",
      padding: { bottom: 20 },
    },
  };

  return (
    <Chart options={options} series={chartSeries} type="scatter" height={400} />
  );
};

// Main Component
export default function EmployeeInsightsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">(
    "quarter"
  );
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (id) {
        const employee = teamPerformance.find((e) => e.id === id) || {
          id,
          name: "Sarah Johnson",
          role: "Sales Executive",
          email: "sarah.johnson@acme.com",
          performance: 8.2,
          sentiment: 7.5,
          reviewCount: 42,
          status: "active",
          metrics: {
            lastCalculated: "2025-07-20T20:51:25.439Z",
            reviewCount: 42,
            overallScore: 8.2,
            sentimentScore: 7.5,
            lastPeriodScores: [
              { period: "2025-Q3", overall: 8.2, sentiment: 7.5 },
              { period: "2025-Q2", overall: 7.8, sentiment: 6.9 },
              { period: "2025-Q1", overall: 7.5, sentiment: 6.7 },
            ],
          },
        };
        setSelectedEmployee(employee);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [id]);

  // Get unique roles for filter
  const roles = Array.from(new Set(teamPerformance.map((e) => e.role)));

  // Apply role filter
  const filteredTeam =
    roleFilter === "all"
      ? teamPerformance
      : teamPerformance.filter((e) => e.role === roleFilter);

  // Get top 3 performers
  const topPerformers = [...filteredTeam]
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 3);

  // Get bottom 3 performers
  const improvementNeeded = [...filteredTeam]
    .sort((a, b) => a.performance - b.performance)
    .slice(0, 3);

  // Calculate review funnel metrics
  const totalEmployees = filteredTeam.length;
  const assignedReviews = filteredTeam.filter((e) => e.performance > 0).length;
  const startedReviews = filteredTeam.filter((e) => e.reviewCount > 0).length;
  const completedReviews = filteredTeam.filter((e) => e.reviewCount > 1).length;

  // Individual employee metrics
  const employeeMetrics = [
    { title: "Performance Score", value: "8.2/10", change: "+0.4" },
    { title: "Sentiment Score", value: "7.5/10", change: "+0.6" },
    { title: "Reviews Completed", value: "42", change: "+8" },
    { title: "Avg. Review Time", value: "12min", change: "-2min" },
  ];

  const strengthAreas = [
    { name: "Product Knowledge", score: 9.2 },
    { name: "Communication", score: 8.7 },
    { name: "Problem Solving", score: 8.5 },
  ];

  const improvementAreas = [
    { name: "Empathy", score: 6.8 },
    { name: "Upselling", score: 7.1 },
    { name: "Follow-up", score: 6.9 },
  ];

  const recentReviews = [
    { id: "rev001", client: "Acme Corp", date: "2025-07-15", score: 8.5 },
    { id: "rev002", client: "Global Tech", date: "2025-07-10", score: 7.8 },
    { id: "rev003", client: "Innovate Inc", date: "2025-07-05", score: 8.9 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            &larr; Back
          </Button>
          <h1 className="text-2xl font-bold">
            {selectedEmployee ? selectedEmployee.name : "Employee Insights"}
          </h1>
        </div>
        <Button color="primary" variant="solid">
          Generate Report
        </Button>
      </div>

      {selectedEmployee ? (
        <>
          {/* Employee Profile Header */}
          <Card className="bg-[#1e1e1e]">
            <CardBody className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {isLoading ? (
                  <Skeleton className="w-24 h-24 rounded-full" />
                ) : (
                  <Avatar
                    className="w-24 h-24"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  />
                )}

                <div className="flex-1 text-center md:text-left">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-64 mb-2 rounded-lg" />
                      <Skeleton className="h-6 w-48 mb-4 rounded-lg" />
                      <Skeleton className="h-6 w-32 rounded-lg" />
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <h2 className="text-2xl font-bold">
                          {selectedEmployee.name}
                        </h2>
                        <Chip color="success" variant="dot">
                          {selectedEmployee.status}
                        </Chip>
                      </div>
                      <p className="text-lg text-gray-400 mb-2">
                        {selectedEmployee.role}
                      </p>
                      <p className="text-gray-500">{selectedEmployee.email}</p>
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
                          value={selectedEmployee.performance}
                          size="lg"
                        />
                        <p className="mt-2 text-sm font-medium">
                          {selectedEmployee.performance}/10
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
                          value={selectedEmployee.sentiment}
                          size="lg"
                        />
                        <p className="mt-2 text-sm font-medium">
                          {selectedEmployee.sentiment}/10
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
            <Tab key="trends" title="Score Trends" />
            <Tab key="comparison" title="Team Comparison" />
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {employeeMetrics.map((metric, index) => (
                      <Card key={index} className="bg-[#2a2a2a]">
                        <CardBody className="p-4">
                          {isLoading ? (
                            <>
                              <Skeleton className="h-6 w-3/4 mb-2 rounded-lg" />
                              <Skeleton className="h-8 w-1/2 rounded-lg" />
                            </>
                          ) : (
                            <>
                              <h3 className="text-foreground text-md font-medium">
                                {metric.title}
                              </h3>
                              <div className="flex items-baseline gap-2 mt-2">
                                <p className="text-2xl font-bold">
                                  {metric.value}
                                </p>
                                <p className="text-green-500 font-medium">
                                  {metric.change}
                                </p>
                              </div>
                            </>
                          )}
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Strength Areas */}
              <Card className="bg-[#1e1e1e]">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Strength Areas</h2>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {strengthAreas.map((area, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-[#2a2a2a] rounded-lg"
                        >
                          <span>{area.name}</span>
                          <Chip color="success">{area.score}/10</Chip>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Improvement Areas */}
              <Card className="bg-[#1e1e1e]">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Improvement Areas</h2>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {improvementAreas.map((area, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-[#2a2a2a] rounded-lg"
                        >
                          <span>{area.name}</span>
                          <Chip color="warning">{area.score}/10</Chip>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Recent Reviews */}
              <Card className="bg-[#1e1e1e]">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Recent Reviews</h2>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentReviews.map((review) => (
                        <div
                          key={review.id}
                          className="flex justify-between items-center p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#333333] cursor-pointer"
                          onClick={() => navigate(`/reviews/${review.id}`)}
                        >
                          <div>
                            <p className="font-medium">{review.client}</p>
                            <p className="text-sm text-gray-500">
                              {review.date}
                            </p>
                          </div>
                          <Chip color="primary">{review.score}/10</Chip>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-[#1e1e1e]">
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Performance Distribution
                  </h2>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                  ) : (
                    <ScoreDistributionChart />
                  )}
                </CardBody>
                <CardFooter className="text-xs text-gray-500">
                  Distribution of performance scores across the team
                </CardFooter>
              </Card>

              <Card className="bg-[#1e1e1e]">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Team Benchmark</h2>
                    <div className="flex gap-2">
                      {selectedEmployee && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
                          <span className="text-xs">
                            {selectedEmployee.name}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                        <span className="text-xs">Team Avg</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                  ) : (
                    <ReviewFunnelChart
                      totalEmployees={totalEmployees}
                      assignedReviews={assignedReviews}
                      startedReviews={startedReviews}
                      completedReviews={completedReviews}
                    />
                  )}
                </CardBody>
                <CardFooter className="text-xs text-gray-500">
                  Progress of employees through the review process
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "trends" && (
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-[#1e1e1e]">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Performance Trend</h2>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={timeRange === "month" ? "solid" : "ghost"}
                        onClick={() => setTimeRange("month")}
                      >
                        Monthly
                      </Button>
                      <Button
                        size="sm"
                        variant={timeRange === "quarter" ? "solid" : "ghost"}
                        onClick={() => setTimeRange("quarter")}
                      >
                        Quarterly
                      </Button>
                      <Button
                        size="sm"
                        variant={timeRange === "year" ? "solid" : "ghost"}
                        onClick={() => setTimeRange("year")}
                      >
                        Yearly
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <Skeleton className="h-[350px] w-full rounded-lg" />
                  ) : (
                    <SentimentTrendByRoleChart range={timeRange} />
                  )}
                </CardBody>
                <CardFooter className="text-xs text-gray-500">
                  Historical performance trend with peer comparison
                </CardFooter>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-[#1e1e1e]">
                  <CardHeader>
                    <h2 className="text-lg font-semibold">Top Performers</h2>
                  </CardHeader>
                  <CardBody>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-16 rounded-lg" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {topPerformers.map((employee, index) => (
                          <div
                            key={employee.id}
                            className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#333333] cursor-pointer"
                            onClick={() => navigate(`/insights/${employee.id}`)}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar
                                size="sm"
                                src={`https://i.pravatar.cc/150?u=${employee.id}`}
                              />
                              <div>
                                <p className="font-medium">{employee.name}</p>
                                <p className="text-xs text-gray-500">
                                  {employee.role}
                                </p>
                              </div>
                            </div>
                            <Badge color="success" variant="flat">
                              {employee.performance}/10
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>

                <Card className="bg-[#1e1e1e]">
                  <CardHeader>
                    <h2 className="text-lg font-semibold">
                      Improvement Needed
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
                      <div className="space-y-3">
                        {improvementNeeded.map((employee, index) => (
                          <div
                            key={employee.id}
                            className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#333333] cursor-pointer"
                            onClick={() => navigate(`/insights/${employee.id}`)}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar
                                size="sm"
                                src={`https://i.pravatar.cc/150?u=${employee.id}`}
                              />
                              <div>
                                <p className="font-medium">{employee.name}</p>
                                <p className="text-xs text-gray-500">
                                  {employee.role}
                                </p>
                              </div>
                            </div>
                            <Badge color="warning" variant="flat">
                              {employee.performance}/10
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Team Overview - New Enhanced View */}
          <div className="flex flex-col gap-6">
            {/* Filters */}
            <Card className="bg-[#1e1e1e]">
              <CardBody className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Role
                    </label>
                    <Select
                      size="sm"
                      className="min-w-[150px]"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <SelectItem key="all" value="all">
                        All Roles
                      </SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

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

                  <Select
                    label="Select role"
                    placeholder="Select a role"
                    labelPlacement="outside"
                  >
                    <SelectItem key="a">a</SelectItem>
                  </Select>

                  <div className="flex items-end">
                    <Button variant="flat">Apply Filters</Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-[#1e1e1e] col-span-1 lg:col-span-1">
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Performance Leaders & Improvement Needed
                  </h2>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                  ) : (
                    <TopBottomPerformersChart
                      topPerformers={topPerformers}
                      bottomPerformers={improvementNeeded}
                    />
                  )}
                </CardBody>
                <CardFooter className="text-xs text-gray-500">
                  Top and bottom performers based on overall performance scores
                </CardFooter>
              </Card>
              <Card className="bg-[#1e1e1e] lg:col-span-1">
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Performance Distribution
                  </h2>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                  ) : (
                    <ScoreDistributionChart />
                  )}
                </CardBody>
                <CardFooter className="text-xs text-gray-500">
                  Distribution of performance scores across the team
                </CardFooter>
              </Card>
              <Card className="bg-[#1e1e1e] col-span-1 lg:col-span-2">
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Employee performance overview
                  </h2>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                  ) : (
                    <EmployeeSentimentChart />
                  )}
                </CardBody>
                <CardFooter className="text-xs text-gray-500">
                  Employee sentiment-performance correlation across your
                  orginisation
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
