import SentimentPerformanceChart from "@/components/charts/SentimentPerformanceChart";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [isChartLoading, setIsChartLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching delay
    const timer = setTimeout(() => {
      setIsChartLoading(false);
    }, 1200); // 1.2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Dashboard</h1>
        <Button color="primary" variant="solid">
          Generate report
        </Button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px]">
        {/* Row 1: Full width, height 1 */}
        <div className="col-span-1 rounded-lg border border-default bg-content1 p-4 shadow-sm flex items-center justify-center">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
        </div>

        <div className="col-span-1 rounded-lg border border-default bg-content1 p-4 shadow-sm flex items-center justify-center">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
        </div>

        <div className="col-span-1 rounded-lg border border-default bg-content1 p-4 shadow-sm flex items-center justify-center">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
        </div>

        <div className="col-span-1 rounded-lg border border-default bg-content1 p-4 shadow-sm flex items-center justify-center">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
        </div>

        {/* Sentiment Chart */}
        <div className="row-span-2 col-span-1 md:col-span-3 rounded-lg border border-default">
          <Card className="w-full h-full p-2">
            <CardHeader className="pb-0 pt-2 px-4 justify-between items-center">
              <h2 className="text-xl font-semibold">sentiment analysis</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#3B82F6]"></span>
                  <span className="text-gray-600 text-sm">
                    Avg. employee score
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#10B981]"></span>
                  <span className="text-gray-600 text-sm">
                    Overall sentiment
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardBody className="overflow-visible px-2">
              {isChartLoading ? (
                <Skeleton className="h-[350px] w-full rounded-lg" />
              ) : (
                <SentimentPerformanceChart />
              )}
            </CardBody>
          </Card>
        </div>
        <div className="row-span-1 col-span-1 rounded-lg border border-default bg-content1 p-4 shadow-sm">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
        <div className="row-span-1 col-span-1 rounded-lg border border-default bg-content1 p-4 shadow-sm">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>

        {/* Row 4: Two elements, height 2, width 2 */}
        <div className="row-span-2 col-span-1 md:col-span-2 rounded-lg border border-default bg-content1 p-4 shadow-sm">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
        <div className="row-span-2 col-span-1 md:col-span-2 rounded-lg border border-default bg-content1 p-4 shadow-sm">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      </div>
    </>
  );
}
