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
  User,
  Pagination,
  Spinner,
  Switch,
} from "@heroui/react";
import AddUserModal from "@/components/modals/users/addUserModal";
import { useUserStore } from "@/store/userStore";
import { User as UserModel } from "@/models/api/user.api.model";

// Icons
export const VerticalDotsIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
  >
    <path
      d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="currentColor"
    />
  </svg>
);

export const SearchIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export const ChevronDownIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
  >
    <path
      d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
    />
  </svg>
);

export const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "STATUS", uid: "isActive", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Inactive", uid: "inactive" },
];

export const roleOptions = [
  { name: "Employee", uid: "employee" },
  { name: "Company Admin", uid: "company_admin" },
];

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

interface UserTableRow {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  original: UserModel;
}

export default function UsersTable() {
  const { users, meta, isLoading, fetchUsers, toggleUserStatus } =
    useUserStore();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
    direction: "descending" as "ascending" | "descending",
  });

  // Modal controls
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

  // Fetch data when parameters change
  useEffect(() => {
    fetchUsers(
      {
        name: filterValue || undefined,
        email: filterValue || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
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
    roleFilter,
    filterValue,
    sortDescriptor,
    fetchUsers,
  ]);

  const handleSortChange = (descriptor: any) => {
    setSortDescriptor({
      column: descriptor.column,
      direction: descriptor.direction,
    });
    setPage(1);
  };

  // Map API data to table format
  const tableRows = useMemo<UserTableRow[]>(() => {
    if (!users) return [];

    return users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: new Date(user.createdAt),
      original: user,
    }));
  }, [users]);

  const renderCell = useCallback(
    (user: UserTableRow, columnKey: string | number) => {
      switch (columnKey) {
        case "name":
          return (
            <User
              name={user.name}
              description={user.email}
              avatarProps={{
                name: user.name,
                getInitials: (name) =>
                  name
                    .split(" ")
                    .map((n) => n[0])
                    .join(""),
              }}
            />
          );

        case "email":
          return (
            <a
              href={`mailto:${user.email}`}
              className="text-blue-500 hover:underline"
            >
              {user.email}
            </a>
          );

        case "role":
          return (
            <Chip
              className="capitalize"
              color={user.role === "company_admin" ? "primary" : "default"}
              size="sm"
              variant="flat"
            >
              {user.role.replace("_", " ")}
            </Chip>
          );

        case "isActive":
          return (
            <div className="flex items-center gap-3">
              <Switch
                onValueChange={() => toggleUserStatus(user.original)}
                isSelected={user.original.isActive}
                color="success"
              />
              <Chip
                className="capitalize"
                color={user.original.isActive ? "success" : "danger"}
                size="sm"
                variant="flat"
              >
                {user.isActive ? "Active" : "Not active"}
              </Chip>
            </div>
          );

        case "createdAt":
          return (
            <div className="flex flex-col">
              <p className="font-medium">
                {user.createdAt.toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-sm">
                {user.createdAt.toLocaleTimeString([], {
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
                <DropdownMenu aria-label="User Actions">
                  <DropdownItem key="view">View Details</DropdownItem>
                  <DropdownItem key="edit">Edit</DropdownItem>
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
    [toggleUserStatus]
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
            placeholder="Search by name or email..."
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

            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon />} variant="flat">
                  Role
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Role Filter"
                selectedKeys={new Set([roleFilter])}
                selectionMode="single"
                onSelectionChange={(keys) =>
                  setRoleFilter(String(Array.from(keys)[0] || "all"))
                }
              >
                <DropdownItem key="all">All Roles</DropdownItem>
                <>
                  {roleOptions.map((role) => (
                    <DropdownItem key={role.uid} className="capitalize">
                      {capitalize(role.name)}
                    </DropdownItem>
                  ))}
                </>
              </DropdownMenu>
            </Dropdown>

            <AddUserModal />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {isLoading
              ? "Loading users..."
              : `Showing ${users?.length || 0} of ${meta?.total || 0} users`}
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
    roleFilter,
    onSearchChange,
    onRowsPerPageChange,
    users,
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
          {`Showing ${startItem} to ${endItem} of ${total} users`}
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
    <Table
      isHeaderSticky
      aria-label="Users table"
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
        emptyContent={isLoading ? " " : "No users found"}
        items={isLoading ? [] : tableRows}
        loadingContent={<Spinner label="Loading users..." />}
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
  );
}
