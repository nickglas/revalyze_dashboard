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

interface ContactTableRow {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  company: string;
  isActive: boolean;
  createdAt: Date;
  original: Contact;
}

export default function ExternalContactsTable() {
  const { contacts, meta, isLoading, fetchContacts, toggleContactStatus } =
    useContactStore();
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

  // Fetch data when parameters change
  useEffect(() => {
    fetchContacts(
      {
        name: filterValue || undefined,
        email: filterValue || undefined,
        phone: filterValue || undefined,
        position: filterValue || undefined,
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
    fetchContacts,
  ]);

  const handleSortChange = (descriptor: any) => {
    setSortDescriptor({
      column: descriptor.column,
      direction: descriptor.direction,
    });
    setPage(1);
  };

  // Map API data to table format
  const tableRows = useMemo<ContactTableRow[]>(() => {
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
      isActive: contact.isActive,
      createdAt: new Date(contact.createdAt),
      original: contact,
    }));
  }, [contacts]);

  const renderCell = useCallback(
    (contact: ContactTableRow, columnKey: string | number) => {
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

        case "isActive":
          return (
            <div className="flex items-center gap-3">
              <Switch
                onValueChange={() => toggleContactStatus(contact.original)}
                isSelected={contact.isActive}
                color="success"
              />
              <Chip
                className="capitalize p-2 min-w-20 text-center"
                color={contact.isActive ? "success" : "danger"}
                size="sm"
                variant="flat"
              >
                {contact.isActive ? "active" : "inactive"}
              </Chip>
            </div>
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
                    <VerticalDotsIcon />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Contact Actions">
                  <DropdownItem
                    key="view"
                    onPress={() => handleView(contact.original)}
                  >
                    View Details
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    onPress={() => handleEdit(contact.original)}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem key="transcripts">
                    View Transcripts
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
            placeholder="Search by name, email, position, or company..."
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

            <AddExternalContactModal />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {isLoading
              ? "Loading contacts..."
              : `Showing ${contacts?.length || 0} of ${meta?.total || 0} contacts`}
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
    contacts,
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
          {`Showing ${startItem} to ${endItem} of ${total} contacts`}
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
        aria-label="External Contacts table"
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
          emptyContent={isLoading ? " " : "No contacts found"}
          items={isLoading ? [] : tableRows}
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
