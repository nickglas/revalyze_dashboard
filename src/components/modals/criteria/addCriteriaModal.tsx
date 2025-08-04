// src/components/modals/teams/addTeamModal.tsx
import React, { useState } from "react";
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
  Textarea,
  Switch,
  Select,
  SelectItem,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Checkbox,
  Form,
} from "@heroui/react";

export default function AddCriteriaModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary">
        Add criteria
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create criteria
              </ModalHeader>
              <ModalBody>
                <Form>
                  <div className="flex flex-col w-full gap-4">
                    <Input
                      isRequired
                      // errorMessage={errors.name}
                      label="Title"
                      labelPlacement="outside"
                      name="title"
                      placeholder="Enter the new criteria's name"
                    />
                    <Textarea
                      isClearable
                      isRequired
                      label="Description"
                      labelPlacement="outside"
                      placeholder="Description"
                    />
                    <Switch defaultSelected>Is active</Switch>
                    <div className="flex items-center justify-end gap-4 mb-2">
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" type="submit" form="form">
                        Add user
                      </Button>
                    </div>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
