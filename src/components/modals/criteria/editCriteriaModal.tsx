// src/components/modals/criteria/editCriteriaModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Input, Textarea, Switch } from "@heroui/react";
import { Criterion } from "@/models/api/criteria.api.model";
import { useCriteriaStore } from "@/store/criteriaStore";

interface EditCriteriaModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  criterion: Criterion | null;
  onSuccess?: () => void;
}

export default function EditCriteriaModal({
  isOpen,
  onOpenChange,
  criterion,
  onSuccess,
}: EditCriteriaModalProps) {
  const { updateCriterion } = useCriteriaStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when criterion changes
  useEffect(() => {
    if (criterion) {
      setFormData({
        title: criterion.title,
        description: criterion.description,
        isActive: criterion.isActive,
      });
    }
  }, [criterion]);

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

    if (!criterion || !validateForm()) return;
    setIsSubmitting(true);

    try {
      await updateCriterion(criterion._id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive,
      });

      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              Edit Criteria
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col w-full gap-4">
                <Input
                  isRequired
                  isInvalid={!!errors.title}
                  errorMessage={errors.title}
                  label="Title"
                  labelPlacement="outside"
                  name="title"
                  placeholder="Enter criteria name"
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
                  onValueChange={(value) => handleChange("description", value)}
                  validationBehavior="aria"
                />

                <Switch
                  isSelected={formData.isActive}
                  onValueChange={(value) => handleChange("isActive", value)}
                >
                  Is active
                </Switch>
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
