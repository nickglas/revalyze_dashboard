// src/components/modals/teams/addCriteria.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button, Input, Textarea, Switch, Form } from "@heroui/react";
import { useCriteriaStore } from "@/store/criteriaStore";
import SearchExternalCompany from "@/components/data/externalCompany/searchExternalCompany";

export default function AddTranscriptModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary">
        Upload transcript
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload transcript
              </ModalHeader>
              <ModalBody>
                <Form id="criteria-form">
                  <div className="flex flex-col w-full gap-4">
                    <Input
                      size="md"
                      type="file"
                      label="Select a file"
                      labelPlacement="outside"
                    />
                    <SearchExternalCompany label="Assign transcript to company" />
                  </div>
                </Form>
              </ModalBody>
              <ModalFooter>
                <div className="flex items-center justify-end gap-4 w-full">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" form="criteria-form">
                    Submit transcript
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
