import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Input, Textarea, Switch } from "@heroui/react";
import { ExternalCompany } from "@/models/api/external.company.model";
import { useExternalCompanyStore } from "@/store/externalCompanyStore";

interface EditExternalCompanyModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  company: ExternalCompany | null;
}

export default function EditExternalCompanyModal({
  isOpen,
  onOpenChange,
  company,
}: EditExternalCompanyModalProps) {
  const { updateCompany } = useExternalCompanyStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when company changes
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        email: company.email,
        phone: company.phone,
        address: company.address,
        isActive: company.isActive,
      });
    }
  }, [company]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Company name is required.";
        if (value.length < 3)
          return "Company name must be at least 3 characters long.";
        if (value.length > 50)
          return "Company name must be at most 50 characters long.";
        break;

      case "email":
        if (!value.trim()) return "Company email is required.";
        if (value.length > 100)
          return "Company email must be at most 100 characters long.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Company email must be a valid email address.";
        break;

      case "phone":
        if (!value.trim()) return "Company phone is required.";
        if (value.length < 7)
          return "Company phone must be at least 7 characters long.";
        if (value.length > 20)
          return "Company phone must be at most 20 characters long.";
        if (!/^\+\d{1,3}\d{4,}$/.test(value))
          return "Phone must start with '+' followed by country code and digits (e.g. +31123456789)";
        break;

      case "address":
        if (!value.trim()) return "Address is required.";
        if (value.length < 5)
          return "Address must be at least 5 characters long.";
        if (value.length > 200)
          return "Address must be at most 200 characters long.";
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
    if (!company || !validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateCompany(company._id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        isActive: formData.isActive,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update company:", error);
      setErrors({
        general: "Failed to update company. Please try again.",
      });
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
              Edit Company
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col w-full gap-4">
                <Input
                  isRequired
                  isInvalid={!!errors.name}
                  errorMessage={errors.name}
                  label="Company Name"
                  labelPlacement="outside"
                  name="name"
                  placeholder="Enter company name"
                  value={formData.name}
                  onValueChange={(value) => handleChange("name", value)}
                  validationBehavior="aria"
                />

                <Input
                  isRequired
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                  label="Email"
                  labelPlacement="outside"
                  name="email"
                  placeholder="Enter company email"
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
                  placeholder="Enter phone number (e.g. +31123456789)"
                  value={formData.phone}
                  onValueChange={(value) => handleChange("phone", value)}
                  validationBehavior="aria"
                />

                <Textarea
                  isRequired
                  isInvalid={!!errors.address}
                  errorMessage={errors.address}
                  label="Address"
                  labelPlacement="outside"
                  placeholder="Enter company address"
                  value={formData.address}
                  onValueChange={(value) => handleChange("address", value)}
                  validationBehavior="aria"
                />

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
