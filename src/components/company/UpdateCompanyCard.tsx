import { CompanyUpdateDTO } from "@/models/dto/company/company.update.dto";
import { useCompanyStore } from "@/store/companyStore";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@heroui/react";
import { useEffect, useState } from "react";

const UpdateCompanyCard = () => {
  const {
    companyDetails,
    getCompanyDetails,
    updateCompanyDetails,
    isUpdating,
  } = useCompanyStore();

  useEffect(() => {
    getCompanyDetails();
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CompanyUpdateDTO>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (companyDetails) {
      setFormData({
        name: companyDetails.name || "",
        email: companyDetails.email || "",
        phone: companyDetails.phone || "",
        address: companyDetails.address || "",
      });
    }
  }, [companyDetails]);

  // Field validation function
  const validateField = (name: string, value: string) => {
    if (!value.trim()) {
      return "This field is required.";
    }

    if (value.length < 5) {
      return "Must be at least 5 characters.";
    }

    if (value.length > 50) {
      return "Cannot exceed 50 characters.";
    }

    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Invalid email format.";
    }

    return "";
  };

  // Handle input changes
  const handleChange = (name: keyof CompanyUpdateDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Validate field in real-time
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save action
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateCompanyDetails(formData);
    } catch (error) {
      // Error handled in store
    }
  };

  return (
    <Card className="bg-[#1e1e1e]">
      <CardHeader>
        <h2 className="text-lg font-semibold">Company Information</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <Input
          label="Company Name"
          name="name"
          value={formData.name}
          isInvalid={!!errors.name}
          errorMessage={errors.name}
          onValueChange={(value) => handleChange("name", value)}
          validationBehavior="aria"
        />

        <Input
          label="Main company Email"
          name="email"
          type="email"
          value={formData.email}
          isInvalid={!!errors.email}
          errorMessage={errors.email}
          onValueChange={(value) => handleChange("email", value)}
          validationBehavior="aria"
        />

        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          isInvalid={!!errors.phone}
          errorMessage={errors.phone}
          onValueChange={(value) => handleChange("phone", value)}
          validationBehavior="aria"
        />

        <Input
          label="Address"
          name="address"
          value={formData.address}
          isInvalid={!!errors.address}
          errorMessage={errors.address}
          onValueChange={(value) => handleChange("address", value)}
          validationBehavior="aria"
        />
      </CardBody>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button
          color="primary"
          onPress={handleSave}
          isLoading={isUpdating}
          disabled={isUpdating || Object.keys(errors).length > 0}
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpdateCompanyCard;
