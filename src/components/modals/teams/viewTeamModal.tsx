import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Chip, Avatar, Badge } from "@heroui/react";
import { Team } from "@/models/api/team.api.model";

interface ViewTeamModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  team: Team | null;
}

export default function ViewTeamModal({
  isOpen,
  onOpenChange,
  team,
}: ViewTeamModalProps) {
  if (!team) return null;

  // Find manager
  const manager = team.users.find((u) => u.isManager)?.user;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Team Details: {team.name}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Team Name
                    </h3>
                    <p className="mt-1 font-medium">{team.name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Status
                    </h3>
                    <Chip
                      className="capitalize mt-1"
                      color={team.isActive ? "success" : "danger"}
                      size="sm"
                      variant="flat"
                    >
                      {team.isActive ? "Active" : "Inactive"}
                    </Chip>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Manager
                    </h3>
                    {manager ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar name={manager.name} size="sm" />
                        <span>{manager.name}</span>
                      </div>
                    ) : (
                      <p className="mt-1 text-gray-500">No manager assigned</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Created At
                    </h3>
                    <p className="mt-1">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700">
                    {team.description || "No description provided"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Team Members ({team.users.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {team.users.map((member) => (
                      <div
                        key={member.user._id}
                        className="flex items-center gap-3 p-2 border rounded-lg"
                      >
                        <Avatar name={member.user.name} />
                        <div>
                          <p className="font-medium">{member.user.name}</p>
                          <p className="text-gray-500 text-sm">
                            {member.user.email}
                          </p>
                        </div>
                        {member.isManager && (
                          <Badge className="ml-auto" color="primary">
                            Manager
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
