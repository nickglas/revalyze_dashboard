// src/components/tables/teams/teamsTable.tsx
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
  Pagination,
  Spinner,
  Avatar,
  Badge,
  Tooltip,
} from "@heroui/react";
import { ChevronDownIcon, SearchIcon } from "../users/userTable";
import AddTeamModal from "@/components/modals/teams/addTeamModal";
// import AddTeamModal from "@/components/modals/teams/addTeamModal";

// Mock data structure
interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  manager: string;
  memberCount: number;
  status: "active" | "inactive" | "archived";
  createdAt: string;
  members: TeamMember[];
}

// Mock data
const teams: Team[] = [
  {
    id: "1",
    name: "Sales Team",
    manager: "Sarah Johnson",
    memberCount: 12,
    status: "active",
    createdAt: "2025-01-15",
    members: [
      { id: "u1", name: "John Doe", role: "Sales Rep" },
      { id: "u2", name: "Jane Smith", role: "Sales Manager" },
    ],
  },
  {
    id: "2",
    name: "Support Team",
    manager: "Michael Chen",
    memberCount: 8,
    status: "active",
    createdAt: "2025-02-20",
    members: [
      { id: "u3", name: "Alex Thompson", role: "Support Specialist" },
      { id: "u4", name: "Emma Wilson", role: "Support Lead" },
    ],
  },
  {
    id: "3",
    name: "Customer Success",
    manager: "Priya Patel",
    memberCount: 6,
    status: "active",
    createdAt: "2025-03-10",
    members: [
      { id: "u5", name: "David Kim", role: "Success Manager" },
      { id: "u6", name: "Taylor Brown", role: "Onboarding Specialist" },
    ],
  },
  {
    id: "4",
    name: "Marketing Team",
    manager: "Jamie Smith",
    memberCount: 5,
    status: "inactive",
    createdAt: "2024-11-05",
    members: [
      { id: "u7", name: "Chris Evans", role: "Marketing Coordinator" },
      { id: "u8", name: "Morgan Reed", role: "Content Specialist" },
    ],
  },
  {
    id: "5",
    name: "Product Development",
    manager: "Alex Rodriguez",
    memberCount: 15,
    status: "active",
    createdAt: "2025-04-22",
    members: [
      { id: "u9", name: "Sam Carter", role: "Frontend Developer" },
      { id: "u10", name: "Jordan Lee", role: "UX Designer" },
    ],
  },
];

