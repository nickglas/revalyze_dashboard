import { useReviewStore } from "@/store/reviewStore";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Tab,
  Tabs,
  Textarea,
} from "@heroui/react";
import { useEffect, useState } from "react";

interface ViewReviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reviewId: string | undefined;
}

export default function ViewReviewModal({
  isOpen,
  onOpenChange,
  reviewId,
}: ViewReviewModalProps) {
  if (!reviewId) return null;

  const { fetchById, isLoading, selectedReview } = useReviewStore();
  const [selectedKey, setSelectedKey] = useState("overview");

  useEffect(() => {
    if (isOpen && reviewId) {
      fetchById(reviewId);
    }
  }, [isOpen, reviewId, fetchById]);

  const RenderSentiment = () => {
    return (
      <Accordion>
        <AccordionItem
          key="1"
          aria-label="Accordion 1"
          title={
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Sentiment Analysis</span>
              <Chip
                color={
                  selectedReview!.sentimentScore >= 7
                    ? "success"
                    : selectedReview!.sentimentScore >= 5
                      ? "warning"
                      : "danger"
                }
                className="text-white"
              >
                {selectedReview!.sentimentScore}/10
              </Chip>
            </div>
          }
        >
          <div>
            <h3 className="text-md font-semibold">Analysis details</h3>
            <p className="text-sm">
              The customer started worried and became frustrated with the
              agent's responses and lack of guarantees.
            </p>
          </div>
        </AccordionItem>
      </Accordion>
    );
  };

  const RenderPerformance = () => {
    return (
      <div className="flex flex-col gap-2">
        <Accordion>
          {(selectedReview?.criteriaScores ?? []).map((c) => (
            <AccordionItem
              title={
                <div className="flex items-center justify-between">
                  <h3>{c.criterionName}</h3>
                  <Chip
                    color={
                      c.score >= 7
                        ? "success"
                        : c.score >= 5
                          ? "warning"
                          : "danger"
                    }
                    className="text-white"
                  >
                    {c.score}/10
                  </Chip>
                </div>
              }
            >
              <div className="flex flex-col gap-2 ">
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold">Comment:</h4>
                  <p className="text-xs">{c.comment}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold">Quote:</h4>
                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-800 rounded-r">
                    <p className="italic text-gray-300 text-xs">"{c.quote}"</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold">Feedback:</h4>
                  <p className="text-xs">{c.feedback}</p>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Review Details
            </ModalHeader>
            <ModalBody>
              {isLoading && (
                <div className="flex flex-col items-center gap-4">
                  <Spinner size="lg" />
                  <span className="text-sm">Loading review data</span>
                </div>
              )}
              {!isLoading && selectedReview && (
                <div>
                  <Tabs
                    selectedKey={selectedKey}
                    onSelectionChange={(k) => setSelectedKey(k as string)}
                    fullWidth
                    size="md"
                    color="primary"
                    disableAnimation
                  >
                    <Tab key={"overview"} title={"Overview"}>
                      <Card>
                        <CardHeader className="flex justify-between">
                          <h1 className="text-2xl font-semibold">
                            Review overview
                          </h1>
                          <Chip
                            color={
                              selectedReview.overallScore >= 7
                                ? "success"
                                : selectedReview.overallScore >= 5
                                  ? "warning"
                                  : "danger"
                            }
                            className="text-white"
                          >
                            {selectedReview.overallScore}/10
                          </Chip>
                        </CardHeader>
                        <CardBody>
                          <div className="flex flex-col gap-4">
                            <div>
                              <h2 className="text-lg font-semibold">
                                Subject:
                              </h2>
                              <p className="text-sm">
                                {selectedReview.subject}
                              </p>
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold">
                                Review type:
                              </h2>
                              <p className="text-sm">
                                {selectedReview.type === "both" &&
                                  "Performance & sentiment analysis"}
                                {selectedReview.type === "performance" &&
                                  "Performance based analysis"}
                                {selectedReview.type === "sentiment" &&
                                  "Sentiment based analysis"}
                              </p>
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold">
                                Overall feedback:
                              </h2>
                              <p className="text-sm">
                                {selectedReview.overallFeedback}
                              </p>
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold">
                                Related company & contact
                              </h2>
                              <div className="flex justify-between">
                                <div className="flex items-center gap-1 my-2">
                                  <Avatar
                                    name={
                                      selectedReview.externalCompanyId?.name[0]
                                    }
                                  />
                                  <div className="flex flex-col justify-between">
                                    <span className="text-sm font-semibold">
                                      {selectedReview.externalCompanyId?.name}
                                    </span>
                                    <span className="text-tiny">
                                      {selectedReview.externalCompanyId?.email}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 my-2">
                                  <Avatar
                                    name={
                                      selectedReview.contactId?.firstName[0]
                                    }
                                  />
                                  <div className="flex flex-col justify-between">
                                    <span className="text-sm font-semibold">
                                      {selectedReview.contactId?.firstName}
                                    </span>
                                    <span className="text-tiny">
                                      {selectedReview.contactId?.email}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <div>
                                <h4 className="text-sm">Transcript Id</h4>
                                <span className="text-tiny text-gray-500">
                                  {selectedReview.transcriptId._id}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-sm">Review Id</h4>
                                <span className="text-tiny text-gray-500">
                                  {selectedReview._id}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab
                      key={"scores"}
                      title={"Scores"}
                      className="flex flex-col gap-4"
                    >
                      <Card>
                        <CardHeader>
                          <h1 className="ml-1">Original transcript</h1>
                        </CardHeader>
                        <CardBody>
                          <Textarea
                            value={selectedReview.transcriptId.content}
                            isReadOnly
                          />
                        </CardBody>
                      </Card>
                      <Card>
                        <CardHeader>
                          <h1>Scores and feedback</h1>
                        </CardHeader>
                        <CardBody>
                          <Tabs
                            color="primary"
                            fullWidth
                            size="sm"
                            disableAnimation
                          >
                            <Tab title="Performance">
                              <RenderPerformance />
                            </Tab>
                            <Tab title="Sentiment">
                              <RenderSentiment />
                            </Tab>
                          </Tabs>
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab key={"configuration"} title={"Configuration"}>
                      <Card>
                        <CardHeader className="flex flex-col gap-1">
                          <h1 className="text-xl font-semibold">
                            {selectedReview.reviewConfig.name}
                          </h1>
                          <p className="text-sm text-gray-400">
                            {selectedReview.reviewConfig.description}
                          </p>
                        </CardHeader>
                        <CardBody className="flex flex-col gap-6">
                          {/* Criteria */}
                          <div>
                            <div className="flex flex-col gap-4">
                              {selectedReview.reviewConfig.criteria.map((c) => (
                                <Card key={c.criterionId} className="p-3">
                                  <div className="flex justify-between items-start">
                                    <h3 className="text-md font-semibold">
                                      {c.title}
                                    </h3>
                                    <Chip color="primary" variant="flat">
                                      {Math.round(c.weight * 100)}%
                                    </Chip>
                                  </div>
                                  <p className="text-sm text-gray-300 mt-1">
                                    {c.description}
                                  </p>
                                </Card>
                              ))}
                            </div>
                          </div>

                          {/* Model Settings */}
                          <div>
                            <h2 className="text-lg font-semibold mb-2">
                              Model Settings
                            </h2>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-400">
                                  Temperature
                                </span>
                                <span className="text-sm">
                                  {
                                    selectedReview.reviewConfig.modelSettings
                                      .temperature
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-400">
                                  Max Tokens
                                </span>
                                <span className="text-sm">
                                  {
                                    selectedReview.reviewConfig.modelSettings
                                      .maxTokens
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Tab>
                  </Tabs>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
