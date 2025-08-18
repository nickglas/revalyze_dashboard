import CriteriaBarChart from "@/components/charts/CriteriaBarChart";
import MonthlyPerformanceChart from "@/components/charts/monthlyPerformanceChart";
import { ResourceGauce } from "@/components/charts/ResourceGauge";
import TeamsBarChart from "@/components/charts/TeamBarChart";
import { useInsightStore } from "@/store/insightStore";
import { Button } from "@heroui/button";
import { Divider, Select, SelectItem } from "@heroui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [filterKey, setFilterKey] = useState<"day" | "week" | "month" | "year">(
    "month"
  );
  const {
    isLoadingTrends,
    isLoadingCriteriaSummary,
    criteriaSummary,
    fetchCriteriaSummary,
    isloadingDasboardLimitData,
    getDashboardLimitData,
    dashboardLimitData,
    dashboardTeamData,
    getDashboardTeamData,
    isloadingdashboardTeamData,
  } = useInsightStore();

  useEffect(() => {
    fetchCriteriaSummary(filterKey);
  }, [filterKey]);

  useEffect(() => {
    getDashboardLimitData();
    getDashboardTeamData();
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {dashboardLimitData && (
          <>
            {/* First 3: percentage thresholds */}
            <div className="flex flex-col bg-[#1e1e1e] rounded-lg shadow-sm px-4 py-2">
              <h1 className="font-semibold text-xl">Employees</h1>
              <ResourceGauce
                title="Users"
                metric={dashboardLimitData.users}
                type="count"
              />
              <div className="text-center mt-2">
                <p className="text-lg font-semibold">
                  {dashboardLimitData.users.current}
                  <span className="text-gray-500"> of </span>
                  {dashboardLimitData.users.allowed}
                </p>
              </div>

              <Link to={"/company"} className="text-tiny text-gray-500 mt-4">
                Reached{" "}
                {Math.round(
                  (dashboardLimitData.users.current /
                    dashboardLimitData.users.allowed) *
                    100
                )}
                % of the current usages. Please{" "}
                <span className="text-primary">upgrade</span> for more resources
              </Link>
            </div>

            <div className="flex flex-col bg-[#1e1e1e] rounded-lg shadow-sm px-4 py-2">
              <h1 className="font-semibold text-xl">Transcripts</h1>
              <ResourceGauce
                title="Transcripts"
                metric={dashboardLimitData.transcripts}
                type="count"
              />
              <div className="text-center mt-2">
                <p className="text-lg font-semibold">
                  {dashboardLimitData.transcripts.current}
                  <span className="text-gray-500"> of </span>
                  {dashboardLimitData.transcripts.allowed}
                </p>
              </div>
              <Link to={"/company"} className="text-tiny text-gray-500 mt-4">
                Reached{" "}
                {Math.round(
                  (dashboardLimitData.transcripts.current /
                    dashboardLimitData.transcripts.allowed) *
                    100
                )}
                % of the current usages. Please{" "}
                <span className="text-primary">upgrade</span> for more resources
              </Link>
            </div>

            <div className="flex flex-col bg-[#1e1e1e] rounded-lg shadow-sm px-4 py-2">
              <h1 className="font-semibold text-xl">Reviews</h1>
              <ResourceGauce
                title="Reviews"
                metric={dashboardLimitData.reviews}
                type="count"
              />
              <div className="text-center mt-2">
                <p className="text-lg font-semibold">
                  {dashboardLimitData.reviews.current}
                  <span className="text-gray-500"> of </span>
                  {dashboardLimitData.reviews.allowed}
                </p>
              </div>
              <Link to={"/company"} className="text-tiny text-gray-500 mt-4">
                Reached{" "}
                {Math.round(
                  (dashboardLimitData.reviews.current /
                    dashboardLimitData.reviews.allowed) *
                    100
                )}
                % of the current usages. Please{" "}
                <span className="text-primary">upgrade</span> for more resources
              </Link>
            </div>

            {/* Last 2: score thresholds */}
            <div className="flex flex-col bg-[#1e1e1e] rounded-lg shadow-sm px-4 py-2">
              <h1 className="font-semibold text-xl">Performance </h1>
              <ResourceGauce
                title="Performance"
                metric={dashboardLimitData.performance}
                type="score"
              />
              <div className="text-center mt-2">
                <p className="text-lg font-semibold">
                  {dashboardLimitData.performance}
                  <span className="text-gray-500"> of </span>
                  10
                </p>
              </div>
              <Link
                to={"/transcripts"}
                className="text-tiny text-gray-500 mt-4"
              >
                Upload more <span className="text-primary">transcripts</span> or
                submit more <span className="text-primary">reviews</span> to
                boost this score
              </Link>
            </div>

            <div className="flex flex-col bg-[#1e1e1e] rounded-lg shadow-sm px-4 py-2">
              <h1 className="font-semibold text-xl">Sentiment </h1>
              <ResourceGauce
                title="Sentiment"
                metric={dashboardLimitData.sentiment}
                type="score"
              />
              <div className="text-center mt-2">
                <p className="text-lg font-semibold">
                  {dashboardLimitData.sentiment}
                  <span className="text-gray-500"> of </span>
                  10
                </p>
              </div>
              <Link
                to={"/transcripts"}
                className="text-tiny text-gray-500 mt-4"
              >
                Upload more <span className="text-primary">transcripts</span> or
                submit more <span className="text-primary">reviews</span> to
                boost this score
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {criteriaSummary?.map((criterion) => {
          const changeValue = criterion.changePercentage;
          const isPositive = changeValue > 0;
          const isNegative = changeValue < 0;
          const isNeutral = changeValue === 0;

          return (
            <Card
              key={criterion.criterion}
              className="bg-[#1e1e1e] shadow-sm h-full"
            >
              <CardBody className="p-4 flex flex-col justify-between h-full">
                {/* Title Section - Fixed Height */}
                <div className="mb-4">
                  <h3 className="text-foreground text-base font-medium leading-tight min-h-[2.5rem] flex items-center">
                    {criterion.criterion}
                  </h3>
                </div>

                {/* Score and Change Section */}
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-2xl font-bold text-foreground">
                      {criterion.currentScore}/10
                    </p>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        isPositive
                          ? "text-green-500"
                          : isNegative
                            ? "text-red-500"
                            : "text-gray-500"
                      }`}
                    >
                      {/* Arrow Icons */}
                      {isPositive && (
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {isNegative && (
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {isNeutral && (
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span>
                        {isPositive ? "+" : ""}
                        {criterion.changePercentage}%
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">
                    Compared to last {filterKey}
                  </span>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-[#1e1e1e]">
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
        <Card className="bg-[#1e1e1e]">
          <CardHeader className="pb-0 pt-4 px-4">
            <h2 className="text-lg font-semibold">Criteria Performance</h2>
          </CardHeader>
          <CardBody className="px-2">
            <CriteriaBarChart
              criteriaSummary={criteriaSummary}
              filter={filterKey}
            />
          </CardBody>
          <CardFooter className="px-4 pb-2 text-xs text-gray-500">
            Current scores for each criterion
          </CardFooter>
        </Card>
        <Card className="bg-[#1e1e1e]">
          <CardHeader className="pb-0 pt-4 px-4">
            <h2 className="text-lg font-semibold">Teams</h2>
          </CardHeader>
          <CardBody className="px-2">
            <TeamsBarChart teamData={dashboardTeamData} />
          </CardBody>
          <CardFooter className="px-4 pb-2 text-xs text-gray-500">
            Current scores for each team
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
