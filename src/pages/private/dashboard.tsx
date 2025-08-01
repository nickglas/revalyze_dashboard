import CriteriaChart from "@/components/charts/criteriaChart";
import EmployeeSentimentChart from "@/components/charts/employeeSentimentChart";
import MonthlyPerformanceChart from "@/components/charts/monthlyPerformanceChart";
import { ResourceGauce } from "@/components/charts/ResourceGauge";
import ReviewStatusChart from "@/components/charts/reviewStatusChart";
import RoleSentimentChart from "@/components/charts/roleSentimentChart";
import SentimentPerformanceChart from "@/components/charts/SentimentPerformanceChart";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const resourceUsage = [
    { title: "User Limit", used: 24, total: 50, color: "#3B82F6" },
    { title: "Transcripts", used: 120, total: 500, color: "#10B981" },
    { title: "Reviews", used: 42, total: 100, color: "#F59E0B" },
  ];

  // Mock metric data
  const metrics = [
    {
      title: "Avg. Performance",
      value: "8.2/10",
      change: "+2.3%",
      color: "text-green-500",
      lastYear: 7.5,
    },
    {
      title: "Employee Sentiment",
      value: "7.5/10",
      change: "+1.8%",
      color: "text-green-500",
      lastYear: 7.1,
    },
    {
      title: "Reviews Completed",
      value: "42/87",
      change: "+12",
      color: "text-emerald-500",
      lastYear: 35,
    },
    {
      title: "Active Employees",
      value: "24",
      change: "+3",
      color: "text-green-500",
      lastYear: 21,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Performance Dashboard</h1>
        <Button color="primary" variant="solid">
          Generate Report
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
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
                      <p className={`text-sm mt-1 ${metric.color}`}>
                        {metric.change}
                      </p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      Compared to {metric.lastYear} last year
                    </span>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Resource Usage Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
        {resourceUsage.map((resource, index) => (
          <Card key={index} className="overflow-hidden bg-[#1e1e1e]">
            <CardHeader className="pb-0 pt-4 px-4">
              <h2 className="text-lg font-semibold">{resource.title}</h2>
            </CardHeader>
            <CardBody className="px-2 py-1 flex items-center justify-center overflow-hidden">
              {isLoading ? (
                <Skeleton className="h-[200px] w-full rounded-lg" />
              ) : (
                <ResourceGauce
                  title={resource.title}
                  value={resource.used}
                  total={resource.total}
                  color={resource.color}
                />
              )}
            </CardBody>
            <CardFooter className="px-4 pb-2 text-xs text-gray-500">
              <Link to={"/"}>
                Reached {Math.round((resource.used / resource.total) * 100)}% of
                the current usages. Please{" "}
                <span className="text-primary">upgrade</span> for more resources
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 auto-rows-[minmax(400px,auto)]">
        {/* Sentiment vs Performance */}
        <Card className="col-span-1 md:col-span-2 xl:col-span-3 bg-[#1e1e1e]">
          <CardHeader className="pb-0 pt-4 px-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Sentiment vs Performance Trend
            </h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-[#3B82F6]"></span>
                <span className="text-gray-600 text-sm">Avg. Performance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-[#10B981]"></span>
                <span className="text-gray-600 text-sm">Company Sentiment</span>
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-2 py-1 overflow-hidden">
            {isLoading ? (
              <Skeleton className="h-[350px] w-full rounded-lg" />
            ) : (
              <SentimentPerformanceChart />
            )}
          </CardBody>
          <CardFooter className="px-4 pb-2 text-xs text-gray-500">
            Monthly correlation between employee performance scores and company
            sentiment analysis
          </CardFooter>
        </Card>

        {/* Review Status */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-1 bg-[#1e1e1e] overflow-hidden">
          <CardHeader className="pb-0 pt-4 px-4">
            <h2 className="text-lg font-semibold">Review Distribution</h2>
          </CardHeader>
          <CardBody className="px-2 overflow-hidden">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full rounded-lg" />
            ) : (
              <ReviewStatusChart />
            )}
          </CardBody>
          <CardFooter className="px-4 pb-2 text-xs text-gray-500">
            Status of performance reviews across teams
          </CardFooter>
        </Card>

        {/* Criteria Performance */}
        <Card className="col-span-1 md:col-span-2 bg-[#1e1e1e]">
          <CardHeader className="pb-0 pt-4 px-4">
            <h2 className="text-lg font-semibold">
              Evaluation Criteria Performance
            </h2>
          </CardHeader>
          <CardBody className="px-2">
            {isLoading ? (
              <Skeleton className="h-[350px] w-full rounded-lg" />
            ) : (
              <CriteriaChart />
            )}
          </CardBody>
          <CardFooter className="px-4 pb-2 text-xs text-gray-500">
            Performance across key evaluation criteria
          </CardFooter>
        </Card>

        {/* Monthly Performance */}
        <Card className="col-span-1 md:col-span-2 xl:col-span-2  bg-[#1e1e1e]">
          <CardHeader className="pb-0 pt-4 px-4">
            <h2 className="text-lg font-semibold">Monthly Performance Trend</h2>
          </CardHeader>
          <CardBody className="px-2">
            {isLoading ? (
              <Skeleton className="h-[350px] w-full rounded-lg" />
            ) : (
              <MonthlyPerformanceChart />
            )}
          </CardBody>
          <CardFooter className="px-4 pb-2 text-xs text-gray-500">
            2024 monthly performance progression
          </CardFooter>
        </Card>

        {/* Employee Sentiment Correlation */}
        <Card className="col-span-1 md:col-span-2 xl:col-span-4  bg-[#1e1e1e]">
          <CardHeader className="pb-0 pt-4 px-4">
            <h2 className="text-lg font-semibold">
              Employee Sentiment-Performance Correlation
            </h2>
          </CardHeader>
          <CardBody className="px-2">
            {isLoading ? (
              <Skeleton className="h-[350px] w-full rounded-lg" />
            ) : (
              <EmployeeSentimentChart />
            )}
          </CardBody>
          <CardFooter className="px-4 pb-2 text-xs text-gray-500">
            Relationship between individual sentiment scores and performance
            metrics
          </CardFooter>
        </Card>

        {/* Role-Based Sentiment */}
        <Card className="col-span-1 md:col-span-2 xl:col-span-4  bg-[#1e1e1e]">
          <CardHeader className="pb-0 pt-4 px-4">
            <h2 className="text-lg font-semibold">
              Role-Based Sentiment Distribution
            </h2>
          </CardHeader>
          <CardBody className="px-2">
            {isLoading ? (
              <Skeleton className="h-[350px] w-full rounded-lg" />
            ) : (
              <RoleSentimentChart />
            )}
          </CardBody>
          <CardFooter className="px-4 pb-2 text-xs text-gray-500">
            Sentiment analysis distribution across different roles
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
