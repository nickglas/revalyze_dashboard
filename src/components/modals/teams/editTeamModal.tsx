import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button, Input, Textarea, Switch, Form } from "@heroui/react";
import { Team } from "@/models/api/team.api.model";
import { useTeamStore } from "@/store/teamStore";
import SearchUsers from "@/components/data/users/searchUsers";
import { User } from "@/models/api/user.model";
import { ManagerSelection } from "@/components/managerSelection";
import { toast } from "react-toastify";
import { CreateTeamDTO, TeamMemberDTO } from "@/models/dto/create.team.dto";
import { UpdateTeamDTO } from "@/models/dto/update.team.dto";

interface EditTeamModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  team: Team | null;
}

interface EditTeamFormState {
  name: string;
  description?: string;
  isActive: boolean;
  users: TeamMemberDTO[];
}

export default function EditTeamModal({
  isOpen,
  onOpenChange,
  team,
}: EditTeamModalProps) {
  const { updateTeam } = useTeamStore();
  const [tab, setTab] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [postData, setPostData] = useState<EditTeamFormState>({
    name: "",
    description: "",
    isActive: true,
    users: [],
  });

  // Initialize form data when team changes
  useEffect(() => {
    if (team && isOpen) {
      // Convert team users to TeamMemberDTO[]
      const users: TeamMemberDTO[] = team.users.map((member) => ({
        userId: member.user._id,
        name: member.user.name,
        email: member.user.email,
        isManager: member.isManager,
      }));

      setPostData({
        name: team.name,
        description: team.description || "",
        isActive: team.isActive,
        users: users,
      });
      setErrors({});
      setTab(0);
    }
  }, [team, isOpen]);

  const handleAddUser = (user: User) => {
    setPostData((prev) => ({
      ...prev,
      users: [
        ...prev.users,
        {
          userId: user._id,
          name: user.name,
          email: user.email,
          isManager: false,
        },
      ],
    }));
  };

  const handleManagerToggle = (userId: string) => {
    setPostData((prev) => {
      const updatedUsers = prev.users.map((user) =>
        user.userId === userId ? { ...user, isManager: !user.isManager } : user
      );
      return { ...prev, users: updatedUsers };
    });
  };

  const validateField = (name: string, value: string | boolean) => {
    if (name === "name") {
      if (!value) return "Name is required.";
      if (typeof value === "string" && value.length < 2)
        return "Name must be at least 2 characters.";
      if (typeof value === "string" && value.length > 50)
        return "Name cannot exceed 50 characters.";
    }

    if (name === "description" && typeof value === "string") {
      if (value && value.length > 500)
        return "Description cannot exceed 500 characters.";
    }

    return "";
  };

  const handleChange = (name: string, value: string | boolean) => {
    setPostData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!postData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    // Validate all fields
    Object.entries(postData).forEach(([key, value]) => {
      if (key !== "users") {
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });

    // Special validation for name
    if (!postData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !team) return;
    setIsSubmitting(true);

    try {
      await updateTeam(team._id, {
        ...postData,
        name: postData.name.trim(),
        description: postData.description?.trim() || "",
        users: postData.users.map((u) => ({
          userId: u.userId,
          isManager: u.isManager,
        })),
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update team");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setPostData((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.userId !== userId),
    }));
  };

  if (!team) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Team: {team.name}
            </ModalHeader>
            <ModalBody>
              <Form id="edit-team-form" onSubmit={handleSubmit}>
                <div className="flex flex-col w-full gap-4">
                  {tab === 0 && (
                    <>
                      <Input
                        isRequired
                        isInvalid={!!errors.name}
                        errorMessage={errors.name}
                        label="Name"
                        labelPlacement="outside"
                        name="name"
                        placeholder="Enter team name"
                        value={postData.name}
                        onValueChange={(value) => handleChange("name", value)}
                        validationBehavior="aria"
                      />

                      <Textarea
                        isInvalid={!!errors.description}
                        errorMessage={errors.description}
                        label="Description"
                        labelPlacement="outside"
                        placeholder="Enter team description (optional)"
                        value={postData.description}
                        onValueChange={(value) =>
                          handleChange("description", value)
                        }
                        validationBehavior="aria"
                      />

                      <Switch
                        isSelected={postData.isActive}
                        onValueChange={(value) =>
                          handleChange("isActive", value)
                        }
                      >
                        Is active
                      </Switch>
                    </>
                  )}

                  {tab === 1 && (
                    <div className="flex flex-col gap-6">
                      <SearchUsers
                        required={false}
                        onChange={(selectedUser) => {
                          if (selectedUser) {
                            handleAddUser(selectedUser);
                          }
                        }}
                      />
                      <div className="flex flex-col gap-2">
                        <span className="text-sm">Team Members</span>
                        <ManagerSelection
                          users={postData.users}
                          onUserDiscard={(userId: string) =>
                            handleRemoveUser(userId)
                          }
                          onManagerToggle={(userId: string) => {
                            handleManagerToggle(userId);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Form>
            </ModalBody>
            <ModalFooter>
              <div className="flex items-center justify-end gap-4 w-full">
                {tab === 0 && (
                  <>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={onClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button color="primary" onPress={() => setTab(tab + 1)}>
                      Next step
                    </Button>
                  </>
                )}

                {tab === 1 && (
                  <>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => setTab(tab - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      form="edit-team-form"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update Team"}
                    </Button>
                  </>
                )}
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
