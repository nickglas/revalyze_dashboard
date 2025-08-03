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
} from "@heroui/react";
import { SearchIcon } from "@/components/icons";
import { ChevronDownIcon, VerticalDotsIcon } from "../users/userTable";
import AddCriteriaModal from "@/components/modals/criteria/addCriteriaModal";
import { useCriteriaStore } from "@/store/criteriaStore";
import { Criterion } from "@/models/api/criteria.api.model";
import { useDisclosure } from "@heroui/modal";
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
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");

  const handleSortChange = (descriptor: any) => {
    setSortDescriptor({
      column: String(descriptor.column),
      direction: descriptor.direction,
    });
  };

  const {
    isOpen: isViewModalOpen,
    onOpen: onViewModalOpen,
    onOpenChange: onViewModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditModalOpenChange,
  } = useDisclosure();

  const [selectedCriterion, setSelectedCriterion] = useState<Criterion | null>(
    null
  );

  const handleEdit = (criterion: Criterion) => {
    setSelectedCriterion(criterion);
    onEditModalOpen();
  };

  const handleView = (criterion: Criterion) => {
    setSelectedCriterion(criterion);
    onViewModalOpen();
  };

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = useState(1);

  // Fetch criteria only if store is empty
  useEffect(() => {
    if (!storeCriteria) {
      fetchCriteria();
    }
  }, [storeCriteria, fetchCriteria]);

  // Use original criteria directly
  const criteria = storeCriteria || [];

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredCriteria = [...criteria];

    if (hasSearchFilter) {
      filteredCriteria = filteredCriteria.filter(
        (criterion) =>
          criterion.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          criterion.description
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filteredCriteria = filteredCriteria.filter((criterion) =>
        statusFilter === "active" ? criterion.isActive : !criterion.isActive
      );
    }

    return filteredCriteria;
  }, [criteria, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let first: any, second: any;

      // Handle sorting for each column using original model properties
      switch (sortDescriptor.column) {
        case "title":
        case "description":
          first = a[sortDescriptor.column];
          second = b[sortDescriptor.column];
          break;
        case "isActive":
          first = a.isActive ? 1 : 0;
          second = b.isActive ? 1 : 0;
          break;
        case "createdAt":
          first = new Date(a.createdAt).getTime();
          second = new Date(b.createdAt).getTime();
          break;
        default:
          first = 0;
          second = 0;
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

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
    [toggleCriterionStatus]
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
            placeholder="Search by title or description..."
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
              : `Showing ${filteredItems.length} of ${meta?.total || 0} criteria`}
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
    isLoading,
    meta?.total,
  ]);

  const bottomContent = React.useMemo(() => {
    if (isLoading) return null;

    const startItem = (page - 1) * rowsPerPage + 1;
    const endItem = Math.min(page * rowsPerPage, filteredItems.length);

    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {`Showing ${startItem} to ${endItem} of ${filteredItems.length} criteria`}
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
    isLoading,
  ]);

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
          emptyContent={isLoading ? " " : "No criteria found"}
          items={isLoading ? [] : sortedItems}
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
        isOpen={isViewModalOpen}
        onOpenChange={onViewModalOpenChange}
        criterion={selectedCriterion}
      />
      <EditCriteriaModal
        isOpen={isEditModalOpen}
        onOpenChange={onEditModalOpenChange}
        criterion={selectedCriterion}
      />
    </>
  );
}
