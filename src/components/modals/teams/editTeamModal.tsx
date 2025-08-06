import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  Button,
  Input,
  Textarea,
  Switch,
  Chip,
  Avatar,
  Badge,
} from "@heroui/react";
import { Team } from "@/models/api/team.api.model";
import { useTeamStore } from "@/store/teamStore";

interface EditTeamModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  team: Team | null;
}

export default function EditTeamModal({
  isOpen,
  onOpenChange,
  team,
}: EditTeamModalProps) {
  const { updateTeam } = useTeamStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    managerId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when team changes
  useEffect(() => {
    if (team) {
      const manager = team.users.find((u) => u.isManager)?.user;

      setFormData({
        name: team.name,
        description: team.description || "",
        isActive: team.isActive,
        managerId: manager?._id || "",
      });
    }
  }, [team]);

  const validateField = (name: string, value: string) => {
    if (name === "name") {
      if (!value.trim()) return "Team name is required.";
      if (value.length < 3) return "Team name must be at least 3 characters.";
      if (value.length > 50) return "Team name cannot exceed 50 characters.";
    }

    if (name === "description" && value.length > 500) {
      return "Description cannot exceed 500 characters.";
    }

    return "";
  };

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (typeof value === "string" && errors[name]) {
      const error = validateField(name, value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "isActive" && key !== "managerId") {
        const error = validateField(key, value as string);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team || !validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateTeam(team._id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive,
        // In a real app, you'd update manager here
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update team:", error);
      setErrors({
        general: "Failed to update team. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!team) return null;

  // Find manager
  const manager = team.users.find((u) => u.isManager)?.user;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              Edit Team: {team.name}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6">
                {errors.general && (
                  <div className="text-danger text-sm">{errors.general}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    isRequired
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                    label="Team Name"
                    labelPlacement="outside"
                    name="name"
                    placeholder="Enter team name"
                    value={formData.name}
                    onValueChange={(value) => handleChange("name", value)}
                    validationBehavior="aria"
                  />

                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Switch
                      isSelected={formData.isActive}
                      onValueChange={(value) => handleChange("isActive", value)}
                      className="mt-2"
                    >
                      {formData.isActive ? "Active" : "Inactive"}
                    </Switch>
                  </div>
                </div>

                <Textarea
                  isInvalid={!!errors.description}
                  errorMessage={errors.description}
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Enter team description"
                  value={formData.description}
                  onValueChange={(value) => handleChange("description", value)}
                  validationBehavior="aria"
                />

                <div>
                  <label className="text-sm font-medium">Current Manager</label>
                  {manager ? (
                    <div className="flex items-center gap-3 p-3 mt-2 border rounded-lg">
                      <Avatar name={manager.name} />
                      <div>
                        <p className="font-medium">{manager.name}</p>
                        <p className="text-gray-500 text-sm">{manager.email}</p>
                      </div>
                      <Badge color="primary" className="ml-auto">
                        Manager
                      </Badge>
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-500">No manager assigned</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Team Members
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
                    {team.users.map((member) => (
                      <div
                        key={member.user._id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                      >
                        <Avatar name={member.user.name} size="sm" />
                        <div>
                          <p className="font-medium">{member.user.name}</p>
                          <p className="text-gray-500 text-sm">
                            {member.user.email}
                          </p>
                        </div>
                        {member.isManager && (
                          <Chip size="sm" color="primary" className="ml-auto">
                            Manager
                          </Chip>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex items-center justify-end gap-4 w-full">
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
