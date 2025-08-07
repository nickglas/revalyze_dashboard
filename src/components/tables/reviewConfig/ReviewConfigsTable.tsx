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
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import {
  SearchIcon,
  VerticalDotsIcon,
  ChevronDownIcon,
} from "../users/userTable";
import { useTeamStore } from "@/store/teamStore"; // Assuming this is your review config store
import { ReviewConfig } from "@/models/api/review.config.api.model";
import AddReviewConfigModal from "@/components/modals/reviewConfigs/addReviewConfig";
import EditReviewConfigModal from "@/components/modals/reviewConfigs/editReviewConfig";
import ViewReviewConfigModal from "@/components/modals/reviewConfigs/viewReviewConfig";
import { useReviewConfigStore } from "@/store/reviewConfigStore";

export const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "CRITERIA", uid: "criteria" },
  { name: "MODEL SETTINGS", uid: "modelSettings" },
  { name: "STATUS", uid: "isActive", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Inactive", uid: "inactive" },
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

interface ReviewConfigTableRow {
  id: string;
  name: string;
  criteriaCount: number;
  criteria: string;
  modelSettings: string;
  isActive: boolean;
  createdAt: Date;
  original: ReviewConfig;
}

export default function ReviewConfigsTable() {
  const { reviewConfigs, meta, isLoading, fetchReviewConfigs } =
    useReviewConfigStore();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending" as "ascending" | "descending",
  });

  // Modal controls
  const viewModal = useDisclosure();
  const editModal = useDisclosure();
  const addModal = useDisclosure();
  const [selectedConfig, setSelectedConfig] = useState<ReviewConfig | null>(
    null
  );

  // Handle view action
  const handleView = (config: ReviewConfig) => {
    setSelectedConfig(config);
    viewModal.onOpen();
  };

  // Handle edit action
  const handleEdit = (config: ReviewConfig) => {
    setSelectedConfig(config);
    editModal.onOpen();
  };

  // Fetch data when page, rowsPerPage, or filters change
  useEffect(() => {
    fetchReviewConfigs(
      {
        name: filterValue || undefined,
        isActive:
          statusFilter !== "all" ? statusFilter === "active" : undefined,
        sortBy: sortDescriptor.column,
        sortOrder: sortDescriptor.direction === "ascending" ? "asc" : "desc",
      },
      page,
      rowsPerPage
    );
  }, [page, rowsPerPage, statusFilter, filterValue, sortDescriptor]);

  const handleSortChange = (descriptor: any) => {
    setSortDescriptor({
      column: descriptor.column,
      direction: descriptor.direction,
    });
    setPage(1);
  };

  // Map API data to table format
  const tableRows = useMemo<ReviewConfigTableRow[]>(() => {
    if (!reviewConfigs) return [];

    return reviewConfigs.map((config: ReviewConfig) => {
      const criteriaTitles = config.criteria
        .map((criterion) => criterion.title)
        .join(", ");

      return {
        id: config._id,
        name: config.name,
        criteriaCount: config.criteria.length,
        criteria: criteriaTitles,
        modelSettings: `Temp: ${config.modelSettings.temperature}, Tokens: ${config.modelSettings.maxTokens}`,
        isActive: config.isActive,
        createdAt: new Date(config.createdAt),
        original: config,
      };
    });
  }, [reviewConfigs]);

  const renderCell = useCallback(
    (config: ReviewConfigTableRow, columnKey: string | number) => {
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
              <div className="px-2 py-1 rounded text-foreground text-sm">
                {config.modelSettings}
              </div>
            </div>
          );

        case "isActive":
          return (
            <Chip
              className="capitalize"
              color={config.isActive ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {config.isActive ? "Active" : "Inactive"}
            </Chip>
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
                  <DropdownItem
                    key="view"
                    onPress={() => handleView(config.original)}
                  >
                    View Details
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    onPress={() => handleEdit(config.original)}
                  >
                    Edit Configuration
                  </DropdownItem>
                  <DropdownItem key="delete" className="text-danger">
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );

        default:
          return null;
      }
    },
    [handleView, handleEdit]
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
            placeholder="Search by name or criteria..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
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
                  setStatusFilter(String(Array.from(keys)[0] || "all"))
                }
              >
                <DropdownItem key="all">All Statuses</DropdownItem>
                <>
                  {statusOptions.map((status) => (
                    <DropdownItem key={status.uid} className="capitalize">
                      {capitalize(status.name)}
                    </DropdownItem>
                  ))}
                </>
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" onPress={addModal.onOpen}>
              Create Config
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {isLoading
              ? "Loading configurations..."
              : `Showing ${reviewConfigs?.length || 0} of ${meta?.total || 0} configurations`}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
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
    onRowsPerPageChange,
    onSearchChange,
    reviewConfigs,
    isLoading,
    meta?.total,
    rowsPerPage,
  ]);

  const bottomContent = useMemo(() => {
    if (isLoading) return null;

    const startItem = meta ? (meta.page - 1) * meta.limit + 1 : 0;
    const endItem = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;
    const total = meta?.total || 0;

    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {`Showing ${startItem} to ${endItem} of ${total} configurations`}
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
    <>
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
        onSortChange={handleSortChange}
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
          emptyContent={isLoading ? " " : "No configurations found"}
          items={isLoading ? [] : tableRows}
          loadingContent={<Spinner label="Loading configurations..." />}
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

      <ViewReviewConfigModal
        isOpen={viewModal.isOpen}
        onOpenChange={viewModal.onOpenChange}
        config={selectedConfig}
      />

      <EditReviewConfigModal
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        config={selectedConfig}
      />

      <AddReviewConfigModal
        config={null}
        isOpen={addModal.isOpen}
        onOpenChange={addModal.onOpenChange}
      />
    </>
  );
}
