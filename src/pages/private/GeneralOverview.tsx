import { useInsightStore } from "@/store/insightStore";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function CompanyDashboardPage() {
  const { dailyTrendMetrics, getDailyTrendMetrics } = useInsightStore();

  const [filter, setFilter] = useState("month");

  useEffect(() => {
    getDailyTrendMetrics("month");
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold">Performance Dashboard</h1>
        <div className="flex items-center">
          <Select
            label="Select role"
            placeholder="Select a role"
            labelPlacement="outside"
          >
            <SelectItem key="a">a</SelectItem>
          </Select>
          <Button color="primary" variant="solid">
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
}
