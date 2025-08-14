import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/react";

interface ViewReviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reviewId: string | undefined;
}

export default function ViewReviewModal({
  isOpen,
  onOpenChange,
  reviewId: review,
}: ViewReviewModalProps) {
  if (!review) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Review Details
            </ModalHeader>
            <ModalBody></ModalBody>
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
