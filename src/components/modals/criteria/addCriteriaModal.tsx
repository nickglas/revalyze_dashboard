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
import { useCriteriaStore } from "@/store/criteriaStore";

export default function AddCriteriaModal() {
  const { createCriterion } = useCriteriaStore();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        description: "",
        isActive: true,
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateField = (name: string, value: string) => {
    if (name === "title") {
      if (!value.trim()) return "Title is required.";
      if (value.length < 5) return "Title must be at least 5 characters.";
      if (value.length > 50) return "Title cannot exceed 50 characters.";
    }

    if (name === "description") {
      if (!value.trim()) return "Description is required.";
      if (value.length < 30)
        return "Description must be at least 30 characters.";
      if (value.length > 200)
        return "Description cannot exceed 200 characters.";
    }

    return "";
  };

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Validate field in real-time if it has an error
    if (typeof value === "string" && errors[name]) {
      const error = validateField(name, value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const titleError = validateField("title", formData.title);
    if (titleError) newErrors.title = titleError;

    const descriptionError = validateField("description", formData.description);
    if (descriptionError) newErrors.description = descriptionError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsSubmitting(true);

    await createCriterion({
      title: formData.title.trim(),
      description: formData.description.trim(),
      isActive: formData.isActive,
    });

    onClose();

    setIsSubmitting(false);
  };

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary">
        Add criteria
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create criteria
              </ModalHeader>
              <ModalBody>
                <Form id="criteria-form" onSubmit={handleSubmit}>
                  <div className="flex flex-col w-full gap-4">
                    <Input
                      isRequired
                      isInvalid={!!errors.title}
                      errorMessage={errors.title}
                      label="Title"
                      labelPlacement="outside"
                      name="title"
                      placeholder="Enter the new criteria's name"
                      value={formData.title}
                      onValueChange={(value) => handleChange("title", value)}
                      validationBehavior="aria"
                    />

                    <Textarea
                      isRequired
                      isInvalid={!!errors.description}
                      errorMessage={errors.description}
                      label="Description"
                      labelPlacement="outside"
                      placeholder="Enter criteria description"
                      value={formData.description}
                      onValueChange={(value) =>
                        handleChange("description", value)
                      }
                      validationBehavior="aria"
                    />

                    <Switch
                      isSelected={formData.isActive}
                      onValueChange={(value) => handleChange("isActive", value)}
                    >
                      Is active
                    </Switch>
                  </div>
                </Form>
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
                    form="criteria-form"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add criterion"}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
