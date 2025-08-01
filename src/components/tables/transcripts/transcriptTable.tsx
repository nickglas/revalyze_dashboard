import React, { useState } from "react";
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
} from "@heroui/react";
import { SearchIcon } from "@/components/icons";
import { ChevronDownIcon, VerticalDotsIcon } from "../users/userTable";

// Mock transcript data based on your entity model
const transcriptData = {
  data: [
    {
      _id: "687b85ef3d0b6f56ee5cfb76",
      employeeId: "687d23483cb8c1c33f349909",
      employeeName: "Nick Glas",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      externalCompanyId: "687d23483cb8c1c33f349900",
      contactId: "687d23483cb8c1c33f349901",
      contactName: "Sarah Johnson",
      content:
        "We discussed the new project requirements and timeline. The client was very enthusiastic about our proposal and seems ready to move forward.",
      timestamp: "2025-07-20T10:30:00.000Z",
      uploadedBy: "Jane Admin",
      isReviewed: true,
    },
    {
      _id: "687d234d3cb8c1c33f349911",
      employeeId: "687d23483cb8c1c33f349909",
      employeeName: "Nick Glas",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      externalCompanyId: "687d23483cb8c1c33f349900",
      contactId: "687d23483cb8c1c33f349902",
      contactName: "Michael Chen",
      content:
        "Technical support call regarding API integration issues. The client was frustrated with the documentation but appreciated the quick resolution.",
      timestamp: "2025-07-19T14:45:00.000Z",
      uploadedBy: "Jane Admin",
      isReviewed: false,
    },
    {
      _id: "687d234f3cb8c1c33f349916",
      employeeId: "687d23483cb8c1c33f349911",
      employeeName: "Emma Rodriguez",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      externalCompanyId: "687d23483cb8c1c33f349901",
      contactId: "687d23483cb8c1c33f349903",
      contactName: "David Wilson",
      content:
        "Contract renewal discussion. The client requested additional features and extended trial period.",
      timestamp: "2025-07-18T11:20:00.000Z",
      uploadedBy: "Jane Admin",
      isReviewed: false,
    },
    {
      _id: "687d23513cb8c1c33f34991b",
      employeeId: "687d23483cb8c1c33f349911",
      employeeName: "Emma Rodriguez",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      externalCompanyId: "687d23483cb8c1c33f349902",
      contactId: "687d23483cb8c1c33f349904",
      contactName: "Priya Patel",
      content:
        "Complaint about service interruption. Client was very upset about the downtime but calmed down after explanation of the issue.",
      timestamp: "2025-07-17T16:15:00.000Z",
      uploadedBy: "Jane Admin",
      isReviewed: true,
    },
  ],
  meta: {
    total: 4,
    page: 1,
    limit: 10,
    pages: 1,
  },
};

// Map API data to table format
const transcripts = transcriptData.data.map((transcript) => ({
  id: transcript._id,
  employeeName: transcript.employeeName,
  contact: transcript.contactName,
  content:
    transcript.content.substring(0, 100) +
    (transcript.content.length > 100 ? "..." : ""),
  fullContent: transcript.content,
  timestamp: new Date(transcript.timestamp),
  uploadedBy: transcript.uploadedBy,
  isReviewed: transcript.isReviewed,
}));

