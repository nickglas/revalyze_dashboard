import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button, Input, Form, Textarea, Spinner } from "@heroui/react";
import { useTranscriptStore } from "@/store/transcriptStore";
import { CreateTranscriptDTO } from "@/models/dto/create.transcript.dto";
import { formatISO } from "date-fns";
import { toast } from "react-toastify";
import { ReviewConfig } from "@/models/api/review.config.api.model";
import EmployeeSelection from "@/components/new/EmployeeSelection";
import CompanyContactSelection from "@/components/new/CompanyContactSelector";
import ConversationDatePicker from "@/components/new/ConversationDatePicker";
import CriteriaWeightsEditor from "@/components/new/CriteriaWeightsEditor";
import ReviewConfigSelector from "@/components/new/ReviewConfigSelector";
import ReviewTypeSelector from "@/components/new/ReviewTypeSelector";
import ReviewAutoStartToggle from "@/components/new/ReviewAutoStartToggle";

const MAX_SIZE = 100 * 1024 * 1024; // 100MB
const CHUNK_SIZE = 1024 * 1024; // 1MB

// Helper to get today's date at midnight in local time
const getTodayAtMidnight = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export default function AddTranscriptModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { createTranscript } = useTranscriptStore();
  const [tab, setTab] = useState(0);
  const [selectedConfig, setSelectedConfig] = useState<
    ReviewConfig | undefined
  >(undefined);
  const [editedWeights, setEditedWeights] = useState<Record<string, number>>(
    {}
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<
    Omit<CreateTranscriptDTO, "timestamp"> & {
      timestamp: Date | null;
      reviewConfigId: string | undefined;
      reviewType: string;
      criteriaWeights?: Array<{ criterionId: string; weight: number }>;
    }
  >({
    content: "",
    timestamp: getTodayAtMidnight(),
    employeeId: "",
    externalCompanyId: "",
    contactId: "",
    reviewConfigId: undefined,
    reviewType: "both",
    autoStartReview: false,
    criteriaWeights: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        content: "",
        timestamp: getTodayAtMidnight(),
        employeeId: "",
        externalCompanyId: undefined,
        contactId: undefined,
        reviewConfigId: undefined,
        reviewType: "both",
        autoStartReview: false,
        criteriaWeights: undefined,
      });
      setErrors({});
      setTab(0);
      setSelectedConfig(undefined);
      setEditedWeights({});

      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  // Initialize edited weights when config is selected
  useEffect(() => {
    if (selectedConfig) {
      const initialWeights: Record<string, number> = {};
      selectedConfig.criteria.forEach((criterion) => {
        initialWeights[criterion._id] = criterion.weight;
      });
      setEditedWeights(initialWeights);
    } else {
      setEditedWeights({});
    }
  }, [selectedConfig]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      alert("Only .txt files are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("File size exceeds 100 MB limit.");
      e.target.value = "";
      return;
    }

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }

    setFileLoading(true);
    readFileInChunks(file);
  };

  const readFileInChunks = (file: File) => {
    let offset = 0;
    let content = "";

    const readNextChunk = () => {
      const slice = file.slice(offset, offset + CHUNK_SIZE);
      const reader = new FileReader();

      reader.onload = (event) => {
        const chunkContent = event.target?.result as string;
        content += chunkContent;

        if (textareaRef.current) {
          textareaRef.current.value = content;
        }

        offset += CHUNK_SIZE;
        if (offset < file.size) {
          setTimeout(readNextChunk, 0);
        } else {
          setFormData((prev) => ({ ...prev, content }));
          setFileLoading(false);
        }
      };

      reader.onerror = () => {
        alert("Error reading file.");
        setFileLoading(false);
      };

      reader.readAsText(slice);
    };

    readNextChunk();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (tab === 0) {
      if (!formData.content.trim()) {
        newErrors.content = "Transcript content is required";
      } else if (formData.content.trim().length < 50) {
        newErrors.content = "Transcript content must be at least 50 characters";
      }
    }

    if (tab === 1) {
      if (!formData.employeeId) {
        newErrors.employeeId = "Employee is required";
      }

      if (!formData.timestamp) {
        newErrors.timestamp = "Conversation date is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (newTab: number) => {
    if (!validateForm()) return;
    setTab(newTab);
  };

  const handleBackStep = (newTab: number) => {
    setTab(newTab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateTranscriptDTO = {
        ...formData,
        timestamp: formData.timestamp
          ? formatISO(formData.timestamp, { representation: "complete" })
          : "",
      };

      if (!formData.autoStartReview) {
        delete payload.reviewType;
        delete payload.reviewConfigId;
      } else if (formData.autoStartReview && selectedConfig) {
        const weights = Object.entries(editedWeights);

        if (weights.length > 0) {
          payload.criteriaWeights = weights.map(([criterionId, weight]) => ({
            criterionId,
            weight,
          }));
        }
      }

      await createTranscript(payload);
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload transcript");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to update form fields
  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when field changes
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle weight change for a criterion
  const handleWeightChange = (criterionId: string, value: number) => {
    setEditedWeights((prev) => ({
      ...prev,
      [criterionId]: value,
    }));
  };

  // Handle criterion removal
  const handleRemoveCriterion = (criterionId: string) => {
    setEditedWeights((prev) => {
      const newWeights = { ...prev };
      delete newWeights[criterionId];
      return newWeights;
    });
  };

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary">
        Upload transcript
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={tab === 0 ? "2xl" : "xl"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload transcript
              </ModalHeader>
              <ModalBody>
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
                        {step === 1 && "Transcript"}
                        {step === 2 && "Details"}
                        {step === 3 && "Review"}
                      </span>
                    </div>
                  ))}
                </div>
                <Form id="transcript-form" onSubmit={handleSubmit}>
                  <div className="flex flex-col w-full gap-4">
                    {tab === 0 && (
                      <>
                        <Input
                          ref={fileInputRef}
                          size="md"
                          type="file"
                          accept=".txt"
                          label="Select a file (max 100mb)"
                          labelPlacement="outside"
                          onChange={handleFileChange}
                        />

                        <div className="flex items-center justify-center">
                          {fileLoading ? (
                            <div className="flex flex-col items-center">
                              <Spinner />
                              <p className="mt-2">Loading file...</p>
                            </div>
                          ) : (
                            <div className="flex w-full flex-col">
                              <Textarea
                                ref={textareaRef}
                                minRows={20}
                                isRequired
                                label="Content preview"
                                labelPlacement="outside"
                                placeholder="File content will appear here"
                                className="overflow-auto"
                                value={formData.content}
                                onValueChange={(value) =>
                                  updateField("content", value)
                                }
                                isInvalid={!!errors.content}
                              />
                              {errors.content && (
                                <p className="text-danger text-sm mt-1">
                                  {errors.content}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {tab === 1 && (
                      <>
                        <EmployeeSelection
                          onChange={(id) => updateField("employeeId", id)}
                          error={errors.employeeId}
                        />

                        <CompanyContactSelection
                          companyId={formData.externalCompanyId}
                          contactId={formData.contactId}
                          onChange={(companyId, contactId) => {
                            updateField("externalCompanyId", companyId);
                            updateField("contactId", contactId);
                          }}
                        />

                        <ConversationDatePicker
                          value={formData.timestamp}
                          onChange={(date) => updateField("timestamp", date)}
                          error={errors.timestamp}
                        />
                      </>
                    )}
                    {tab === 2 && (
                      <>
                        <ReviewAutoStartToggle
                          autoStart={formData.autoStartReview}
                          onAutoStartChange={(autoStart) =>
                            updateField("autoStartReview", autoStart)
                          }
                        />

                        <ReviewTypeSelector
                          reviewType={formData.reviewType}
                          onReviewTypeChange={(type) =>
                            updateField("reviewType", type)
                          }
                          disabled={!formData.autoStartReview}
                        />

                        <ReviewConfigSelector
                          reviewType={formData.reviewType}
                          onChange={(config) => {
                            updateField("reviewConfigId", config?._id);
                            setSelectedConfig(config);
                          }}
                          error={errors.reviewConfigId}
                          disabled={
                            !formData.autoStartReview ||
                            formData.reviewType === "sentiment"
                          }
                        />

                        {formData.autoStartReview &&
                          selectedConfig &&
                          (formData.reviewType === "performance" ||
                            formData.reviewType === "both") && (
                            <CriteriaWeightsEditor
                              selectedConfig={selectedConfig}
                              editedWeights={editedWeights}
                              onWeightChange={handleWeightChange}
                              onRemoveCriterion={handleRemoveCriterion}
                            />
                          )}
                      </>
                    )}
                  </div>
                </Form>
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-end py-2 gap-4 w-full">
                  {tab === 0 && (
                    <>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        onPress={() => {
                          handleNextStep(tab + 1);
                        }}
                        isDisabled={fileLoading}
                      >
                        Next step
                      </Button>
                    </>
                  )}
                  {tab === 1 && (
                    <>
                      <Button
                        variant="light"
                        onPress={() => handleBackStep(tab - 1)}
                      >
                        Back
                      </Button>
                      <Button
                        color="primary"
                        onPress={() => {
                          handleNextStep(tab + 1);
                        }}
                      >
                        Next step
                      </Button>
                    </>
                  )}
                  {tab === 2 && (
                    <>
                      <Button
                        variant="light"
                        onPress={() => handleBackStep(tab - 1)}
                      >
                        Back
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        form="transcript-form"
                        isLoading={isSubmitting}
                        isDisabled={
                          fileLoading || Object.keys(errors).length > 0
                        }
                      >
                        {isSubmitting ? "Uploading..." : "Upload"}
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
