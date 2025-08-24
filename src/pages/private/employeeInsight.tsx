// pages/EmployeeInsightsPage.tsx
import { useState, useEffect } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useInsightStore } from "@/store/insightStore";
import {
  CategorizedEmployees,
  categorizeEmployees,
} from "@/util/employeeCategorization";
import EmployeeCategoryTable from "@/components/new/EmployeeCategoryTable";
import EmployeeScatterPlot from "@/components/charts/employeeScatterPlot";
import PerformanceDistributionChart from "@/components/charts/performanceDistributionChart";

const initialCategorizedEmployees: CategorizedEmployees = {
  "High Performer, Positive Sentiment": [],
  "High Performer, Needs Support": [],
  "Developing, Positive Attitude": [],
  "Needs Improvement": [],
};

// Main Component
export default function EmployeeInsightsPage() {
  const {
    getDashboardEmployeeData,
    employeeDashboardData,
    isloadingdashboardEmployeeData,
  } = useInsightStore();

  const [categorizedEmployees, setCategorizedEmployees] =
    useState<CategorizedEmployees>(initialCategorizedEmployees);

  useEffect(() => {
    getDashboardEmployeeData();
  }, []);

  useEffect(() => {
    if (employeeDashboardData && employeeDashboardData.length > 0) {
      const categorized = categorizeEmployees(employeeDashboardData);
      setCategorizedEmployees(categorized);
    } else {
      setCategorizedEmployees(initialCategorizedEmployees);
    }
  }, [employeeDashboardData]);

  const categoryDescriptions = {
    "High Performer, Positive Sentiment":
      "Employees with strong performance scores (≥7.5) and positive sentiment (≥7.5). These are your top performers in both sentiment and performance analysis.",
    "High Performer, Needs Support":
      "Employees with strong performance scores (≥7.5) but lower sentiment (<7.5). These employees deliver results but may need support to improve sentiment.",
    "Developing, Positive Attitude":
      "Employees with performance scores needing improvement (<7.5) but positive sentiment (≥7.5). These employees have a great attitude and may benefit from additional training.",
    "Needs Improvement":
      "Employees with performance scores (<7.5) and sentiment (<7.5) needing improvement. These employees may need focused development plans.",
  };

  if (isloadingdashboardEmployeeData) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Employee Dashboard</h1>
          <Button color="primary" variant="solid" isLoading>
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-[#1e1e1e] p-4">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        </div>
        <Button color="primary" variant="solid">
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
        {Object.entries(categorizedEmployees).map(([category, employees]) => (
          <EmployeeCategoryTable
            key={category}
            title={category}
            employees={employees}
            description={
              categoryDescriptions[
                category as keyof typeof categoryDescriptions
              ]
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        <Card className="bg-[#1e1e1e]">
          <CardHeader className="pb-0 pt-4 px-4">
            <h2 className="text-lg font-semibold">
              Employee Sentiment vs Performance
            </h2>
          </CardHeader>
          <CardBody className="px-2">
            <EmployeeScatterPlot employees={employeeDashboardData || []} />
          </CardBody>
          <CardFooter className="px-4 pb-2 text-xs text-gray-500">
            Employee distribution across performance and sentiment scores
          </CardFooter>
        </Card>

        <Card className="bg-[#1e1e1e]">
          <CardHeader className="pb-0 pt-4 px-4">
            <h2 className="text-lg font-semibold">Performance Distribution</h2>
          </CardHeader>
          <CardBody className="px-2">
            <PerformanceDistributionChart
              employees={employeeDashboardData || []}
            />
          </CardBody>
          <CardFooter className="px-4 pb-2 text-xs text-gray-500">
            Distribution of employees across performance score ranges
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
