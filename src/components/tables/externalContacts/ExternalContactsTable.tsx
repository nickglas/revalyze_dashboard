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
  useDisclosure,
} from "@heroui/react";
import { SearchIcon } from "@/components/icons";
import { ChevronDownIcon, VerticalDotsIcon } from "../users/userTable";
import { useContactStore } from "@/store/contactStore";
import { Contact } from "@/models/api/contact.api.model";
import ViewExternalContactModal from "@/components/modals/contacts/viewExternalContactModal";
import EditExternalContactModal from "@/components/modals/contacts/editExternalContactModal";
import AddExternalContactModal from "@/components/modals/contacts/addExternalContactModal";

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
  const { contacts, meta, isLoading, fetchContacts } = useContactStore();
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

  // Modal controls
  const viewModal = useDisclosure();
  const editModal = useDisclosure();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Handle view action
  const handleView = (contact: Contact) => {
    setSelectedContact(contact);
    viewModal.onOpen();
  };

  // Handle edit action
  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    editModal.onOpen();
  };

  // Fetch data only if store is empty
  useEffect(() => {
    if (!contacts || contacts.length === 0) {
      fetchContacts(1, 1000); // Fetch all contacts for client-side filtering
    }
  }, [contacts, fetchContacts]);

  // Map API data to table format
  const externalContacts = React.useMemo(() => {
    if (!contacts) return [];
    return contacts.map((contact) => ({
      id: contact._id,
      name: `${contact.firstName} ${contact.lastName}`,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      position: contact.position,
      company: contact.externalCompany?.name || "Unknown Company",
      status: contact.isActive ? "active" : "inactive",
      createdAt: new Date(contact.createdAt),
      rawContact: contact, // Keep reference to original contact
    }));
  }, [contacts]);

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
          <div className="flex items-center gap-2">
            <Avatar name={contact.company} />
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
                <DropdownItem
                  key="view"
                  onPress={() => handleView(contact.rawContact)}
                >
                  View Details
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  onPress={() => handleEdit(contact.rawContact)}
                >
                  Edit
                </DropdownItem>
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

            <AddExternalContactModal />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {isLoading
              ? "Loading contacts..."
              : `Showing ${filteredItems.length} of ${meta?.total || 0} contacts`}
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
    isLoading,
  ]);

  return (
    <>
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
          emptyContent={isLoading ? " " : "No contacts found"}
          items={isLoading ? [] : sortedItems}
          loadingContent={<Spinner label="Loading contacts..." />}
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
      <ViewExternalContactModal
        isOpen={viewModal.isOpen}
        onOpenChange={viewModal.onOpenChange}
        contact={selectedContact}
      />

      {/* Edit Modal */}
      <EditExternalContactModal
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        contact={selectedContact}
      />
    </>
  );
}
