import React from "react";
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
} from "@heroui/react";
import { JSX } from "react/jsx-runtime";
import AddUserModal from "@/components/modals/users/addUserModal";

// API data as mock data
const apiData = {
  data: [
    {
      _id: "687b85ef3d0b6f56ee5cfb76",
      email: "TEST@acme.com",
      name: "Jane Admin",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: true,
      role: "company_admin",
      createdAt: "2025-07-19T11:47:59.599Z",
      updatedAt: "2025-07-20T17:28:00.242Z",
      __v: 0,
      metrics: {
        lastCalculated: "2025-07-19T20:51:25.439Z",
        reviewCount: 2,
        overallScore: 9.15,
        sentimentScore: 9.75,
        lastPeriodScores: [
          {
            period: "2025-07",
            overall: 9.15,
            sentiment: 9.75,
          },
        ],
      },
    },
    {
      _id: "687d23483cb8c1c33f349909",
      email: "nickglas@acme.io",
      name: "Nick Glas",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: true,
      role: "employee",
      createdAt: "2025-07-20T17:11:36.563Z",
      updatedAt: "2025-07-20T17:11:36.563Z",
      __v: 0,
    },
    {
      _id: "687d234d3cb8c1c33f349911",
      email: "nickglas@acme.ios",
      name: "Nick Glas",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: true,
      role: "employee",
      createdAt: "2025-07-20T17:11:41.399Z",
      updatedAt: "2025-07-20T17:11:41.399Z",
      __v: 0,
    },
    {
      _id: "687d234f3cb8c1c33f349916",
      email: "nickglas@acme.ioss",
      name: "Nick Glas",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: false,
      role: "employee",
      createdAt: "2025-07-20T17:11:43.324Z",
      updatedAt: "2025-07-20T17:23:06.099Z",
      __v: 0,
    },
    {
      _id: "687d23513cb8c1c33f34991b",
      email: "nickglas@acme.iosss",
      name: "Nick Glas",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: false,
      role: "employee",
      createdAt: "2025-07-20T17:11:45.235Z",
      updatedAt: "2025-07-20T17:21:41.180Z",
      __v: 0,
    },
    {
      _id: "687d23643cb8c1c33f349920",
      email: "nickglas@acme.iossss",
      name: "Nick Glas",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: false,
      role: "employee",
      createdAt: "2025-07-20T17:12:04.560Z",
      updatedAt: "2025-07-20T17:21:31.010Z",
      __v: 0,
    },
    {
      _id: "687d23653cb8c1c33f349925",
      email: "nickglas@acme.iosssss",
      name: "Nick Glas",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: false,
      role: "employee",
      createdAt: "2025-07-20T17:12:05.943Z",
      updatedAt: "2025-07-20T17:20:17.995Z",
      __v: 0,
    },
    {
      _id: "687d23673cb8c1c33f34992a",
      email: "nickglas@acme.iossssss",
      name: "Nick Glas",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: false,
      role: "employee",
      createdAt: "2025-07-20T17:12:07.446Z",
      updatedAt: "2025-07-20T17:20:08.808Z",
      __v: 0,
    },
    {
      _id: "687d23693cb8c1c33f34992f",
      email: "nickglas@acme.iosssssss",
      name: "Nick Glas",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: false,
      role: "employee",
      createdAt: "2025-07-20T17:12:09.015Z",
      updatedAt: "2025-07-20T17:20:01.874Z",
      __v: 0,
    },
    {
      _id: "687d236a3cb8c1c33f349934",
      email: "nickglas@acme.iossssssss",
      name: "Nick Glas",
      companyId: "687b85ef3d0b6f56ee5cfb74",
      isActive: false,
      role: "employee",
      createdAt: "2025-07-20T17:12:10.653Z",
      updatedAt: "2025-07-20T17:19:53.666Z",
      __v: 0,
    },
  ],
  meta: {
    total: 10,
    page: 1,
    limit: 20,
    pages: 1,
  },
};

// Map API data to table format
const users = apiData.data.map((user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.isActive ? "active" : "inactive",
}));

export const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Inactive", uid: "inactive" },
];

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

type VerticalDotsIconProps = {
  size?: number;
  width?: number | string;
  height?: number | string;
  [key: string]: any;
};

export const VerticalDotsIcon = ({
  size = 24,
  width,
  height,
  ...props
}: VerticalDotsIconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="currentColor"
    />
  </svg>
);

export const SearchIcon = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
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

export const ChevronDownIcon = ({ strokeWidth = 1.5, ...otherProps }) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...otherProps}
  >
    <path
      d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={strokeWidth}
    />
  </svg>
);

const statusColorMap = {
  active: "success",
  inactive: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "role", "status", "actions"];

export default function UsersTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (
      user: {
        [x: string]: any;
        name: any;
        email:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | null
          | undefined;
        status: string | number;
      },
      columnKey: string
    ) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{
                radius: "lg",
                name: user.name,
                getInitials: (name) =>
                  name
                    .split(" ")
                    .map((n) => n[0])
                    .join(""),
              }}
              description={user.email}
              name={cellValue}
            />
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {cellValue.replace("_", " ")}
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={user.status === "active" ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
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
                <DropdownMenu>
                  <DropdownItem key="view">View</DropdownItem>
                  <DropdownItem key="edit">Edit</DropdownItem>
                  <DropdownItem key="delete">Delete</DropdownItem>
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

  const onSearchChange = React.useCallback(
    (value: React.SetStateAction<string>) => {
      if (value) {
        setFilterValue(value);
        setPage(1);
      } else {
        setFilterValue("");
      }
    },
    []
  );

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
            placeholder="Search by name..."
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
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <AddUserModal />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
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
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    filteredItems.length,
  ]);

  const bottomContent = React.useMemo(() => {
    const startItem = (page - 1) * rowsPerPage + 1;
    const endItem = Math.min(page * rowsPerPage, filteredItems.length);

    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {`Showing ${startItem} to ${endItem} of ${filteredItems.length} users`}
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
  }, [page, pages, filteredItems.length, rowsPerPage]);

  return (
    <Table
      isHeaderSticky
      aria-label="Users table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
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
        emptyContent={"No users found"}
        items={sortedItems}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, String(columnKey))}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
