import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Spinner,
  Avatar,
  Select,
  SelectItem,
} from "@heroui/react";
import { useReviewStore } from "@/store/reviewStore";
import { ReviewSummaryDto } from "@/models/dto/reviews/review.summary.dto";
import {
  ChevronDownIcon,
  SearchIcon,
  VerticalDotsIcon,
} from "../users/userTable";
import AddReviewModal from "@/components/modals/reviews/addReviewModal";

export const ALL_COLUMNS = [
  { name: "EMPLOYEE", uid: "employeeName", sortable: true },
  { name: "CLIENT/COMPANY", uid: "targetName", sortable: true },
  { name: "TYPE", uid: "type", sortable: true },
  { name: "SCORE", uid: "score", sortable: true },
  { name: "SENTIMENT", uid: "sentiment", sortable: true },
  { name: "STATUS", uid: "reviewStatus", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const reviewStatusOptions = [
  { name: "All Statuses", uid: "all" },
  { name: "Not Started", uid: "NOT_STARTED" },
  { name: "Started", uid: "STARTED" },
  { name: "Reviewed", uid: "REVIEWED" },
  { name: "Error", uid: "ERROR" },
];

export const reviewStatusColorMap = {
  NOT_STARTED: "default",
  STARTED: "warning",
  REVIEWED: "success",
  ERROR: "danger",
};

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

interface ReviewTableRow {
  id: string;
  employeeName: string;
  targetName: string;
  type: string;
  score: string;
  sentiment: string;
  reviewStatus: string;
  createdAt: Date;
  original: ReviewSummaryDto;
}

export default function ReviewsTable() {
  const { reviews, meta, isLoading, fetchReviews } = useReviewStore();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
    direction: "descending" as "ascending" | "descending",
  });
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    ALL_COLUMNS.map((col) => col.uid)
  );

  useEffect(() => {
    fetchReviews(
      {
        search: filterValue || undefined,
        reviewStatus: statusFilter !== "all" ? statusFilter : undefined,
        sortBy: sortDescriptor.column,
        sortOrder: sortDescriptor.direction === "ascending" ? "asc" : "desc",
      },
      page,
      rowsPerPage
    );
  }, [
    page,
    rowsPerPage,
    statusFilter,
    filterValue,
    sortDescriptor,
    fetchReviews,
  ]);

  const handleSortChange = (descriptor: any) => {
    setSortDescriptor({
      column: descriptor.column,
      direction: descriptor.direction,
    });
    setPage(1);
  };

  const tableRows = useMemo<ReviewTableRow[]>(() => {
    if (!reviews) return [];

    return reviews.map((review) => {
      let scoreValue: number | undefined;

      switch (review.type) {
        case "both":
          scoreValue = review.overallScore;
          break;
        case "sentiment":
          scoreValue = review.sentimentScore;
          break;
        case "performance":
          scoreValue = review.overallScore;
          break;
        default:
          scoreValue = undefined;
      }

      const scoreDisplay =
        scoreValue !== undefined ? `${scoreValue}/10` : "N/A";

      return {
        id: review._id,
        employeeName: review.employee?.name || "Unknown",
        targetName:
          review.client?.name || review.externalCompany?.name || "Unknown",
        type: capitalize(review.type),
        score: scoreDisplay,
        sentiment: review.sentimentLabel
          ? `${capitalize(review.sentimentLabel)}${review.sentimentScore ? ` (${review.sentimentScore}/10)` : ""}`
          : "N/A",
        reviewStatus: review.reviewStatus,
        createdAt: new Date(review.createdAt),
        original: review,
        scoreValue,
      };
    });
  }, [reviews]);

  // Filter columns based on selection
  const visibleColumns = useMemo(() => {
    return ALL_COLUMNS.filter((column) => selectedColumns.includes(column.uid));
  }, [selectedColumns]);

  const renderCell = useCallback(
    (
      review: ReviewTableRow & { scoreValue?: number },
      columnKey: string | number
    ) => {
      switch (columnKey) {
        case "employeeName":
          return (
            <div className="flex items-center gap-3">
              <Avatar
                name={review.employeeName}
                getInitials={(name) =>
                  name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                }
              />
              <span className="font-medium">{review.employeeName}</span>
            </div>
          );

        case "targetName":
          return (
            <div className="flex items-center gap-3">
              <Avatar
                name={review.targetName}
                getInitials={(name) =>
                  name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                }
              />
              <span className="font-medium">{review.targetName}</span>
            </div>
          );

        case "type":
          return (
            <Chip
              className="capitalize"
              size="sm"
              variant="flat"
              color={
                review.type === "Performance"
                  ? "primary"
                  : review.type === "Sentiment"
                    ? "secondary"
                    : "success"
              }
            >
              {review.type}
            </Chip>
          );

        case "score":
          if (review.scoreValue === undefined) {
            return <span>N/A</span>;
          }

          let colorClass = "";

          if (review.scoreValue >= 7) {
            colorClass = "bg-green-900 text-success-400";
          } else if (review.scoreValue >= 5) {
            colorClass = "bg-yellow-900 text-warning-400";
          } else {
            colorClass = "bg-red-900 text-danger-400";
          }

          return (
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
              >
                <span className="font-semibold">{review.score}</span>
              </div>
            </div>
          );

        case "sentiment":
          return review.original.sentimentLabel ? (
            <Chip
              className="capitalize"
              size="sm"
              variant="flat"
              color={(() => {
                switch (review.original.sentimentLabel) {
                  case "negative":
                    return "danger";
                  case "neutral":
                    return "warning";
                  case "positive":
                    return "success";
                  default:
                    return "primary";
                }
              })()}
            >
              {review.sentiment}
            </Chip>
          ) : (
            <span>N/A</span>
          );

        case "reviewStatus":
          return (
            <Chip
              className="capitalize"
              size="sm"
              variant="flat"
              color={(() => {
                switch (review.original.reviewStatus) {
                  case "ERROR":
                    return "danger";
                  case "NOT_STARTED":
                    return "secondary";
                  case "STARTED":
                    return "primary";
                  case "REVIEWED":
                    return "success";
                  default:
                    return "primary";
                }
              })()}
            >
              {review.reviewStatus?.replace("_", " ")}
            </Chip>
          );

        case "createdAt":
          return (
            <div className="flex flex-col">
              <p className="font-medium">
                {review.createdAt.toLocaleDateString()}
              </p>
              <p className="text-small text-default-500">
                {review.createdAt.toLocaleTimeString()}
              </p>
            </div>
          );

        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Review Actions">
                  <DropdownItem key="view">View Details</DropdownItem>
                  <DropdownItem key="edit">Edit</DropdownItem>
                  <DropdownItem key="delete">Delete</DropdownItem>
                  <DropdownItem
                    key="analyze"
                    className="text-primary"
                    isDisabled={review.reviewStatus === "REVIEWED"}
                  >
                    {review.reviewStatus === "NOT_STARTED"
                      ? "Start Analysis"
                      : "Continue Analysis"}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );

        default:
          return null;
      }
    },
    []
  );

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newRowsPerPage = Number(e.target.value);
      setRowsPerPage(newRowsPerPage);
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by employee, client, or company..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon />} variant="flat">
                  Review Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Review Status Filter"
                selectedKeys={new Set([statusFilter])}
                selectionMode="single"
                onSelectionChange={(keys) =>
                  setStatusFilter(String(Array.from(keys)[0] || "all"))
                }
              >
                {reviewStatusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Select
              selectionMode="multiple"
              placeholder="Select columns"
              className="max-w-[150px] rounded-md"
              size="md"
              selectedKeys={selectedColumns}
              onSelectionChange={(keys) =>
                setSelectedColumns(Array.from(keys as Set<string>))
              }
            >
              {ALL_COLUMNS.map((column) => (
                <SelectItem key={column.uid}>{column.name}</SelectItem>
              ))}
            </Select>
            <AddReviewModal />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {isLoading
              ? "Loading reviews..."
              : `Showing ${reviews?.length || 0} of ${meta?.total || 0} reviews`}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-1"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    onSearchChange,
    onRowsPerPageChange,
    reviews,
    isLoading,
    meta?.total,
    rowsPerPage,
    selectedColumns,
  ]);

  const bottomContent = useMemo(() => {
    if (isLoading) return null;

    const startItem = meta ? (meta.page - 1) * meta.limit + 1 : 0;
    const endItem = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;
    const total = meta?.total || 0;

    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {`Showing ${startItem} to ${endItem} of ${total} reviews`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={meta?.pages || 1}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={page === 1}
            size="sm"
            variant="flat"
            onPress={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            isDisabled={page === (meta?.pages || 1)}
            size="sm"
            variant="flat"
            onPress={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [page, isLoading, meta]);

  return (
    <div>
      <Table
        isHeaderSticky
        aria-label="Reviews table"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[550px]",
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={handleSortChange}
      >
        <TableHeader columns={visibleColumns}>
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
          emptyContent={isLoading ? " " : "No reviews found"}
          items={isLoading ? [] : tableRows}
          loadingContent={<Spinner label="Loading reviews..." />}
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
