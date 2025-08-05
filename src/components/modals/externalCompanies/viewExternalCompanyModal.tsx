import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Input, Textarea, Switch } from "@heroui/react";
import { ExternalCompany } from "@/models/api/external.company.model";

interface ViewExternalCompanyModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  company: ExternalCompany | null;
}

export default function ViewExternalCompanyModal({
  isOpen,
  onOpenChange,
  company,
}: ViewExternalCompanyModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              View Company Details
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col w-full gap-4">
                <Input
                  label="Company Name"
                  labelPlacement="outside"
                  value={company?.name || ""}
                  readOnly
                />

                <Input
                  label="Email"
                  labelPlacement="outside"
                  value={company?.email || ""}
                  readOnly
                />

                <Input
                  label="Phone"
                  labelPlacement="outside"
                  value={company?.phone || ""}
                  readOnly
                />

                <Textarea
                  label="Address"
                  labelPlacement="outside"
                  value={company?.address || ""}
                  readOnly
                />

                <Switch isReadOnly isSelected={company?.isActive || false}>
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
