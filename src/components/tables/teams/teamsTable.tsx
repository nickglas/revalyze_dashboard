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
  Badge,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import {
  ChevronDownIcon,
  SearchIcon,
  VerticalDotsIcon,
} from "../users/userTable";
import AddTeamModal from "@/components/modals/teams/addTeamModal";
import { useTeamStore } from "@/store/teamStore";
import { Team } from "@/models/api/team.api.model";
import ViewTeamModal from "@/components/modals/teams/viewTeamModal";
import EditTeamModal from "@/components/modals/teams/editTeamModal";

export const columns = [
  { name: "TEAM NAME", uid: "name", sortable: true },
  { name: "MANAGER", uid: "manager", sortable: true },
  { name: "MEMBERS", uid: "members", sortable: true },
  { name: "STATUS", uid: "isActive", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Inactive", uid: "inactive" },
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
  inactive: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "manager",
  "members",
  "isActive",
  "createdAt",
  "actions",
];

interface TeamTableRow {
  id: string;
  name: string;
  manager: string;
  managerId: string;
  memberCount: number;
  isActive: boolean;
  createdAt: Date;
  users: {
    user: {
      _id: string;
      name: string;
      email: string;
    };
    isManager: boolean;
  }[];
  original: Team;
}

export default function TeamsTable() {
  const { teams, meta, isLoading, fetchTeams } = useTeamStore();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending" as "ascending" | "descending",
  });

  // Modal controls
  const viewModal = useDisclosure();
  const editModal = useDisclosure();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Handle view action
  const handleView = (team: Team) => {
    setSelectedTeam(team);
    viewModal.onOpen();
  };

  // Handle edit action
  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    editModal.onOpen();
  };

  // Fetch data when page, rowsPerPage, or filters change
  useEffect(() => {
    fetchTeams(
      {
        name: filterValue || undefined,
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
    fetchTeams,
  ]);

  const handleSortChange = (descriptor: any) => {
    setSortDescriptor({
      column: descriptor.column,
      direction: descriptor.direction,
    });
    setPage(1);
  };

  // Map API data to table format
  const tableRows = useMemo<TeamTableRow[]>(() => {
    if (!teams) return [];

    return teams.map((team) => {
      const manager = team.users.find((u) => u.isManager)?.user;
      return {
        id: team._id,
        name: team.name,
        manager: manager?.name || "No manager",
        managerId: manager?._id || "",
        memberCount: team.users.length,
        isActive: team.isActive,
        createdAt: new Date(team.createdAt),
        users: team.users,
        original: team, // <-- preserve original team
      };
    });
  }, [teams]);

  const renderCell = useCallback(
    (team: TeamTableRow, columnKey: string | number) => {
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
                <p className="text-gray-500 text-sm">
                  ID: {team.id.substring(0, 8)}...
                </p>
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
                {team.users.slice(0, 3).map((member, index) => (
                  <Tooltip key={index} content={member.user.name}>
                    <Avatar
                      size="sm"
                      className="border-2 border-white"
                      name={member.user.name}
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
        case "isActive":
          return (
            <Chip
              className="capitalize"
              size="sm"
              variant="flat"
              color={team.isActive ? "success" : "danger"}
            >
              {team.isActive ? "active" : "inactive"}
            </Chip>
          );
        case "createdAt":
          return (
            <div className="flex flex-col">
              <p className="font-medium">
                {team.createdAt.toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-sm">
                {team.createdAt.toLocaleTimeString([], {
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
                <DropdownMenu>
                  <DropdownItem
                    key="view"
                    onPress={() => handleView(team.original)}
                  >
                    View
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    onPress={() => handleEdit(team.original)}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem key="delete">Delete</DropdownItem>
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
            placeholder="Search by team or manager..."
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
            <AddTeamModal />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {isLoading
              ? "Loading teams..."
              : `Showing ${teams?.length || 0} of ${meta?.total || 0} teams`}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
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
    onRowsPerPageChange,
    onSearchChange,
    teams,
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
          {`Showing ${startItem} to ${endItem} of ${total} teams`}
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
        aria-label="Teams table"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[582px]",
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
              align={column.uid === "actions" ? "end" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={isLoading ? " " : "No teams found"}
          items={isLoading ? [] : tableRows}
          loadingContent={<Spinner label="Loading teams..." />}
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

      <ViewTeamModal
        isOpen={viewModal.isOpen}
        onOpenChange={viewModal.onOpenChange}
        team={selectedTeam}
      />

      <EditTeamModal
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        team={selectedTeam}
      />
    </>
  );
}
