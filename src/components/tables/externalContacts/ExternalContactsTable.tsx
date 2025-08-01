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

// Mock data based on contact.entity.ts
const externalContactData = {
  data: [
    {
      _id: "687b85ef3d0b6f56ee5cfb76",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "s.johnson@acme.com",
      phone: "+1 (555) 123-4567",
      position: "Project Manager",
      isActive: true,
      externalCompanyId: "687d23483cb8c1c33f349900",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      createdAt: "2025-07-20T10:30:00.000Z",
      updatedAt: "2025-07-20T10:30:00.000Z",
    },
    {
      _id: "687d234d3cb8c1c33f349911",
      firstName: "Michael",
      lastName: "Chen",
      email: "m.chen@globex.com",
      phone: "+1 (555) 987-6543",
      position: "Technical Director",
      isActive: true,
      externalCompanyId: "687d23483cb8c1c33f349901",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      createdAt: "2025-07-19T14:45:00.000Z",
      updatedAt: "2025-07-19T14:45:00.000Z",
    },
    {
      _id: "687d234f3cb8c1c33f349916",
      firstName: "David",
      lastName: "Wilson",
      email: "d.wilson@initech.com",
      phone: "+1 (555) 456-7890",
      position: "Procurement Specialist",
      isActive: false,
      externalCompanyId: "687d23483cb8c1c33f349902",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      createdAt: "2025-07-18T11:20:00.000Z",
      updatedAt: "2025-07-18T11:20:00.000Z",
    },
    {
      _id: "687d23513cb8c1c33f34991b",
      firstName: "Priya",
      lastName: "Patel",
      email: "p.patel@umbrella.com",
      phone: "+1 (555) 654-3210",
      position: "Research Director",
      isActive: true,
      externalCompanyId: "687d23483cb8c1c33f349903",
      companyId: "687b85ef3d0b6f56ee5cfb74",
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

// Mock external companies for mapping
const externalCompanies: { [key: string]: string } = {
  "687d23483cb8c1c33f349900": "Acme Corporation",
  "687d23483cb8c1c33f349901": "Globex Industries",
  "687d23483cb8c1c33f349902": "Initech Solutions",
  "687d23483cb8c1c33f349903": "Umbrella Corp",
};

// Map API data to table format
const externalContacts = externalContactData.data.map((contact) => ({
  id: contact._id,
  name: `${contact.firstName} ${contact.lastName}`,
  firstName: contact.firstName,
  lastName: contact.lastName,
  email: contact.email,
  phone: contact.phone,
  position: contact.position,
  company: externalCompanies[contact.externalCompanyId] || "Unknown Company",
  status: contact.isActive ? "active" : "inactive",
  createdAt: new Date(contact.createdAt),
}));

export const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "PHONE", uid: "phone", sortable: true },
  { name: "POSITION", uid: "position", sortable: true },
  { name: "COMPANY", uid: "company", sortable: true },
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

const statusColorMap = {
  active: "success",
  inactive: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "email",
  "phone",
  "position",
  "company",
  "status",
  "createdAt",
  "actions",
];

export default function ExternalContactsTable() {
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
    let filteredContacts = [...externalContacts];

    if (hasSearchFilter) {
      filteredContacts = filteredContacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          contact.email.toLowerCase().includes(filterValue.toLowerCase()) ||
          contact.position.toLowerCase().includes(filterValue.toLowerCase()) ||
          contact.company.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filteredContacts = filteredContacts.filter(
        (contact) => contact.status === statusFilter
      );
    }

    return filteredContacts;
  }, [externalContacts, filterValue, statusFilter]);

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

  const renderCell = React.useCallback((contact: any, columnKey: React.Key) => {
    const cellValue = contact[columnKey as keyof typeof contact];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            <Avatar
              name={contact.name}
              getInitials={(name: string) =>
                `${contact.firstName[0]}${contact.lastName[0]}`
              }
            />
            <div>
              <p className="font-medium">{contact.name}</p>
              <p className="text-gray-500 text-sm">{contact.position}</p>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="flex items-center">
            <a
              href={`mailto:${contact.email}`}
              className="text-blue-500 hover:underline"
            >
              {contact.email}
            </a>
          </div>
        );

      case "phone":
        return (
          <div className="flex items-center">
            <a href={`tel:${contact.phone}`} className="text-gray-600">
              {contact.phone}
            </a>
          </div>
        );

      case "position":
        return <div className="text-gray-600">{contact.position}</div>;

      case "company":
        return (
          <div className="flex items-center">
            <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-2">
              <span className="text-xs font-bold">
                {(contact.company as string)
                  .split(" ")
                  .map((w: string) => w[0])
                  .join("")}
              </span>
            </div>
            <span>{contact.company}</span>
          </div>
        );

      case "status":
        return (
          <Chip
            className="capitalize"
            color={
              statusColorMap[contact.status as keyof typeof statusColorMap] as
                | "default"
                | "primary"
                | "secondary"
                | "success"
                | "warning"
                | "danger"
                | undefined
            }
            size="sm"
            variant="flat"
          >
            {contact.status}
          </Chip>
        );

      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="font-medium">
              {contact.createdAt.toLocaleDateString()}
            </p>
            <p className="text-gray-500 text-sm">
              {contact.createdAt.toLocaleTimeString([], {
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
              <DropdownMenu aria-label="Contact Actions">
                <DropdownItem key="view">View Details</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>
                <DropdownItem key="transcripts">View Transcripts</DropdownItem>
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
            placeholder="Search by name, email, position, or company..."
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

            <Button color="primary" endContent={<span>+</span>}>
              Add Contact
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Showing {filteredItems.length} of {externalContactData.meta.total}{" "}
            contacts
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
          {`Showing ${startItem} to ${endItem} of ${filteredItems.length} contacts`}
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
      aria-label="External Contacts table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[500px]",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={(descriptor) =>
        setSortDescriptor({
          column: String(descriptor.column),
          direction: descriptor.direction,
        })
      }
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
        emptyContent={"No contacts found"}
        items={sortedItems}
        loadingContent={<Spinner label="Loading contacts..." />}
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
