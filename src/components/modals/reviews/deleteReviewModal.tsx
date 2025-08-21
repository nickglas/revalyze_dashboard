import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useReviewStore } from "@/store/reviewStore";

interface DeleteReviewModalProps {
  reviewId: string | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteReviewModal({
  reviewId,
  isOpen,
  onOpenChange,
}: DeleteReviewModalProps) {
  const { deleteReview, isDeleting } = useReviewStore();

  const handleDelete = async () => {
    if (!reviewId) return;
    try {
      await deleteReview(reviewId);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Review {reviewId}
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this review?</p>
              <p className="text-danger">This action cannot be undone.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={handleDelete}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
