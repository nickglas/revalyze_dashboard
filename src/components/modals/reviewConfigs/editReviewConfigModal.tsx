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
  Divider,
  Form,
  Input,
  Switch,
  Tab,
  Tabs,
  Textarea,
} from "@heroui/react";
import { toast } from "react-toastify";
import { ReviewConfig } from "@/models/api/review.config.api.model";
import SearchCriteria from "@/components/data/criteria/searchCriteria";
import {
  CriterionSelectionDTO,
  UpdateReviewConfigDTO,
} from "@/models/dto/review.config.dto";
import { CriteriaSelection } from "@/components/criteriaSelection";
import { useReviewConfigStore } from "@/store/reviewConfigStore";

interface EditReviewConfigModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  config: ReviewConfig | null;
}

export default function EditReviewConfigModal({
  isOpen,
  onOpenChange,
  config,
}: EditReviewConfigModalProps) {
  const { updateReviewConfig } = useReviewConfigStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState<UpdateReviewConfigDTO>({
    name: "",
    description: "",
    isActive: true,
    criteria: [],
    modelSettings: {
      temperature: 0.7,
      maxTokens: 1000,
    },
  });

  const [selectedCriteria, setSelectedCriteria] = useState<
    CriterionSelectionDTO[]
  >([]);

  useEffect(() => {
    if (isOpen && config) {
      setFormData({
        name: config.name,
        description: config.description || "",
        isActive: config.isActive,
        modelSettings: {
          temperature: config.modelSettings.temperature,
          maxTokens: config.modelSettings.maxTokens,
        },
      });

      setSelectedCriteria(
        config.criteria.map((c) => ({
          _id: c._id,
          title: c.title || "",
          description: c.description || "",
          weight: c.weight,
        }))
      );

      setErrors({});
    }
  }, [isOpen, config]);

  const handleAddCriterion = (criterion: CriterionSelectionDTO) => {
    if (selectedCriteria.some((c) => c._id === criterion._id)) {
      toast.warn("This criterion is already selected");
      return;
    }

    setSelectedCriteria([...selectedCriteria, { ...criterion, weight: 0.7 }]);
  };

  const handleWeightChange = (criterionId: string, weight: number) => {
    setSelectedCriteria((prev) =>
      prev.map((c) => (c._id === criterionId ? { ...c, weight } : c))
    );
  };

  const handleRemoveCriterion = (criterionId: string) => {
    setSelectedCriteria(
      selectedCriteria.filter((criterion) => criterion._id !== criterionId)
    );
  };

  const validateField = (name: string, value: any) => {
    if (name === "name") {
      if (!value) return "Name is required.";
      if (value.length < 2) return "Name must be at least 2 characters.";
      if (value.length > 50) return "Name cannot exceed 50 characters.";
    }

    if (name === "description" && value) {
      if (value.length > 500)
        return "Description cannot exceed 500 characters.";
    }

    if (name === "modelSettings.temperature") {
      const temp = parseFloat(value);
      if (isNaN(temp)) return "Temperature must be a number";
      if (temp < 0) return "Temperature must be at least 0";
      if (temp > 2) return "Temperature cannot exceed 2";
    }

    if (name === "modelSettings.maxTokens") {
      const tokens = parseInt(value);
      if (isNaN(tokens)) return "Max tokens must be a number";
      if (tokens < 1) return "Max tokens must be at least 1";
      if (tokens > 4000) return "Max tokens cannot exceed 4000";
    }

    return "";
  };

  const handleChange = (
    name: string,
    value: string | boolean | number,
    nested?: string
  ) => {
    let newData = { ...formData };

    if (nested) {
      newData = {
        ...newData,
        [nested]: {
          ...(newData as any)[nested],
          [name]: value,
        },
      };
    } else {
      newData = { ...newData, [name]: value };
    }

    setFormData(newData);

    const error = validateField(nested ? `${nested}.${name}` : name, value);
    setErrors((prev) => ({
      ...prev,
      [nested ? `${nested}.${name}` : name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "modelSettings") {
        Object.entries(value).forEach(([subKey, subValue]) => {
          const error = validateField(`${key}.${subKey}`, subValue);
          if (error) newErrors[`${key}.${subKey}`] = error;
        });
      } else {
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });

    // Special validation for name
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required.";
    }

    // Validate criteria weights
    selectedCriteria.forEach((criterion) => {
      if (criterion.weight < 0 || criterion.weight > 1) {
        newErrors[`weight-${criterion._id}`] = "Weight must be between 0 and 1";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !config) return;
    setIsSubmitting(true);

    const dataToSend: UpdateReviewConfigDTO = {
      ...formData,
      criteria: selectedCriteria.map((c) => ({
        criterionId: c._id,
        weight: c.weight,
      })),
    };

    try {
      await updateReviewConfig(config._id, dataToSend);
      toast.success("Review configuration updated successfully!");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error.message || "Failed to update review configuration");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!config) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Update Review Configuration
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={handleSubmit}
                id="review-config-update-form"
                className="w-full"
              >
                <div className="w-full">
                  <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(key as string)}
                    fullWidth
                    color="primary"
                  >
                    <Tab key="general" title="General info">
                      <div className="flex flex-col gap-4 mt-2">
                        <Input
                          isRequired
                          isInvalid={!!errors.name}
                          errorMessage={errors.name}
                          label="Configuration Name"
                          labelPlacement="outside"
                          placeholder="e.g. Technical Support Review"
                          value={formData.name || ""}
                          onValueChange={(value) => handleChange("name", value)}
                        />

                        <Textarea
                          isInvalid={!!errors.description}
                          errorMessage={errors.description}
                          label="Description"
                          labelPlacement="outside"
                          placeholder="Describe this configuration (optional)"
                          value={formData.description || ""}
                          onValueChange={(value) =>
                            handleChange("description", value)
                          }
                        />

                        <Switch
                          isSelected={formData.isActive}
                          onValueChange={(value) =>
                            handleChange("isActive", value)
                          }
                        >
                          Is Active
                        </Switch>
                      </div>
                    </Tab>
                    <Tab key="criteria" title="Criteria">
                      <div className="flex flex-col gap-4 mt-2">
                        <SearchCriteria
                          onChange={(c: CriterionSelectionDTO | null) => {
                            if (c) {
                              handleAddCriterion(c);
                            }
                          }}
                        />

                        {errors.criteria && (
                          <div className="text-danger text-sm">
                            {errors.criteria}
                          </div>
                        )}

                        <div className="mt-2 flex flex-col gap-2">
                          <span className="text-sm">Criteria selection</span>
                          <CriteriaSelection
                            criteria={selectedCriteria}
                            onRemove={handleRemoveCriterion}
                            onWeightChange={handleWeightChange}
                          />
                        </div>
                      </div>
                    </Tab>
                    <Tab key="model" title="Model settings">
                      <div className="flex flex-col gap-4 mt-2">
                        <Input
                          isRequired
                          isInvalid={!!errors["modelSettings.temperature"]}
                          errorMessage={errors["modelSettings.temperature"]}
                          label="Temperature"
                          labelPlacement="outside"
                          placeholder="0.0 - 2.0"
                          type="number"
                          min="0"
                          max="2"
                          step="0.1"
                          value={
                            formData.modelSettings?.temperature.toString() ||
                            "0.7"
                          }
                          onValueChange={(value) =>
                            handleChange(
                              "temperature",
                              parseFloat(value) || 0.7,
                              "modelSettings"
                            )
                          }
                        />

                        <Input
                          isRequired
                          isInvalid={!!errors["modelSettings.maxTokens"]}
                          errorMessage={errors["modelSettings.maxTokens"]}
                          label="Max Tokens"
                          labelPlacement="outside"
                          placeholder="e.g. 1000"
                          type="number"
                          min="1"
                          max="4000"
                          value={
                            formData.modelSettings?.maxTokens.toString() ||
                            "1000"
                          }
                          onValueChange={(value) =>
                            handleChange(
                              "maxTokens",
                              parseInt(value) || 1000,
                              "modelSettings"
                            )
                          }
                        />
                      </div>
                    </Tab>
                  </Tabs>
                  <div className="flex gap-2 justify-end mt-4">
                    <Button variant="ghost" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      form="review-config-update-form"
                      color="primary"
                      isLoading={isSubmitting}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </Form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