export const columns = [
  { name: "TEAM NAME", uid: "name", sortable: true },
  { name: "MANAGER", uid: "manager", sortable: true },
  { name: "MEMBERS", uid: "members", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Inactive", uid: "inactive" },
  { name: "Archived", uid: "archived" },
];

export const memberCountOptions = [
  { name: "Small (1-5)", uid: "small" },
  { name: "Medium (6-10)", uid: "medium" },
  { name: "Large (11+)", uid: "large" },
];

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const statusColorMap = {
  active: "success",
  inactive: "warning",
  archived: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "manager",
  "members",
  "status",
  "actions",
];

export default function TeamsTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sizeFilter, setSizeFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const [showColumnSelector, setShowColumnSelector] = React.useState(false);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredTeams = [...teams];

    if (hasSearchFilter) {
      filteredTeams = filteredTeams.filter(
        (team) =>
          team.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          team.manager.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filteredTeams = filteredTeams.filter(
        (team) => team.status === statusFilter
      );
    }

    if (sizeFilter !== "all") {
      filteredTeams = filteredTeams.filter((team) => {
        if (sizeFilter === "small") return team.memberCount <= 5;
        if (sizeFilter === "medium")
          return team.memberCount > 5 && team.memberCount <= 10;
        if (sizeFilter === "large") return team.memberCount > 10;
        return true;
      });
    }

    return filteredTeams;
  }, [teams, filterValue, statusFilter, sizeFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Team];
      const second = b[sortDescriptor.column as keyof Team];

      // Handle different data types
      if (typeof first === "string" && typeof second === "string") {
        const cmp = first.localeCompare(second);
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

      if (typeof first === "number" && typeof second === "number") {
        const cmp = first - second;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

      // Fallback for dates
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      const cmp = dateA - dateB;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (team: Team, columnKey: string | number) => {
      switch (columnKey) {
        case "name":
          return (
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white">
                    {team.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-semibold">{team.name}</p>
                <p className="text-gray-500 text-sm">ID: {team.id}</p>
              </div>
            </div>
          );
        case "manager":
          return (
            <div className="flex items-center gap-2">
              <Avatar
                size="sm"
                name={team.manager}
                getInitials={(name) =>
                  name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                }
              />
              <span>{team.manager}</span>
            </div>
          );
        case "members":
          return (
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {team.members.slice(0, 3).map((member, index) => (
                  <Tooltip key={index} content={member.name}>
                    <Avatar
                      size="sm"
                      className="border-2 border-white"
                      name={member.name}
                      getInitials={(name) =>
                        name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      }
                    />
                  </Tooltip>
                ))}
                {team.memberCount > 3 && (
                  <Badge className="ml-2">+{team.memberCount - 3} more</Badge>
                )}
              </div>
            </div>
          );
        case "status":
          return (
            <Chip className="capitalize" size="sm" variant="flat">
              {team.status}
            </Chip>
          );
        case "createdAt":
          return new Date(team.createdAt).toLocaleDateString();
        case "actions":
          return (
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="flat">
                Edit
              </Button>
              <Button size="sm" color="danger" variant="flat">
                Archive
              </Button>
            </div>
          );
        default:
          return null;
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

  const toggleColumn = (columnUid: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnUid)) {
        newSet.delete(columnUid);
      } else {
        newSet.add(columnUid);
      }
      return newSet;
    });
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by team or manager..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
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
                closeOnSelect={false}
                selectedKeys={new Set([statusFilter])}
                selectionMode="single"
                onSelectionChange={(keys) =>
                  setStatusFilter((Array.from(keys)[0] as string) || "all")
                }
              >
                <DropdownItem key="all">All Statuses</DropdownItem>
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Team Size
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Size Filter"
                closeOnSelect={false}
                selectedKeys={new Set([sizeFilter])}
                selectionMode="single"
                onSelectionChange={(keys) =>
                  setSizeFilter((Array.from(keys)[0] as string) || "all")
                }
              >
                <DropdownItem key="all">All Sizes</DropdownItem>
                {memberCountOptions.map((size) => (
                  <DropdownItem key={size.uid} className="capitalize">
                    {size.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown
              isOpen={showColumnSelector}
              onOpenChange={setShowColumnSelector}
            >
              <DropdownTrigger>
                <Button variant="flat">Columns</Button>
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

            <AddTeamModal
              users={[
                {
                  id: "1",
                  name: "Nick Glas",
                  email: "nickglas@hotmail.nl",
                  role: "company admin",
                },
                {
                  id: "2",
                  name: "John Doe",
                  email: "johndoe@hotmail.nl",
                  role: "employee",
                },
                {
                  id: "3",
                  name: "Jacky Martens",
                  email: "j.martens@gmail.nl",
                  role: "company admin",
                },
                {
                  id: "4",
                  name: "Hunter Glas",
                  email: "hunter.g@outlook.com",
                  role: "company admin",
                },
              ]}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} teams
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
    sizeFilter,
    visibleColumns,
    onRowsPerPageChange,
    onSearchChange,
    filteredItems.length,
    showColumnSelector,
  ]);

  const bottomContent = React.useMemo(() => {
    const startItem = (page - 1) * rowsPerPage + 1;
    const endItem = Math.min(page * rowsPerPage, filteredItems.length);

    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {`Showing ${startItem} to ${endItem} of ${filteredItems.length} teams`}
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
            isDisabled={page === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={page === pages}
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
      aria-label="Teams table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[582px]",
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
            align={column.uid === "actions" ? "end" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={"No teams found"}
        items={sortedItems}
        loadingContent={<Spinner label="Loading teams..." />}
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
