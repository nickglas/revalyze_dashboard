import React, { useState, useEffect } from "react";
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
} from "@heroui/react";
import {
  ChevronDownIcon,
  SearchIcon,
  VerticalDotsIcon,
} from "../users/userTable";
import { ExternalCompany } from "@/models/api/external.company.model";
import { useExternalCompanyStore } from "@/store/externalCompanyStore";
import AddExternalCompanyModal from "@/components/modals/externalCompanies/addExternalCompanyModal";

export const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "PHONE", uid: "phone", sortable: true },
  { name: "ADDRESS", uid: "address" },
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

const statusColorMap: Record<string, "success" | "danger"> = {
  active: "success",
  inactive: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "email",
  "phone",
  "address",
  "status",
  "createdAt",
  "actions",
];

export default function ExternalCompaniesTable() {
  const { companies, meta, isLoading, fetchCompanies } =
    useExternalCompanyStore();
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

  // Fetch data only if store is empty
  useEffect(() => {
    if (!companies || companies.length === 0) {
      fetchCompanies(1, 1000); // Fetch all companies for client-side filtering
    }
  }, [companies, fetchCompanies]);

  // Map API data to table format
  const externalCompanies = React.useMemo(() => {
    if (!companies) return [];
    return companies.map((company) => ({
      id: company._id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address,
      status: company.isActive ? "active" : "inactive",
      createdAt: new Date(company.createdAt),
    }));
  }, [companies]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredCompanies = [...externalCompanies];

    if (hasSearchFilter) {
      filteredCompanies = filteredCompanies.filter(
        (company) =>
          company.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          company.email.toLowerCase().includes(filterValue.toLowerCase()) ||
          company.phone.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filteredCompanies = filteredCompanies.filter(
        (company) => company.status === statusFilter
      );
    }

    return filteredCompanies;
  }, [externalCompanies, filterValue, statusFilter]);

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

  const renderCell = React.useCallback((company: any, columnKey: React.Key) => {
    const cellValue = company[columnKey as keyof typeof company];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            <Avatar
              name={company.name}
              getInitials={(name: string) =>
                name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
              }
            />
            <span className="font-medium">{company.name}</span>
          </div>
        );

      case "email":
        return (
          <div className="flex items-center">
            <a
              href={`mailto:${company.email}`}
              className="text-blue-500 hover:underline"
            >
              {company.email}
            </a>
          </div>
        );

      case "phone":
        return (
          <div className="flex items-center">
            <a href={`tel:${company.phone}`} className="text-gray-600">
              {company.phone}
            </a>
          </div>
        );

      case "address":
        return (
          <Tooltip content={company.address}>
            <div className="max-w-[200px] truncate text-gray-600">
              {company.address}
            </div>
          </Tooltip>
        );

      case "status":
        return (
          <Chip
            className="capitalize"
            color={
              statusColorMap[company.status as keyof typeof statusColorMap]
            }
            size="sm"
            variant="flat"
          >
            {company.status}
          </Chip>
        );

      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="font-medium">
              {company.createdAt.toLocaleDateString()}
            </p>
            <p className="text-gray-500 text-sm">
              {company.createdAt.toLocaleTimeString([], {
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
              <DropdownMenu aria-label="Company Actions">
                <DropdownItem key="view">View Details</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>
                <DropdownItem key="contacts">View Contacts</DropdownItem>
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
            placeholder="Search by name, email, or phone..."
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

            <AddExternalCompanyModal />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Showing {filteredItems.length} of {externalCompanies.length}{" "}
            companies
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
    externalCompanies.length,
  ]);

  const bottomContent = React.useMemo(() => {
    const startItem = (page - 1) * rowsPerPage + 1;
    const endItem = Math.min(page * rowsPerPage, filteredItems.length);

    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {`Showing ${startItem} to ${endItem} of ${filteredItems.length} companies`}
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
      aria-label="External Companies table"
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
        emptyContent={"No companies found"}
        items={sortedItems}
        loadingState={isLoading ? "loading" : "idle"}
        loadingContent={<Spinner label="Loading companies..." />}
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
