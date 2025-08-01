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
  Tooltip,
  Badge,
  Switch,
} from "@heroui/react";
import { SearchIcon } from "@/components/icons";
import { ChevronDownIcon, VerticalDotsIcon } from "../users/userTable";

// Mock data based on review.config.entity.ts
const reviewConfigData = {
  data: [
    {
      _id: "687b85ef3d0b6f56ee5cfb76",
      name: "Technical Support Review",
      criteriaIds: ["criteria1", "criteria2", "criteria3"],
      modelSettings: {
        temperature: 0.7,
        maxTokens: 1500,
      },
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: true,
      createdAt: "2025-07-20T10:30:00.000Z",
      updatedAt: "2025-07-20T10:30:00.000Z",
    },
    {
      _id: "687d234d3cb8c1c33f349911",
      name: "Sales Performance",
      criteriaIds: ["criteria4", "criteria5"],
      modelSettings: {
        temperature: 0.5,
        maxTokens: 2000,
      },
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: true,
      createdAt: "2025-07-19T14:45:00.000Z",
      updatedAt: "2025-07-19T14:45:00.000Z",
    },
    {
      _id: "687d234f3cb8c1c33f349916",
      name: "Customer Success",
      criteriaIds: ["criteria1", "criteria6", "criteria7", "criteria8"],
      modelSettings: {
        temperature: 0.8,
        maxTokens: 1800,
      },
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: false,
      createdAt: "2025-07-18T11:20:00.000Z",
      updatedAt: "2025-07-18T11:20:00.000Z",
    },
    {
      _id: "687d23513cb8c1c33f34991b",
      name: "Complaint Resolution",
      criteriaIds: ["criteria9", "criteria10"],
      modelSettings: {
        temperature: 0.6,
        maxTokens: 1200,
      },
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: true,
      createdAt: "2025-07-17T16:15:00.000Z",
      updatedAt: "2025-07-17T16:15:00.000Z",
    },
  ],
  meta: {
    total: 4,
    page: 1,
    limit: 10,
    pages: 1,
  },
};

// Mock criteria for display
const criteriaNames = {
  criteria1: "Product Knowledge",
  criteria2: "Technical Accuracy",
  criteria3: "Problem Solving",
  criteria4: "Communication",
  criteria5: "Closing Ability",
  criteria6: "Empathy",
  criteria7: "Customer Retention",
  criteria8: "Upselling",
  criteria9: "Conflict Resolution",
  criteria10: "De-escalation",
};

// Map API data to table format
const reviewConfigs = reviewConfigData.data.map((config) => ({
  id: config._id,
  name: config.name,
  criteriaCount: config.criteriaIds.length,
  criteria: config.criteriaIds.map((id) => criteriaNames[id] || id).join(", "),
  modelSettings: `Temp: ${config.modelSettings.temperature}, Tokens: ${config.modelSettings.maxTokens}`,
  isActive: config.isActive,
  createdAt: new Date(config.createdAt),
}));

export const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "CRITERIA", uid: "criteria" },
  { name: "MODEL SETTINGS", uid: "modelSettings" },
  { name: "STATUS", uid: "isActive", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Active", uid: "true" },
  { name: "Inactive", uid: "false" },
];

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "criteria",
  "modelSettings",
  "isActive",
  "createdAt",
  "actions",
];

export default function ReviewConfigsTable() {
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
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
    let filteredConfigs = [...reviewConfigs];

    if (hasSearchFilter) {
      filteredConfigs = filteredConfigs.filter(
        (config) =>
          config.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          config.criteria.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filteredConfigs = filteredConfigs.filter(
        (config) => config.isActive.toString() === statusFilter
      );
    }

    return filteredConfigs;
  }, [reviewConfigs, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      let first: any, second: any;

      if (sortDescriptor.column === "createdAt") {
        first = a.createdAt.getTime();
        second = b.createdAt.getTime();
      } else {
        first = a[sortDescriptor.column as keyof typeof a];
        second = b[sortDescriptor.column as keyof typeof b];
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const toggleStatus = (id: string) => {
    // In a real app, you would make an API call here
    console.log(`Toggled status for review config ${id}`);
  };

  const renderCell = React.useCallback((config: any, columnKey: React.Key) => {
    const cellValue = config[columnKey as keyof typeof config];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="font-bold">{config.name}</p>
            <p className="text-gray-500 text-sm">
              ID: {config.id.substring(0, 8)}...
            </p>
          </div>
        );

      case "criteria":
        return (
          <div>
            <span>{config.criteriaCount} criteria</span>
            <Tooltip content={config.criteria}>
              <div className="max-w-[250px] truncate text-gray-600 mt-1">
                {config.criteria}
              </div>
            </Tooltip>
          </div>
        );

      case "modelSettings":
        return (
          <div className="flex items-center gap-2">
            <div className=" px-2 py-1 rounded text-foreground text-sm">
              {config.modelSettings}
            </div>
          </div>
        );

      case "isActive":
        return (
          <div className="flex items-center gap-3">
            <Chip
              className="capitalize"
              color={config.isActive ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {config.isActive ? "Active" : "Inactive"}
            </Chip>
          </div>
        );

      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="font-medium">
              {config.createdAt.toLocaleDateString()}
            </p>
            <p className="text-gray-500 text-sm">
              {config.createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
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
              <DropdownMenu aria-label="Review Config Actions">
                <DropdownItem key="view">View Details</DropdownItem>
                <DropdownItem key="edit">Edit Configuration</DropdownItem>
                <DropdownItem key="reviews">View Reviews</DropdownItem>
                <DropdownItem key="duplicate">Duplicate</DropdownItem>
                <DropdownItem key="delete" className="text-danger">
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

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
            placeholder="Search by name or criteria..."
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
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status Filter"
                selectedKeys={new Set([statusFilter])}
                selectionMode="single"
                onSelectionChange={(keys) =>
                  setStatusFilter(Array.from(keys)[0] || "all")
                }
              >
                <DropdownItem key="all">All Statuses</DropdownItem>
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button color="primary" endContent={<span>+</span>}>
              Create Config
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Showing {filteredItems.length} of {reviewConfigData.meta.total}{" "}
            configurations
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
    statusFilter,
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
          {`Showing ${startItem} to ${endItem} of ${filteredItems.length} configurations`}
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

  return (
    <Table
      isHeaderSticky
      aria-label="Review Configurations table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[500px]",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
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
        emptyContent={"No configurations found"}
        items={sortedItems}
        loadingContent={<Spinner label="Loading configurations..." />}
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
