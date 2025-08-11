import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Input, Textarea, Switch, Avatar, Badge } from "@heroui/react";
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

  const manager = team.users.find((u) => u.isManager)?.user;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">View Team</ModalHeader>
            <ModalBody>
              <div className="flex flex-col w-full gap-4">
                <Input
                  label="Team Name"
                  labelPlacement="outside"
                  value={team.name}
                  isDisabled
                />

                <Textarea
                  label="Description"
                  labelPlacement="outside"
                  value={team.description || ""}
                  isDisabled
                />

                <Input
                  label="Manager"
                  labelPlacement="outside"
                  value={manager ? manager.name : "No manager assigned"}
                  isDisabled
                />

                <Input
                  label="Created At"
                  labelPlacement="outside"
                  value={new Date(team.createdAt).toLocaleDateString()}
                  isDisabled
                />

                <Switch isDisabled isSelected={team.isActive}>
                  Active
                </Switch>

                <div>
                  <label className="text-sm font-medium text-gray-500 mb-1">
                    Team Members ({team.users.length})
                  </label>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto ">
                    {team.users.map((member) => (
                      <div
                        key={member.user._id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            className="text-gray-300"
                            name={member.user.name}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium text-sm text-gray-500">
                              {member.user.name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {member.user.email}
                            </p>
                          </div>
                        </div>

                        {member.isManager && (
                          <span className="text-tiny text-gray-500">
                            Manager
                          </span>
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
