import MonthlyPerformanceChart from "@/components/charts/monthlyPerformanceChart";
import { ResourceGauce } from "@/components/charts/ResourceGauge";
import { useInsightStore } from "@/store/insightStore";
import { Button } from "@heroui/button";
import { Divider, Select, SelectItem, Skeleton } from "@heroui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [filterKey, setFilterKey] = useState<"day" | "week" | "month" | "year">(
    "month"
  );
  const { isLoadingTrends } = useInsightStore();

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((x, i) => (
          <Card className="overflow-hidden bg-[#1e1e1e]">
            <CardHeader className="pb-0 pt-4 px-4">
              <h2 className="text-lg font-semibold">Users</h2>
            </CardHeader>
            <CardBody className="px-2 py-1 flex items-center justify-center overflow-hidden">
              {isLoading ? (
                <Skeleton className="h-[200px] w-full rounded-lg" />
              ) : (
                <ResourceGauce
                  title={"Users"}
                  value={66}
                  total={100}
                  color={"yellow"}
                />
              )}
            </CardBody>
            <CardFooter className="px-4 pb-2 text-gray-500">
              <Link to={"/"} className="text-tiny">
                Reached {Math.round((66 / 100) * 100)}% of the current usages.
                Please <span className="text-primary">upgrade</span> for more
                resources
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-[#1e1e1e] shadow-sm">
            <CardBody className="p-4">
              {isLoading ? (
                <Skeleton className="h-6 w-3/4 rounded-lg" />
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <h3 className="text-foreground text-lg font-medium">
                      Empathie
                    </h3>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">7/10</p>
                      <p className={`text-sm mt-1 text-green-500`}>+1.6</p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      Compared to last filter
                    </span>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2 xl:col-span-2  bg-[#1e1e1e]">
          <CardHeader className="pb-0 pt-4 px-4">
            <h2 className="text-lg font-semibold">Monthly Performance Trend</h2>
          </CardHeader>
          <CardBody className="px-2">
            <CardBody className="px-2">
              <MonthlyPerformanceChart filter={filterKey} />
            </CardBody>
          </CardBody>
          <CardFooter className="px-4 pb-2 text-xs text-gray-500">
            2024 monthly performance progression
          </CardFooter>
        </Card>
      </div>

      <Divider className="h-4" />
    </div>
  );
}
