import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Form, Input, Select, SelectItem, Switch } from "@heroui/react";

export const userRoles = [
  { key: "admin", label: "Admin" },
  { key: "employee", label: "Employee" },
];

const teamsList = [
  { id: "engineering", name: "Engineering" },
  { id: "design", name: "Design" },
  { id: "marketing", name: "Marketing" },
];

export default function AddUserModal() {
  const [submitted, setSubmitted] = React.useState<{
    [k: string]: FormDataEntryValue;
  } | null>(null);

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [selectedTeams, setSelectedTeams] = React.useState<string[]>([]);
  const [managerStatus, setManagerStatus] = React.useState<{
    [teamId: string]: boolean;
  }>({});

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onSubmit = (e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const newErrors: Record<string, string> = {};

    if (!data.name) newErrors.name = "Please enter a name";
    if (!data.email) newErrors.email = "Please enter an email";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate submit payload
    const payload = {
      ...data,
      teams: selectedTeams.map((id) => ({
        id,
        isManager: managerStatus[id] || false,
      })),
    };

    console.log("Submitted user:", payload);
    setErrors({});
    setSubmitted(payload);
  };

  const handleTeamSelection = (keys: string[]) => {
    setSelectedTeams(keys);
    setManagerStatus((prev) => {
      const updated: typeof prev = {};
      keys.forEach((id) => {
        updated[id] = prev[id] ?? false;
      });
      return updated;
    });
  };

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary">
        Add user
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add new user
              </ModalHeader>
              <ModalBody>
                <Form
                  className="w-full space-y-4 flex flex-col"
                  validationErrors={errors}
                  onReset={() => setSubmitted(null)}
                  onSubmit={onSubmit}
                >
                  <Input
                    isRequired
                    errorMessage={errors.name}
                    label="Name"
                    labelPlacement="outside"
                    name="name"
                    placeholder="Enter the new user's name"
                  />

                  <Input
                    isRequired
                    errorMessage={errors.email}
                    label="Email"
                    labelPlacement="outside"
                    name="email"
                    placeholder="Enter new user's email"
                    type="email"
                  />

                  <Select
                    items={userRoles}
                    label="Select role"
                    placeholder="Select a role"
                    labelPlacement="outside"
                    defaultSelectedKeys={["employee"]}
                    isRequired
                    name="role"
                  >
                    {(role) => (
                      <SelectItem key={role.key}>{role.label}</SelectItem>
                    )}
                  </Select>

                  <Select
                    label="Select teams"
                    placeholder="Choose one or more teams"
                    labelPlacement="outside"
                    selectionMode="multiple"
                    selectedKeys={selectedTeams}
                    onSelectionChange={(keys) => handleTeamSelection([...keys])}
                    name="teams"
                  >
                    {teamsList.map((team) => (
                      <SelectItem key={team.id}>{team.name}</SelectItem>
                    ))}
                  </Select>

                  {selectedTeams.length > 0 && (
                    <div className="flex flex-col gap-2 w-full">
                      <p className="text-sm text-gray-500 font-medium">
                        Set manager status per team:
                      </p>
                      {selectedTeams.map((id) => {
                        const team = teamsList.find((t) => t.id === id);
                        return (
                          <div
                            key={id}
                            className="flex items-center justify-between"
                          >
                            <span>{team?.name}</span>
                            <Switch
                              isSelected={managerStatus[id]}
                              size="sm"
                              onChange={(val) =>
                                setManagerStatus((prev) => ({
                                  ...prev,
                                  [id]: val,
                                }))
                              }
                            >
                              Manager
                            </Switch>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <Switch
                    defaultSelected
                    color="primary"
                    size="sm"
                    name="enabled"
                  >
                    Enable user
                  </Switch>

                  {errors.terms && (
                    <span className="text-danger text-small">
                      {errors.terms}
                    </span>
                  )}

                  {submitted && (
                    <div className="text-small text-default-500 mt-4">
                      Submitted data:
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                        {JSON.stringify(submitted, null, 2)}
                      </pre>
                    </div>
                  )}
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" form="form">
                  Add user
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
