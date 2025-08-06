import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Input, Textarea, Switch } from "@heroui/react";
import { Contact } from "@/models/api/contact.api.model";

interface ViewExternalContactModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  contact: Contact | null;
}

export default function ViewExternalContactModal({
  isOpen,
  onOpenChange,
  contact,
}: ViewExternalContactModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              View Contact Details
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col w-full gap-4">
                <div className="flex gap-4">
                  <Input
                    label="First Name"
                    labelPlacement="outside"
                    value={contact?.firstName || ""}
                    readOnly
                  />
                  <Input
                    label="Last Name"
                    labelPlacement="outside"
                    value={contact?.lastName || ""}
                    readOnly
                  />
                </div>

                <Input
                  label="Email"
                  labelPlacement="outside"
                  value={contact?.email || ""}
                  readOnly
                />

                <Input
                  label="Phone"
                  labelPlacement="outside"
                  value={contact?.phone || ""}
                  readOnly
                />

                <Input
                  label="Position"
                  labelPlacement="outside"
                  value={contact?.position || ""}
                  readOnly
                />

                <Input
                  label="Company"
                  labelPlacement="outside"
                  value={contact?.externalCompany?.name || "Unknown Company"}
                  readOnly
                />

                <Switch isReadOnly isSelected={contact?.isActive || false}>
                  Active Status
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
