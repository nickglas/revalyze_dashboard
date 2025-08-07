import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  User as HeroUser,
} from "@heroui/react";
import { FaTrashCan } from "react-icons/fa6";
import { TeamMemberDTO } from "@/models/dto/create.team.dto";

interface ManagerSelectionProps {
  users: TeamMemberDTO[];
  onManagerToggle?: (userId: string) => void;
  onUserDiscard?: (userId: string) => void;
}

export const ManagerSelection: React.FC<ManagerSelectionProps> = ({
  users,
  onManagerToggle,
  onUserDiscard,
}) => {
  const handleManagerToggle = (userId: string) => {
    if (onManagerToggle) {
      onManagerToggle(userId);
    }
  };

  const handleUserDiscard = (userId: string) => {
    if (onUserDiscard) {
      onUserDiscard(userId);
    }
  };

  return (
    <Table
      aria-label="Team members table"
      removeWrapper
      className="bg-defaul-100"
    >
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn width={80}>MANAGER</TableColumn>
        <TableColumn width={80}>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody emptyContent="No users selected for this team.">
        {users.map((user) => (
          <TableRow key={user.userId}>
            <TableCell>
              <HeroUser
                avatarProps={{
                  size: "sm",
                }}
                name={user.name}
                description={user.email}
                classNames={{
                  name: "text-sm",
                  description: "text-xs text-default-500",
                }}
              />
            </TableCell>
            <TableCell>
              <Checkbox
                size="sm"
                isSelected={user.isManager}
                onValueChange={() => handleManagerToggle(user.userId)}
              />
            </TableCell>
            <TableCell>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                className="min-w-unit-6 w-6 h-6"
                onPress={() => handleUserDiscard(user.userId)}
              >
                <FaTrashCan className="w-3 h-3" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
