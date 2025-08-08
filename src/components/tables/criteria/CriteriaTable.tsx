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
  Switch,
  useDisclosure,
} from "@heroui/react";
import { SearchIcon } from "@/components/icons";
import { ChevronDownIcon, VerticalDotsIcon } from "../users/userTable";
import AddCriteriaModal from "@/components/modals/criteria/addCriteriaModal";
import { useCriteriaStore } from "@/store/criteriaStore";
import { Criterion } from "@/models/api/criteria.api.model";
import ViewCriteriaModal from "@/components/modals/criteria/viewCriteriaModal";
import EditCriteriaModal from "@/components/modals/criteria/editCriteriaModal";

export const columns = [
  { name: "TITLE", uid: "title", sortable: true },
  { name: "DESCRIPTION", uid: "description" },
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
  "title",
  "description",
  "isActive",
  "createdAt",
  "actions",
];

export default function CriteriaTable() {
  const {
    criteria: storeCriteria,
    meta,
    isLoading,
    fetchCriteria,
    toggleCriterionStatus,
  } = useCriteriaStore();

  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
    direction: "descending" as "ascending" | "descending",
  });

  // Modal controls
  const viewModal = useDisclosure();
  const editModal = useDisclosure();
  const [selectedCriterion, setSelectedCriterion] = useState<Criterion | null>(
    null
  );

  // Handle view action
  const handleView = (criterion: Criterion) => {
    setSelectedCriterion(criterion);
    viewModal.onOpen();
  };

  // Handle edit action
  const handleEdit = (criterion: Criterion) => {
    setSelectedCriterion(criterion);
    editModal.onOpen();
  };

  // Fetch data when filters, pagination, or sorting changes
  useEffect(() => {
    fetchCriteria(
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
  }, [
    page,
    rowsPerPage,
    statusFilter,
    filterValue,
    sortDescriptor,
    fetchCriteria,
  ]);

  const handleSortChange = (descriptor: any) => {
    setSortDescriptor({
      column: descriptor.column,
      direction: descriptor.direction,
    });
    setPage(1); // Reset to first page when sorting changes
  };

  const criteria = storeCriteria || [];

  const renderCell = useCallback(
    (criterion: Criterion, columnKey: React.Key) => {
      switch (columnKey) {
        case "title":
          return (
            <div className="flex flex-col">
              <p className="font-bold">{criterion.title}</p>
              <p className="text-gray-500 text-sm">
                ID: {criterion._id.substring(0, 8)}...
              </p>
            </div>
          );

        case "description":
          return (
            <Tooltip content={criterion.description}>
              <div className="max-w-[300px] truncate text-gray-600">
                {criterion.description}
              </div>
            </Tooltip>
          );

        case "isActive":
          return (
            <div className="flex items-center gap-3">
              <Switch
                onValueChange={() => toggleCriterionStatus(criterion)}
                isSelected={criterion.isActive}
                color="success"
              />
              <Chip
                className="capitalize"
                color={criterion.isActive ? "success" : "danger"}
                size="sm"
                variant="flat"
              >
                {criterion.isActive ? "active" : "inactive"}
              </Chip>
            </div>
          );

        case "createdAt":
          const date = new Date(criterion.createdAt);
          return (
            <div className="flex flex-col">
              <p className="font-medium">{date.toLocaleDateString()}</p>
              <p className="text-gray-500 text-sm">
                {date.toLocaleTimeString([], {
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
                <DropdownMenu aria-label="Criterion Actions">
                  <DropdownItem
                    key="view"
                    onPress={() => handleView(criterion)}
                  >
                    View Details
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    onPress={() => handleEdit(criterion)}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem key="reviews">View Reviews</DropdownItem>
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
    [toggleCriterionStatus, handleView, handleEdit]
  );

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newRowsPerPage = Number(e.target.value);
      setRowsPerPage(newRowsPerPage);
      setPage(1); // Reset to first page when rows per page changes
    },
    []
  );

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1); // Reset to first page when search changes
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
            placeholder="Search by title or description..."
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

            <AddCriteriaModal />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {isLoading
              ? "Loading criteria..."
              : `Showing ${criteria.length} of ${meta?.total || 0} criteria`}
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
    criteria.length,
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
          {`Showing ${startItem} to ${endItem} of ${total} criteria`}
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
        aria-label="Evaluation Criteria table"
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
          emptyContent={isLoading ? " " : "No criteria found"}
          items={isLoading ? [] : criteria}
          loadingContent={<Spinner label="Loading criteria..." />}
          loadingState={isLoading ? "loading" : "idle"}
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
      <ViewCriteriaModal
        isOpen={viewModal.isOpen}
        onOpenChange={viewModal.onOpenChange}
        criterion={selectedCriterion}
      />
      <EditCriteriaModal
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        criterion={selectedCriterion}
      />
    </>
  );
}
