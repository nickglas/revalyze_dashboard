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
  Tooltip,
  Badge,
  Select,
  SelectItem,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useTranscriptStore } from "@/store/transcriptStore";
import { Transcript } from "@/models/api/transcript.api.model";
import {
  ReviewStatus,
  TranscriptSummaryDto,
} from "@/models/dto/transcripts/transcript.summary.dto";
import AddTranscriptModal from "@/components/modals/transcripts/addTranscriptModal";

// Icons
export const SearchIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export const ChevronDownIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
  >
    <path
      d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
    />
  </svg>
);

export const VerticalDotsIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
  >
    <path
      d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="currentColor"
    />
  </svg>
);

export const ALL_COLUMNS = [
  { name: "EMPLOYEE", uid: "employeeName", sortable: true },
  { name: "CONTACT", uid: "contactName", sortable: true },
  { name: "CONTENT", uid: "contentPreview" },
  { name: "DATE", uid: "timestamp", sortable: true },
  { name: "UPLOADED BY", uid: "uploadedByName", sortable: true },
  { name: "REVIEW STATUS", uid: "reviewStatus", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const reviewStatusOptions = [
  { name: "All Statuses", uid: "all" },
  { name: "Not Started", uid: "NOT_STARTED" },
  { name: "In Progress", uid: "IN_PROGRESS" },
  { name: "Completed", uid: "COMPLETED" },
];

export const reviewStatusColorMap = {
  NOT_STARTED: "default",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  ERROR: "danger",
};

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

interface TranscriptTableRow {
  id: string;
  employeeName: string;
  contactName: string;
  contentPreview: string;
  uploadedByName: string;
  timestamp: Date;
  reviewStatus: ReviewStatus;
  isReviewed: boolean;
  original: TranscriptSummaryDto;
}

export default function TranscriptsTable() {
  const { transcripts, meta, isLoading, fetchTranscripts } =
    useTranscriptStore();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "timestamp",
    direction: "descending" as "ascending" | "descending",
  });
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    ALL_COLUMNS.map((col) => col.uid)
  );

  // Full content modal
  const contentModal = useDisclosure();
  const [selectedTranscript, setSelectedTranscript] =
    useState<TranscriptSummaryDto | null>(null);

  // Fetch data when parameters change
  useEffect(() => {
    fetchTranscripts(
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
    fetchTranscripts,
  ]);

  const handleSortChange = (descriptor: any) => {
    setSortDescriptor({
      column: descriptor.column,
      direction: descriptor.direction,
    });
    setPage(1);
  };

  // Map API data to table format
  const tableRows = useMemo<TranscriptTableRow[]>(() => {
    if (!transcripts) return [];

    return transcripts.map((transcript) => ({
      id: transcript.id,
      employeeName: transcript.employeeName || "Unknown",
      contactName: transcript.contactName || "Unknown",
      contentPreview: transcript.contentPreview,
      uploadedByName: transcript.uploadedByName || "Unknown", // Changed to match DTO
      timestamp: new Date(transcript.timestamp),
      reviewStatus: transcript.reviewStatus,
      isReviewed: transcript.isReviewed,
      original: transcript, // Store original data
    }));
  }, [transcripts]);

  // Filter columns based on selection
  const visibleColumns = useMemo(() => {
    return ALL_COLUMNS.filter((column) => selectedColumns.includes(column.uid));
  }, [selectedColumns]);

  // Handle view full content
  const handleViewContent = (transcript: TranscriptSummaryDto) => {
    setSelectedTranscript(transcript);
    contentModal.onOpen();
  };

  const renderCell = useCallback(
    (transcript: TranscriptTableRow, columnKey: string | number) => {
      switch (columnKey) {
        case "employeeName":
          return (
            <div className="flex items-center gap-3">
              <Avatar
                name={transcript.employeeName}
                getInitials={(name) =>
                  name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                }
              />
              <span className="font-medium">{transcript.employeeName}</span>
            </div>
          );

        case "contactName":
          return (
            <div className="flex items-center gap-3">
              <Avatar
                name={transcript.contactName}
                getInitials={(name) =>
                  name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                }
              />
              <span className="font-medium">{transcript.contactName}</span>
            </div>
          );

        case "contentPreview":
          return (
            <div className="max-w-[300px] truncate">
              {transcript.contentPreview}
            </div>
          );

        case "timestamp":
          return (
            <div className="flex flex-col">
              <p className="font-medium">
                {transcript.timestamp.toLocaleDateString()}
              </p>
            </div>
          );

        case "uploadedByName":
          return (
            <div className="flex items-center gap-3">
              <Avatar
                name={transcript.uploadedByName}
                getInitials={(name) =>
                  name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                }
              />
              <span>{transcript.uploadedByName}</span>
            </div>
          );

        case "reviewStatus":
          return (
            <Chip
              className="capitalize"
              size="sm"
              variant="flat"
              color={transcript.isReviewed ? "success" : "warning"}
            >
              {transcript.reviewStatus?.replace("_", " ")}
            </Chip>
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
                <DropdownMenu aria-label="Transcript Actions">
                  <DropdownItem key="view">View Full Content</DropdownItem>
                  <DropdownItem key="edit">Edit</DropdownItem>
                  <DropdownItem key="delete">Delete</DropdownItem>
                  <DropdownItem key="review" className="text-primary">
                    {transcript.reviewStatus === "NOT_STARTED"
                      ? "Start Review"
                      : "Continue Review"}
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
            placeholder="Search by employee, contact, or content..."
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

            {/* Column Visibility Selector */}
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
            <AddTranscriptModal />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {isLoading
              ? "Loading transcripts..."
              : `Showing ${transcripts?.length || 0} of ${meta?.total || 0} transcripts`}
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
    transcripts,
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
          {`Showing ${startItem} to ${endItem} of ${total} transcripts`}
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
        aria-label="Transcripts table"
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
          emptyContent={isLoading ? " " : "No transcripts found"}
          items={isLoading ? [] : tableRows}
          loadingContent={<Spinner label="Loading transcripts..." />}
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
