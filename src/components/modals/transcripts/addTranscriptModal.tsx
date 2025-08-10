import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import {
  Button,
  Input,
  Form,
  DatePicker,
  Textarea,
  Spinner,
  Alert,
  Checkbox,
} from "@heroui/react";
import SearchUsers from "@/components/data/users/searchUsers";
import { useTranscriptStore } from "@/store/transcriptStore";
import { CreateTranscriptDTO } from "@/models/dto/create.transcript.dto";
import { formatISO, startOfDay } from "date-fns";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { toast } from "react-toastify";
import CompanyContactSelector from "@/components/data/externalCompany/companyContactSelector";
import SearchConfigs from "@/components/data/reviewConfigs/searchConfigs";

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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<
    Omit<CreateTranscriptDTO, "timestamp"> & {
      timestamp: Date | null;
      autoStartReview: boolean;
      reviewConfigId: string;
    }
  >({
    content: "",
    timestamp: getTodayAtMidnight(),
    employeeId: "",
    externalCompanyId: "",
    contactId: "",
    autoStartReview: false,
    reviewConfigId: "",
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
        autoStartReview: true,
        reviewConfigId: "",
      });
      setErrors({});
      setTab(0);

      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

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

      if (formData.autoStartReview) {
        if (!formData.reviewConfigId || formData.reviewConfigId.trim() === "") {
          newErrors.reviewConfigId =
            "Review config is required when auto start review is enabled";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateForm()) return;
    setTab(1);
  };

  const handleBackStep = () => {
    setTab(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createTranscript({
        ...formData,
        timestamp: formData.timestamp
          ? formatISO(formData.timestamp, { representation: "complete" })
          : "",
      });

      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
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

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary">
        Upload transcript
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={tab === 0 ? "2xl" : "md"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload transcript
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-between mb-4">
                  {[1, 2].map((step) => (
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
                        <SearchUsers
                          required
                          label="Search for employee"
                          onChange={(user) =>
                            updateField("employeeId", user?._id || "")
                          }
                        />
                        {errors.employeeId && (
                          <p className="text-danger text-sm -mt-3">
                            {errors.employeeId}
                          </p>
                        )}

                        <CompanyContactSelector
                          selectedCompanyId={formData.externalCompanyId}
                          selectedContactId={formData.contactId}
                          onChange={({ company, contact }) => {
                            updateField(
                              "externalCompanyId",
                              company?._id || undefined
                            );
                            updateField("contactId", contact?._id || undefined);
                          }}
                        />

                        <DatePicker
                          label="Conversation Date"
                          labelPlacement="outside"
                          value={
                            formData.timestamp
                              ? parseDate(
                                  formatISO(formData.timestamp, {
                                    representation: "date",
                                  })
                                )
                              : undefined
                          }
                          onChange={(value) => {
                            if (value) {
                              const jsDate = value.toDate(getLocalTimeZone());
                              const today = getTodayAtMidnight();

                              if (jsDate > today) {
                                toast.warn(
                                  "Conversation date cannot be in the future"
                                );
                                updateField("timestamp", today);
                                return;
                              }

                              updateField("timestamp", jsDate);
                            } else {
                              updateField("timestamp", null as any);
                            }
                          }}
                          isRequired
                          isInvalid={!!errors.timestamp}
                          errorMessage={errors.timestamp}
                        />
                        <SearchConfigs
                          required
                          isDisabled={!formData.autoStartReview}
                          label="Set config"
                          onChange={(config) =>
                            updateField("reviewConfigId", config?._id || "")
                          }
                        />
                        {errors.reviewConfigId && (
                          <p className="text-danger text-sm mt-1">
                            {errors.reviewConfigId}
                          </p>
                        )}

                        <Checkbox
                          size="sm"
                          isSelected={formData.autoStartReview}
                          onValueChange={(checked) =>
                            updateField("autoStartReview", checked)
                          }
                        >
                          Auto start review process
                        </Checkbox>
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
                        onPress={handleNextStep}
                        isDisabled={fileLoading}
                      >
                        Next step
                      </Button>
                    </>
                  )}
                  {tab === 1 && (
                    <>
                      <Button variant="light" onPress={handleBackStep}>
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
