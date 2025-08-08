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
  useDisclosure,
  Switch,
} from "@heroui/react";
import {
  ChevronDownIcon,
  SearchIcon,
  VerticalDotsIcon,
} from "../users/userTable";
import { ExternalCompany } from "@/models/api/external.company.model";
import { useExternalCompanyStore } from "@/store/externalCompanyStore";
import AddExternalCompanyModal from "@/components/modals/externalCompanies/addExternalCompanyModal";
import ViewExternalCompanyModal from "@/components/modals/externalCompanies/viewExternalCompanyModal";
import EditExternalCompanyModal from "@/components/modals/externalCompanies/editExternalCompanyModal";

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

interface ExternalCompanyTableRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  createdAt: Date;
  original: ExternalCompany;
}

export default function ExternalCompaniesTable() {
  const {
    companies,
    meta,
    isLoading,
    fetchCompanies,
    toggleExternalCompanyStatus,
  } = useExternalCompanyStore();
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
  const [selectedCompany, setSelectedCompany] =
    useState<ExternalCompany | null>(null);

  // Handle view action
  const handleView = (company: ExternalCompany) => {
    setSelectedCompany(company);
    viewModal.onOpen();
  };

  // Handle edit action
  const handleEdit = (company: ExternalCompany) => {
    setSelectedCompany(company);
    editModal.onOpen();
  };

  // Fetch data when parameters change
  useEffect(() => {
    fetchCompanies(
      {
        name: filterValue || undefined,
        email: filterValue || undefined,
        phone: filterValue || undefined,
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
    fetchCompanies,
  ]);

  const handleSortChange = (descriptor: any) => {
    setSortDescriptor({
      column: descriptor.column,
      direction: descriptor.direction,
    });
    setPage(1);
  };

  // Map API data to table format
  const tableRows = useMemo<ExternalCompanyTableRow[]>(() => {
    if (!companies) return [];

    return companies.map((company) => ({
      id: company._id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address,
      status: company.isActive ? "active" : "inactive",
      createdAt: new Date(company.createdAt),
      original: company,
    }));
  }, [companies]);

  const renderCell = useCallback(
    (company: ExternalCompanyTableRow, columnKey: string | number) => {
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
            <div className="flex items-center gap-3">
              <Switch
                onValueChange={() =>
                  toggleExternalCompanyStatus(company.original)
                }
                isSelected={company.original.isActive}
                color="success"
              />
              <Chip
                className="capitalize p-2 min-w-20 text-center"
                color={company.original.isActive ? "success" : "danger"}
                size="sm"
                variant="flat"
              >
                {company.original.isActive ? "active" : "inactive"}
              </Chip>
            </div>
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
                    <VerticalDotsIcon />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Company Actions">
                  <DropdownItem
                    key="view"
                    onPress={() => handleView(company.original)}
                  >
                    View Details
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    onPress={() => handleEdit(company.original)}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem key="contacts">View Contacts</DropdownItem>
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
    [handleView, handleEdit, toggleExternalCompanyStatus]
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
            placeholder="Search by name, email, or phone..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon />} variant="flat">
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
            {isLoading
              ? "Loading companies..."
              : `Showing ${companies?.length || 0} of ${meta?.total || 0} companies`}
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
    companies,
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
          {`Showing ${startItem} to ${endItem} of ${total} companies`}
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
          emptyContent={isLoading ? " " : "No companies found"}
          items={isLoading ? [] : tableRows}
          loadingContent={<Spinner label="Loading companies..." />}
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

      {/* View Modal */}
      <ViewExternalCompanyModal
        isOpen={viewModal.isOpen}
        onOpenChange={viewModal.onOpenChange}
        company={selectedCompany}
      />

      {/* Edit Modal */}
      <EditExternalCompanyModal
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        company={selectedCompany}
      />
    </>
  );
}
