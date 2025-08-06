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
import { useContactStore } from "@/store/contactStore";
import SearchExternalCompany from "@/components/data/externalCompany/searchExternalCompany";

export default function AddExternalContactModal() {
  const { createContact } = useContactStore();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    isActive: true,
    externalCompanyId: "", // You'll need to add company selection
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        isActive: true,
        externalCompanyId: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required.";
        if (value.length < 2)
          return "First name must be at least 2 characters.";
        break;

      case "lastName":
        if (!value.trim()) return "Last name is required.";
        if (value.length < 2) return "Last name must be at least 2 characters.";
        break;

      case "email":
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Email must be a valid email address.";
        break;

      case "phone":
        if (!value.trim()) return "Phone is required.";
        if (value.length < 7) return "Phone must be at least 7 characters.";
        break;

      case "externalCompanyId":
        if (!value.trim()) return "Company is required.";
        break;

      case "position":
        if (!value.trim()) return "Position is required.";
        if (value.length < 3) return "Position must be at least 3 characters.";
        break;
    }
    return "";
  };

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (typeof value === "string") {
      const error = validateField(name, value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "isActive") {
        const error = validateField(key, value as string);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createContact({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        position: formData.position.trim(),
        isActive: formData.isActive,
        externalCompanyId: formData.externalCompanyId,
      });

      onClose();
    } catch (error) {
      console.error("Failed to create contact:", error);
      setErrors({
        general: "Failed to create contact. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary">
        Add Contact
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Contact
              </ModalHeader>
              <ModalBody>
                <Form id="contact-form" onSubmit={handleSubmit}>
                  <div className="flex flex-col w-full gap-4">
                    <div className="flex gap-4">
                      <Input
                        isRequired
                        isInvalid={!!errors.firstName}
                        errorMessage={errors.firstName}
                        label="First Name"
                        labelPlacement="outside"
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onValueChange={(value) =>
                          handleChange("firstName", value)
                        }
                        validationBehavior="aria"
                      />
                      <Input
                        isRequired
                        isInvalid={!!errors.lastName}
                        errorMessage={errors.lastName}
                        label="Last Name"
                        labelPlacement="outside"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onValueChange={(value) =>
                          handleChange("lastName", value)
                        }
                        validationBehavior="aria"
                      />
                    </div>

                    <Input
                      isRequired
                      isInvalid={!!errors.email}
                      errorMessage={errors.email}
                      label="Email"
                      labelPlacement="outside"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onValueChange={(value) => handleChange("email", value)}
                      validationBehavior="aria"
                    />

                    <Input
                      isRequired
                      isInvalid={!!errors.phone}
                      errorMessage={errors.phone}
                      label="Phone"
                      labelPlacement="outside"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onValueChange={(value) => handleChange("phone", value)}
                      validationBehavior="aria"
                    />

                    <SearchExternalCompany
                      onChange={(id, company) => {
                        handleChange("externalCompanyId", id);
                      }}
                    />

                    <Input
                      isRequired
                      isInvalid={!!errors.position}
                      errorMessage={errors.position}
                      label="Position"
                      labelPlacement="outside"
                      name="position"
                      placeholder="Enter position"
                      value={formData.position}
                      onValueChange={(value) => handleChange("position", value)}
                      validationBehavior="aria"
                    />

                    {/* TODO: Add company selection dropdown */}
                    {/* You'll need to fetch companies for this */}

                    <Switch
                      isSelected={formData.isActive}
                      onValueChange={(value) => handleChange("isActive", value)}
                    >
                      Active Status
                    </Switch>

                    {errors.general && (
                      <div className="text-danger text-sm mt-2">
                        {errors.general}
                      </div>
                    )}
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
                    form="contact-form"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Contact"}
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
