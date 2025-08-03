// src/components/modals/teams/addTeamModal.tsx
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import {
  Button,
  Input,
  Textarea,
  Switch,
  Select,
  SelectItem,
  Chip,
  Avatar,
  Tabs,
  Tab,
} from "@heroui/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AddTeamModalProps {
  users: User[];
}

export default function AddTeamModal({ users }: AddTeamModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("members");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      // Remove user and also remove as manager if selected
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      setSelectedManagers(selectedManagers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleManagerToggle = (userId: string) => {
    if (selectedManagers.includes(userId)) {
      setSelectedManagers(selectedManagers.filter((id) => id !== userId));
    } else {
      setSelectedManagers([...selectedManagers, userId]);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { [key: string]: string } = {};

    if (!teamName.trim()) {
      newErrors.name = "Team name is required";
    }

    if (selectedUsers.length === 0) {
      newErrors.members = "Please select at least one team member";
    }

    if (selectedManagers.length === 0) {
      newErrors.managers = "Please select at least one manager";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors
    setErrors({});

    // Prepare data
    const teamData = {
      name: teamName,
      description,
      isActive,
      members: selectedUsers,
      managers: selectedManagers,
    };

    // Save and close
    onOpenChange();

    // Reset form
    setTeamName("");
    setDescription("");
    setIsActive(true);
    setSelectedUsers([]);
    setSelectedManagers([]);
    setSearchTerm("");
  };

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary">
        Add Team
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Create New Team
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Input
                      isRequired
                      errorMessage={errors.name}
                      label="Team Name"
                      labelPlacement="outside"
                      name="name"
                      placeholder="Enter team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />

                    <Textarea
                      label="Description"
                      labelPlacement="outside"
                      name="description"
                      placeholder="Describe the team's purpose or responsibilities"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />

                    <Switch
                      defaultSelected
                      color="primary"
                      size="sm"
                      isSelected={isActive}
                    >
                      Active Team
                    </Switch>
                  </div>

                  <div className="border rounded-lg p-4">
                    <Tabs
                      selectedKey={activeTab}
                      onSelectionChange={(key) => setActiveTab(key as string)}
                      className="mb-4"
                    >
                      <Tab key="members" title="Members" />
                      <Tab key="managers" title="Managers" />
                    </Tabs>

                    <div className="mb-4">
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                      {errors.members && (
                        <p className="text-danger text-sm mt-1">
                          {errors.members}
                        </p>
                      )}
                      {errors.managers && (
                        <p className="text-danger text-sm mt-1">
                          {errors.managers}
                        </p>
                      )}
                    </div>

                    <div className="h-64 overflow-y-auto">
                      {activeTab === "members" ? (
                        <div className="space-y-2">
                          {filteredUsers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              No users found
                            </div>
                          ) : (
                            filteredUsers.map((user) => (
                              <div
                                key={user.id}
                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                                  selectedUsers.includes(user.id)
                                    ? "bg-blue-50 dark:bg-blue-900/30"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                                onClick={() => handleUserSelect(user.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar
                                    size="sm"
                                    name={user.name}
                                    getInitials={(name) =>
                                      name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                    }
                                  />
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={() => {}}
                                  className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                />
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedUsers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              No members selected yet
                            </div>
                          ) : (
                            selectedUsers.map((userId) => {
                              const user = users.find((u) => u.id === userId);
                              if (!user) return null;

                              return (
                                <div
                                  key={user.id}
                                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                                >
                                  <div className="flex items-center gap-3">
                                    <Avatar
                                      size="sm"
                                      name={user.name}
                                      getInitials={(name) =>
                                        name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                      }
                                    />
                                    <div>
                                      <p className="font-medium">{user.name}</p>
                                      <p className="text-xs text-gray-500">
                                        {user.email}
                                      </p>
                                    </div>
                                  </div>
                                  <Switch
                                    isSelected={selectedManagers.includes(
                                      user.id
                                    )}
                                    isDisabled={
                                      !selectedUsers.includes(user.id)
                                    }
                                    onChange={() =>
                                      handleManagerToggle(user.id)
                                    }
                                    size="sm"
                                    color="primary"
                                  >
                                    Manager
                                  </Switch>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">
                        Selected Managers:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedManagers.map((managerId) => {
                          const manager = users.find((u) => u.id === managerId);
                          if (!manager) return null;
                          return (
                            <Chip
                              key={managerId}
                              color="primary"
                              variant="flat"
                              onClose={() => handleManagerToggle(managerId)}
                            >
                              {manager.name}
                            </Chip>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Create Team
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