export const columns = [
  { name: "EMPLOYEE", uid: "employeeName", sortable: true },
  { name: "CONTACT", uid: "contact", sortable: true },
  { name: "CONTENT", uid: "content" },
  { name: "DATE", uid: "timestamp", sortable: true },
  { name: "UPLOADED BY", uid: "uploadedBy", sortable: true },
  { name: "REVIEWED", uid: "isReviewed", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const reviewStatusOptions = [
  { name: "Reviewed", uid: "true" },
  { name: "Not Reviewed", uid: "false" },
];

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const INITIAL_VISIBLE_COLUMNS = [
  "employeeName",
  "contact",
  "content",
  "timestamp",
  "uploadedBy",
  "isReviewed",
  "actions",
];

export default function TranscriptsTable() {
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [reviewFilter, setReviewFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "timestamp",
    direction: "descending",
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredTranscripts = [...transcripts];

    if (hasSearchFilter) {
      filteredTranscripts = filteredTranscripts.filter(
        (transcript) =>
          transcript.employeeName
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          transcript.contact
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          transcript.fullContent
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }

    if (reviewFilter !== "all") {
      filteredTranscripts = filteredTranscripts.filter(
        (transcript) => transcript.isReviewed.toString() === reviewFilter
      );
    }

    return filteredTranscripts;
  }, [transcripts, filterValue, reviewFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      let first: any, second: any;

      if (sortDescriptor.column === "timestamp") {
        first = a.timestamp.getTime();
        second = b.timestamp.getTime();
      } else {
        first = a[sortDescriptor.column as keyof typeof a];
        second = b[sortDescriptor.column as keyof typeof b];
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (transcript: any, columnKey: React.Key) => {
      const cellValue = transcript[columnKey as keyof typeof transcript];

      switch (columnKey) {
        case "employeeName":
          return (
            <div className="flex items-center gap-3">
              <Avatar
                name={transcript.employeeName}
                getInitials={(name: string) =>
                  name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                }
              />
              <span className="font-medium">{transcript.employeeName}</span>
            </div>
          );

        case "contact":
          return (
            <div className="flex items-center gap-3">
              <Avatar
                name={transcript.contact}
                getInitials={(name: string) =>
                  name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                }
              />
              <span className="font-medium">{transcript.contact}</span>
            </div>
          );

        case "content":
          return (
            <Tooltip content={transcript.fullContent}>
              <div className="max-w-[300px] truncate text-gray-600">
                {transcript.content}
              </div>
            </Tooltip>
          );

        case "timestamp":
          return (
            <div className="flex flex-col">
              <p className="font-medium">
                {transcript.timestamp.toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-sm">
                {transcript.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          );

        case "uploadedBy":
          return (
            <div className="flex items-center gap-3">
              <Avatar
                name={transcript.uploadedBy}
                getInitials={(name: string) =>
                  name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                }
              />
              <span>{transcript.uploadedBy}</span>
            </div>
          );

        case "isReviewed":
          return (
            <Chip
              className="capitalize"
              color={transcript.isReviewed ? "success" : "warning"}
              size="sm"
              variant="flat"
            >
              {transcript.isReviewed ? "Reviewed" : "Pending"}
            </Chip>
          );

        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Transcript Actions">
                  <DropdownItem key="view">View</DropdownItem>
                  <DropdownItem key="edit">Edit</DropdownItem>
                  <DropdownItem key="delete">Delete</DropdownItem>
                  <DropdownItem key="review" className="text-primary">
                    Start Review
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );

        default:
          return cellValue;
      }
    },
    []
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) setPage(page + 1);
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by employee, contact, or content..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Review Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Review Status Filter"
                selectedKeys={new Set([reviewFilter])}
                selectionMode="single"
                onSelectionChange={(keys) =>
                  setReviewFilter(String(Array.from(keys)[0] || "all"))
                }
              >
                <DropdownItem key="all">All</DropdownItem>
                <>
                  {reviewStatusOptions.map((status) => (
                    <DropdownItem key={status.uid} className="capitalize">
                      {status.name}
                    </DropdownItem>
                  ))}
                </>
              </DropdownMenu>
            </Dropdown>

            <Button color="primary" endContent={<span>+</span>}>
              Upload Transcript
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Showing {filteredItems.length} of {transcriptData.meta.total}{" "}
            transcripts
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-1"
              onChange={onRowsPerPageChange}
              defaultValue="5"
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
    reviewFilter,
    onSearchChange,
    onRowsPerPageChange,
    filteredItems.length,
  ]);

  const bottomContent = React.useMemo(() => {
    const startItem = (page - 1) * rowsPerPage + 1;
    const endItem = Math.min(page * rowsPerPage, filteredItems.length);

    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {`Showing ${startItem} to ${endItem} of ${filteredItems.length} transcripts`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [
    page,
    pages,
    filteredItems.length,
    rowsPerPage,
    onPreviousPage,
    onNextPage,
  ]);

  // Handler to convert SortDescriptor column to string
  const handleSortChange = (descriptor: {
    column: React.Key;
    direction: "ascending" | "descending";
  }) => {
    setSortDescriptor({
      column: String(descriptor.column),
      direction: descriptor.direction,
    });
  };

  return (
    <Table
      isHeaderSticky
      aria-label="Transcripts table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[500px]",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={handleSortChange}
    >
      <TableHeader columns={headerColumns}>
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
        emptyContent={"No transcripts found"}
        items={sortedItems}
        loadingContent={<Spinner label="Loading transcripts..." />}
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
  );
}
