import React, { useState, useEffect } from "react";
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
import SearchTeams from "@/components/data/teams/searchTeams";
import { Team } from "@/models/api/team.api.model";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/userStore";
import {
  CreateUserDto,
  SelectedTeamDTO,
} from "@/models/dto/users/create.user.dto";

export const userRoles = [
  { key: "company_admin", label: "Admin" },
  { key: "employee", label: "Employee" },
];

interface FormData {
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function AddUserModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeamDTO[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createUser } = useUserStore();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "employee",
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        email: "",
        role: "employee",
        isActive: true,
      });
      setSelectedTeams([]);
      setErrors({});
    }
  }, [isOpen]);

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter a name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter an email";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload: CreateUserDto = {
        ...formData,

        teams: selectedTeams.map(({ team, isManager }) => ({
          id: team._id,
          isManager,
        })),
      };

      await createUser(payload);

      console.log("Submitting user:", payload);
      toast.success("User created successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeamSelected = (team: Team | null) => {
    if (!team) return;

    if (selectedTeams.some((t) => t.team._id === team._id)) {
      toast.warn(`${team.name} is already added`);
      return;
    }
    setSelectedTeams((prev) => [...prev, { team, isManager: false }]);
  };

  const handleToggleManager = (teamId: string) => {
    setSelectedTeams((prev) =>
      prev.map((t) =>
        t.team._id === teamId ? { ...t, isManager: !t.isManager } : t
      )
    );
  };

  const removeTeam = (teamId: string) => {
    setSelectedTeams((prev) => prev.filter((t) => t.team._id !== teamId));
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
                  onSubmit={handleSubmit}
                  id="create-user-form"
                >
                  <Input
                    isRequired
                    label="Name"
                    labelPlacement="outside"
                    placeholder="Enter the new user's name"
                    value={formData.name}
                    onValueChange={(value) => updateField("name", value)}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                  />

                  <Input
                    isRequired
                    label="Email"
                    labelPlacement="outside"
                    placeholder="Enter new user's email"
                    type="email"
                    value={formData.email}
                    onValueChange={(value) => updateField("email", value)}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                  />

                  <Select
                    items={userRoles}
                    label="Select role"
                    placeholder="Select a role"
                    labelPlacement="outside"
                    selectedKeys={[formData.role]}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0] as string;
                      updateField("role", key);
                    }}
                  >
                    {(role) => (
                      <SelectItem key={role.key}>{role.label}</SelectItem>
                    )}
                  </Select>

                  <SearchTeams
                    required={false}
                    label="Assign teams"
                    onChange={handleTeamSelected}
                  />

                  {selectedTeams.length > 0 && (
                    <div className="flex flex-col gap-2 w-full">
                      <p className="text-sm text-gray-500 font-medium">
                        Team assignments:
                      </p>
                      {selectedTeams.map(({ team, isManager }) => (
                        <div
                          key={team._id}
                          className="flex items-center justify-between border-b pb-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{team.name}</span>
                            <Button
                              size="sm"
                              variant="light"
                              color="danger"
                              onPress={() => removeTeam(team._id)}
                            >
                              Remove
                            </Button>
                          </div>
                          <Switch
                            size="sm"
                            isSelected={isManager}
                            onValueChange={() => handleToggleManager(team._id)}
                          >
                            Manager
                          </Switch>
                        </div>
                      ))}
                    </div>
                  )}

                  <Switch
                    color="primary"
                    size="sm"
                    isSelected={formData.isActive}
                    onValueChange={(value) => updateField("isActive", value)}
                  >
                    Enable user
                  </Switch>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  form="create-user-form"
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Add user"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
