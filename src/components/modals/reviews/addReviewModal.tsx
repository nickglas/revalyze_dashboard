// src/components/modals/teams/AddReviewModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button, Form } from "@heroui/react";
import { toast } from "react-toastify";

import { useReviewStore } from "@/store/reviewStore";
import SearchTranscripts from "@/components/data/transcripts/searchTranscripts";
import { TranscriptSummaryDto } from "@/models/dto/transcripts/transcript.summary.dto";
import EmployeeDisplay from "@/components/new/EmployeeDisplay";
import CompanyContactDisplay from "@/components/new/CompanyContactDisplay";
import DateDisplay from "@/components/new/DateDisplay";
import TranscriptContentDisplay from "@/components/new/TranscriptContentDisplay";
import ReviewTypeSelector from "@/components/new/ReviewTypeSelector";
import ReviewConfigSelector from "@/components/new/ReviewConfigSelector";
import CriteriaWeightsEditor from "@/components/new/CriteriaWeightsEditor";
import { ReviewConfig } from "@/models/api/review.config.api.model";

export default function AddReviewModal() {
  const [tab, setTab] = useState(0);
  const { createReview } = useReviewStore();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTranscript, setSelectedTranscript] =
    useState<TranscriptSummaryDto | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<
    ReviewConfig | undefined
  >(undefined);
  const [editedWeights, setEditedWeights] = useState<Record<string, number>>(
    {}
  );

  // Form data structure
  const [formData, setFormData] = useState<CreateReviewDTO>({
    transcriptId: "",
    type: "both",
    reviewConfigId: undefined,
    criteriaWeights: [],
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTranscript(null);
      setSelectedConfig(undefined);
      setEditedWeights({});
      setFormData({
        transcriptId: "",
        type: "both",
        reviewConfigId: undefined,
        criteriaWeights: [],
      });
      setErrors({});
      setTab(0);
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

  // Handle transcript selection
  useEffect(() => {
    if (selectedTranscript) {
      setFormData((prev) => ({
        ...prev,
        transcriptId: selectedTranscript.id,
      }));
    }
  }, [selectedTranscript]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (tab === 0 && !selectedTranscript) {
      newErrors.transcript = "Please select a transcript";
    }

    if (tab === 1) {
      if (!formData.type) {
        newErrors.reviewType = "Review type is required";
      }

      if (
        (formData.type === "performance" || formData.type === "both") &&
        !formData.reviewConfigId
      ) {
        newErrors.reviewConfig =
          "Review config is required for performance analysis";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (!validateForm()) return;
    setTab(tab + 1);
  };

  // Handle back step
  const handleBackStep = () => {
    setTab(tab - 1);
  };

  // Update form fields
  const updateField = <K extends keyof CreateReviewDTO>(
    field: K,
    value: CreateReviewDTO[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when field changes
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle weight change
  const handleWeightChange = (criterionId: string, value: number) => {
    setEditedWeights((prev) => ({ ...prev, [criterionId]: value }));
  };

  // Handle criterion removal
  const handleRemoveCriterion = (criterionId: string) => {
    setEditedWeights((prev) => {
      const newWeights = { ...prev };
      delete newWeights[criterionId];
      return newWeights;
    });
  };

  // Handle config selection
  const handleConfigChange = (config: ReviewConfig | undefined) => {
    setSelectedConfig(config);
    updateField("reviewConfigId", config?._id || undefined);
  };

  // Handle review type change
  const handleReviewTypeChange = (
    type: "sentiment" | "performance" | "both"
  ) => {
    updateField("type", type);

    // Clear config if switching to sentiment-only
    if (type === "sentiment") {
      setSelectedConfig(undefined);
      updateField("reviewConfigId", undefined);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Prepare criteria weights if applicable
      if (
        selectedConfig &&
        (formData.type === "performance" || formData.type === "both")
      ) {
        const weights = Object.entries(editedWeights);
        if (weights.length > 0) {
          formData.criteriaWeights = weights.map(([criterionId, weight]) => ({
            criterionId,
            weight,
          }));
        }
      }

      await createReview(formData);
      toast.success("Review created successfully");
      onClose();
    } catch (err) {
      console.error("Review creation failed:", err);
      toast.error("Failed to create review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary">
        Create review
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create new review for transcript
              </ModalHeader>
              <ModalBody>
                <Form id="review-form" onSubmit={handleSubmit}>
                  <div className="flex flex-col w-full gap-4">
                    {tab === 0 && (
                      <div className="flex flex-col gap-4">
                        <SearchTranscripts
                          required
                          onChange={setSelectedTranscript}
                        />
                        {errors.transcript && (
                          <p className="text-danger text-sm -mt-3">
                            {errors.transcript}
                          </p>
                        )}

                        <>
                          <EmployeeDisplay
                            employee={{
                              _id: selectedTranscript?.employeeId,
                              email: selectedTranscript?.employeeEmail,
                              name: selectedTranscript?.employeeName,
                            }}
                          />

                          <CompanyContactDisplay
                            company={{
                              _id: selectedTranscript?.externalCompanyId,
                              name: selectedTranscript?.externalCompanyName,
                            }}
                            contact={{
                              _id: selectedTranscript?.contactId,
                              email: selectedTranscript?.contactEmail,
                              name: selectedTranscript?.contactFirstName,
                            }}
                          />

                          <DateDisplay
                            date={selectedTranscript?.timestamp}
                            label="Conversation Date"
                          />

                          <TranscriptContentDisplay
                            content={selectedTranscript?.contentPreview}
                          />
                        </>
                      </div>
                    )}

                    {tab === 1 && selectedTranscript && (
                      <div className="space-y-4">
                        <ReviewTypeSelector
                          reviewType={formData.type}
                          onReviewTypeChange={handleReviewTypeChange}
                        />
                        {errors.reviewType && (
                          <p className="text-danger text-sm -mt-3">
                            {errors.reviewType}
                          </p>
                        )}

                        <ReviewConfigSelector
                          value={selectedConfig}
                          reviewType={formData.type}
                          onChange={handleConfigChange}
                          disabled={formData.type === "sentiment"}
                        />
                        {errors.reviewConfig && (
                          <p className="text-danger text-sm -mt-3">
                            {errors.reviewConfig}
                          </p>
                        )}

                        <CriteriaWeightsEditor
                          selectedConfig={selectedConfig}
                          editedWeights={editedWeights}
                          onWeightChange={handleWeightChange}
                          onRemoveCriterion={handleRemoveCriterion}
                        />
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
                      <Button
                        color="primary"
                        onPress={handleNextStep}
                        isDisabled={!selectedTranscript}
                      >
                        Next step
                      </Button>
                    </>
                  )}

                  {tab === 1 && (
                    <>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={handleBackStep}
                      >
                        Previous
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        form="review-form"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Creating..." : "Create Review"}
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
