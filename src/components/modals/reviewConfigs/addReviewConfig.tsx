import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button, Input, Textarea, Switch, Divider, Form } from "@heroui/react";
import { toast } from "react-toastify";
import {
  CreateReviewConfigDTO,
  CriterionSelectionDTO,
} from "@/models/dto/review.config.dto";
import { useUserStore } from "@/store/userStore";
import SearchCriteria from "@/components/data/criteria/searchCriteria";
import { CriteriaSelection } from "@/components/criteriaSelection";
import { useReviewConfigStore } from "@/store/reviewConfigStore";

export default function AddReviewConfigModal() {
  const [tab, setTab] = useState(0);
  const { createReviewConfig } = useReviewConfigStore(); // Or your review config store
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserStore();

  const [postData, setPostData] = useState<CreateReviewConfigDTO>({
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
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setPostData({
      name: "",
      description: "",
      isActive: true,
      criteria: [],
      modelSettings: {
        temperature: 0.7,
        maxTokens: 1000,
      },
    });
    setSelectedCriteria([]);
    setErrors({});
    setTab(0);
  };

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
    setPostData({
      ...postData,
      criteria: postData.criteria.filter((x) => x.criterionId !== criterionId),
    });

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
    let newData = { ...postData };

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

    setPostData(newData);

    const error = validateField(nested ? `${nested}.${name}` : name, value);
    setErrors((prev) => ({
      ...prev,
      [nested ? `${nested}.${name}` : name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate all fields
    Object.entries(postData).forEach(([key, value]) => {
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
    if (!postData.name.trim()) {
      newErrors.name = "Name is required.";
    }

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

    if (!validateForm()) return;
    setIsSubmitting(true);

    const dataToSend = {
      ...postData,
      criteria: selectedCriteria.map((c) => ({
        criterionId: c._id,
        weight: c.weight,
      })),
    };

    console.warn(dataToSend);

    try {
      await createReviewConfig(dataToSend);
      toast.success("Review configuration created successfully!");
      onClose();
    } catch (error) {
      console.error("Creation failed:", error);
      toast.error("Failed to create review configuration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary">
        Create Config
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Review Configuration
              </ModalHeader>
              <ModalBody>
                <Form
                  id="review-config-form"
                  onSubmit={(e) => {
                    handleSubmit(e);
                  }}
                >
                  <div className="flex flex-col w-full gap-4">
                    {/* Progress Steps */}
                    <div className="flex justify-between mb-4">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 flex flex-col items-center ${
                            step > 1 ? "ml-2" : ""
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              tab >= step - 1
                                ? "bg-primary-500 text-white"
                                : "bg-default-100"
                            }`}
                          >
                            {step}
                          </div>
                          <span className="text-xs mt-1">
                            {step === 1 && "Basic Info"}
                            {step === 2 && "Criteria"}
                            {step === 3 && "Model"}
                          </span>
                        </div>
                      ))}
                    </div>

                    {tab === 0 && (
                      <div className="space-y-4">
                        <Input
                          isRequired
                          isInvalid={!!errors.name}
                          errorMessage={errors.name}
                          label="Configuration Name"
                          labelPlacement="outside"
                          placeholder="e.g. Technical Support Review"
                          value={postData.name}
                          onValueChange={(value) => handleChange("name", value)}
                        />

                        <Textarea
                          isInvalid={!!errors.description}
                          errorMessage={errors.description}
                          label="Description"
                          labelPlacement="outside"
                          placeholder="Describe this configuration (optional)"
                          value={postData.description}
                          onValueChange={(value) =>
                            handleChange("description", value)
                          }
                        />

                        <Switch
                          isSelected={postData.isActive}
                          onValueChange={(value) =>
                            handleChange("isActive", value)
                          }
                        >
                          Is Active
                        </Switch>
                      </div>
                    )}

                    {tab === 1 && (
                      <div className="flex flex-col gap-4">
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

                        <div className="mt-2">
                          <span className="text-sm">Criteria selection</span>
                          <CriteriaSelection
                            criteria={selectedCriteria}
                            onRemove={handleRemoveCriterion}
                            onWeightChange={handleWeightChange}
                          />
                        </div>
                      </div>
                    )}

                    {tab === 2 && (
                      <div className="flex flex-col gap-4">
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
                          value={postData.modelSettings.temperature.toString()}
                          onValueChange={(value) =>
                            handleChange(
                              "modelSettings.temperature",
                              parseFloat(value) || 0
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
                          value={postData.modelSettings.maxTokens.toString()}
                          onValueChange={(value) =>
                            handleChange(
                              "modelSettings.maxTokens",
                              parseInt(value) || 0
                            )
                          }
                        />

                        {/* <div className="p-3 rounded-lg">
                          <h4 className="font-medium text-sm">
                            Model Settings Guide
                          </h4>
                          <ul className="text-xs text-gray-600 mt-1 space-y-1">
                            <li>
                              • <strong>Temperature</strong>: Controls
                              randomness (0 = precise, 2 = creative)
                            </li>
                            <li>
                              • <strong>Max Tokens</strong>: Limits response
                              length (typically 500-2000 tokens)
                            </li>
                          </ul>
                        </div> */}
                      </div>
                    )}
                  </div>

                  <div className="flex w-full justify-end mb-2">
                    {tab === 0 && (
                      <Button onPress={() => setTab(tab + 1)} color="primary">
                        Next
                      </Button>
                    )}

                    {tab === 1 && (
                      <div className="flex gap-4">
                        <Button onPress={() => setTab(tab - 1)} variant="ghost">
                          Previous
                        </Button>

                        <Button onPress={() => setTab(tab + 1)} color="primary">
                          Next
                        </Button>
                      </div>
                    )}

                    {tab === 2 && (
                      <div className="flex gap-4 mt-4">
                        <Button onPress={() => setTab(tab - 1)} variant="ghost">
                          Previous
                        </Button>

                        <Button
                          type="submit"
                          form="review-config-form"
                          color="primary"
                        >
                          Submit
                        </Button>
                      </div>
                    )}
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
