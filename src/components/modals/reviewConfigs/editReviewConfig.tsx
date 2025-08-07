import { ReviewConfig } from "@/models/api/review.config.api.model";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";

export default function EditReviewConfigModal({
  isOpen,
  onOpenChange,
  config,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  config: ReviewConfig | null;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Review Configuration Details</ModalHeader>
        <ModalBody>
          {config ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold">{config.name}</h3>
                <p className="text-gray-500">ID: {config._id}</p>
              </div>

              <div>
                <h4 className="font-medium">Model Settings</h4>
                <p>Temperature: {config.modelSettings.temperature}</p>
                <p>Max Tokens: {config.modelSettings.maxTokens}</p>
              </div>

              <div>
                <h4 className="font-medium">
                  Criteria ({config.criteria.length})
                </h4>
                <ul className="list-disc pl-5">
                  {config.criteria.map((criterion) => (
                    <li key={criterion._id}>
                      {criterion.title} - {criterion.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>No configuration selected</p>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
