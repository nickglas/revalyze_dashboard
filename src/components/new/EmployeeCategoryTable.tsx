// components/EmployeeCategoryTable.tsx
import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Pagination,
  SortDescriptor,
  ChipProps,
} from "@heroui/react";
import { IEmployeeDashboardData } from "@/models/dto/insights/employee.dashboard.insights.dto";

interface EmployeeCategoryTableProps {
  title: string;
  employees?: IEmployeeDashboardData[]; // Make employees optional
  description?: string;
}

const columns = [
  { name: "EMPLOYEE", uid: "employee", sortable: true },
  { name: "PERFORMANCE", uid: "performance", sortable: true },
  { name: "SENTIMENT", uid: "sentiment", sortable: true },
  { name: "REVIEWS", uid: "reviewCount", sortable: true },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  high: "success",
  medium: "warning",
  low: "danger",
};

export default function EmployeeCategoryTable({
  title,
  employees = [],
  description = "",
}: EmployeeCategoryTableProps) {
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "performance",
    direction: "descending",
  });
  const rowsPerPage = 5;

  const safeEmployees = Array.isArray(employees) ? employees : [];

  const getPerformanceStatus = (score: number) => {
    if (score >= 8) return "high";
    if (score >= 6) return "medium";
    return "low";
  };

  const getSentimentStatus = (score: number) => {
    if (score >= 7.5) return "high";
    if (score >= 5) return "medium";
    return "low";
  };

  const pages = Math.ceil(safeEmployees.length / rowsPerPage);

  const sortedItems = useMemo(() => {
    return [...safeEmployees].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof IEmployeeDashboardData];
      const second = b[sortDescriptor.column as keyof IEmployeeDashboardData];

      if (first === undefined || second === undefined) return 0;

      if (typeof first === "number" && typeof second === "number") {
        return sortDescriptor.direction === "descending"
          ? second - first
          : first - second;
      }

      if (typeof first === "string" && typeof second === "string") {
        return sortDescriptor.direction === "descending"
          ? second.localeCompare(first)
          : first.localeCompare(second);
      }

      return 0;
    });
  }, [sortDescriptor, safeEmployees]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedItems.slice(start, start + rowsPerPage);
  }, [page, sortedItems]);

  const renderCell = (
    employee: IEmployeeDashboardData,
    columnKey: React.Key
  ) => {
    switch (columnKey) {
      case "employee":
        return (
          <User
            name={employee.employee?.name || "Unknown"}
            description={employee.employee?.email || ""}
            avatarProps={{
              src: `https://i.pravatar.cc/150?u=${employee.employee?._id || "default"}`,
            }}
          />
        );
      case "performance":
        return (
          <Chip
            className="capitalize"
            color={
              statusColorMap[getPerformanceStatus(employee.avgOverall || 0)]
            }
            size="sm"
            variant="flat"
          >
            {(employee.avgOverall || 0)?.toFixed(1) || "N/A"}
          </Chip>
        );
      case "sentiment":
        return (
          <Chip
            className="capitalize"
            color={
              statusColorMap[getSentimentStatus(employee.avgSentiment || 0)]
            }
            size="sm"
            variant="flat"
          >
            {(employee.avgSentiment || 0)?.toFixed(1) || "N/A"}
          </Chip>
        );
      case "reviewCount":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{employee.reviewCount || 0}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1e1e1e] rounded-lg p-4 flex flex-col h-[550px]">
      <div className="pb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <Table
          aria-label={`Employee table for ${title}`}
          removeWrapper
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          className="h-full"
          bottomContent={
            pages > 1 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={setPage}
                />
              </div>
            ) : null
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={items}
            emptyContent={"No employees found in this category"}
          >
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {safeEmployees.length} employee{safeEmployees.length !== 1 ? "s" : ""}
        {pages > 1 && ` • Page ${page} of ${pages}`}
      </div>
    </div>
  );
}
