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
  Switch,
} from "@heroui/react";
import { SearchIcon } from "@/components/icons";
import { ChevronDownIcon, VerticalDotsIcon } from "../users/userTable";
import AddCriteriaModal from "@/components/modals/criteria/addCriteriaModal";

// Mock data based on criterion.entity.ts
const criteriaData = {
  data: [
    {
      _id: "687b85ef3d0b6f56ee5cfb76",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      title: "Product Knowledge",
      description:
        "Demonstrates thorough understanding of products and services",
      isActive: true,
      createdAt: "2025-07-20T10:30:00.000Z",
      updatedAt: "2025-07-20T10:30:00.000Z",
    },
    {
      _id: "687d234d3cb8c1c33f349911",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      title: "Communication Skills",
      description:
        "Clearly articulates thoughts and actively listens to customers",
      isActive: true,
      createdAt: "2025-07-19T14:45:00.000Z",
      updatedAt: "2025-07-19T14:45:00.000Z",
    },
    {
      _id: "687d234f3cb8c1c33f349916",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      title: "Problem Solving",
      description: "Effectively identifies and resolves customer issues",
      isActive: false,
      createdAt: "2025-07-18T11:20:00.000Z",
      updatedAt: "2025-07-18T11:20:00.000Z",
    },
    {
      _id: "687d23513cb8c1c33f34991b",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      title: "Empathy",
      description: "Shows understanding and compassion for customer situations",
      isActive: true,
      createdAt: "2025-07-17T16:15:00.000Z",
      updatedAt: "2025-07-17T16:15:00.000Z",
    },
    {
      _id: "687d23513cb8c1c33f34991c",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      title: "Efficiency",
      description:
        "Resolves issues in a timely manner without sacrificing quality",
      isActive: true,
      createdAt: "2025-07-16T09:10:00.000Z",
      updatedAt: "2025-07-16T09:10:00.000Z",
    },
  ],
  meta: {
    total: 5,
    page: 1,
    limit: 10,
    pages: 1,
  },
};

// Map API data to table format
const criteria = criteriaData.data.map((criterion) => ({
  id: criterion._id,
  title: criterion.title,
  description: criterion.description,
  status: criterion.isActive ? "active" : "inactive",
  createdAt: new Date(criterion.createdAt),
}));

export const columns = [
  { name: "TITLE", uid: "title", sortable: true },
  { name: "DESCRIPTION", uid: "description" },
  { name: "STATUS", uid: "status", sortable: true },
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

const statusColorMap: Record<
  string,
  | "success"
  | "danger"
  | "default"
  | "primary"
  | "secondary"
  | "warning"
  | undefined
> = {
  active: "success",
  inactive: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "title",
  "description",
  "status",
  "createdAt",
  "actions",
];

export default function CriteriaTable() {
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
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
      filteredCriteria = filteredCriteria.filter(
        (criterion) => criterion.status === statusFilter
      );
    }

    return filteredCriteria;
  }, [criteria, filterValue, statusFilter]);

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
    console.log(`Toggled status for criterion ${id}`);
  };

  const renderCell = React.useCallback(
    (criterion: any, columnKey: React.Key) => {
      const cellValue = criterion[columnKey as keyof typeof criterion];

      switch (columnKey) {
        case "title":
          return (
            <div className="flex flex-col">
              <p className="font-bold">{criterion.title}</p>
              <p className="text-gray-500 text-sm">
                ID: {criterion.id.substring(0, 8)}...
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

        case "status":
          return (
            <div className="flex items-center gap-3">
              <Switch
                isSelected={criterion.status === "active"}
                onValueChange={() => toggleStatus(criterion.id)}
                color="success"
              />
              <Chip
                className="capitalize"
                color={
                  statusColorMap[
                    criterion.status as keyof typeof statusColorMap
                  ]
                }
                size="sm"
                variant="flat"
              >
                {criterion.status}
              </Chip>
            </div>
          );

        case "createdAt":
          return (
            <div className="flex flex-col">
              <p className="font-medium">
                {criterion.createdAt.toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-sm">
                {criterion.createdAt.toLocaleTimeString([], {
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
                  <DropdownItem key="view">View Details</DropdownItem>
                  <DropdownItem key="edit">Edit</DropdownItem>
                  <DropdownItem key="reviews">View Reviews</DropdownItem>
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
            Showing {filteredItems.length} of {criteriaData.meta.total} criteria
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
  ]);

  return (
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
        emptyContent={"No criteria found"}
        items={sortedItems}
        loadingContent={<Spinner label="Loading criteria..." />}
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
