// src/components/modals/criteria/viewCriteriaModal.tsx
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Input, Textarea, Switch } from "@heroui/react";
import { Criterion } from "@/models/api/criteria.api.model";

interface ViewCriteriaModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  criterion: Criterion | null;
}

export default function ViewCriteriaModal({
  isOpen,
  onOpenChange,
  criterion,
}: ViewCriteriaModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              View Criteria
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col w-full gap-4">
                <Input
                  label="Title"
                  labelPlacement="outside"
                  value={criterion?.title || ""}
                  readOnly
                />

                <Textarea
                  label="Description"
                  labelPlacement="outside"
                  value={criterion?.description || ""}
                  readOnly
                />

                <Switch isReadOnly isSelected={criterion?.isActive || false}>
                  Is active
                </Switch>
              </div>
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
