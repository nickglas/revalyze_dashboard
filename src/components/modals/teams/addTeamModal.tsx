// src/components/modals/teams/addTeamModal.tsx
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
import { useTeamStore } from "@/store/teamStore";
import SearchUsers from "@/components/data/users/searchUsers";
import { User } from "@/models/api/user.model";
import { ManagerSelection } from "@/components/managerSelection";
import { toast } from "react-toastify";
import { CreateTeamDTO, TeamMemberDTO } from "@/models/dto/create.team.dto";

export default function AddTeamModal() {
  const [tab, setTab] = useState(0);
  const { createTeam } = useTeamStore();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [postData, setPostData] = useState<CreateTeamDTO>({
    name: "",
    description: "",
    isActive: true,
    users: [],
  });

  useEffect(() => {
    if (!isOpen) {
      setPostData({
        name: "",
        description: "",
        isActive: true,
        users: [],
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleAddUser = (user: User) => {
    if (
      postData?.users.find((selectedUser) => selectedUser.userId === user._id)
    ) {
      toast.warn("This user is already selected");
      return;
    }

    const copy = { ...postData };

    copy.users?.push({
      isManager: false,
      userId: user._id,
      email: user.email,
      name: user.name,
    });

    setPostData(copy);
  };

  const handleManagerToggle = (userId: string) => {
    const copy = { ...postData };
    const user = copy.users.find((x) => x.userId === userId);
    if (user) {
      user.isManager = !user.isManager;
    }
    console.warn(copy);
    setPostData(copy);
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

    // Validate all fields
    Object.entries(postData).forEach(([key, value]) => {
      if (key !== "users") {
        // Don't validate users array
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

    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await createTeam({
        ...postData,
        name: postData.name.trim(),
        description: postData.description?.trim() || "",
      });
      onClose();
    } catch (error) {
      console.error("Creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveUser = (userId: string) => {
    let copy = { ...postData };
    copy.users = copy.users.filter((user) => user.userId !== userId);
    setPostData(copy);
  };

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary">
        Add team
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create team
              </ModalHeader>
              <ModalBody>
                <Form id="criteria-form" onSubmit={handleSubmit}>
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
                          placeholder="Enter the new team's name"
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
                          <span className="text-sm">User selection</span>
                          <ManagerSelection
                            users={postData.users}
                            onUserDiscard={(userId: string) =>
                              handleRemoveUser(userId)
                            }
                            onManagerToggle={(userId: string) => {
                              console.warn("first");
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
                        form="criteria-form"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Adding..." : "Add team"}
                      </Button>
                    </>
                  )}
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
