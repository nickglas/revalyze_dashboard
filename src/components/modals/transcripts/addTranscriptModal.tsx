// src/components/modals/teams/addCriteria.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import { Button, Input, Textarea, Form, DatePicker } from "@heroui/react";
import SearchExternalCompany from "@/components/data/externalCompany/searchExternalCompany";
import SearchUsers from "@/components/data/users/searchUsers";
import SearchContacts from "@/components/data/contacts/searchContact";

export default function AddTranscriptModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [tab, setTab] = useState(0);
  const [fileContent, setFileContent] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only allow .txt files
    if (file.type !== "text/plain") {
      alert("Only .txt files are allowed.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text);
    };
    reader.onerror = () => {
      alert("Error reading file.");
    };
    reader.readAsText(file);
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
                <Form id="criteria-form">
                  <div className="flex flex-col w-full gap-4">
                    {tab === 0 && (
                      <>
                        <Input
                          size="md"
                          type="file"
                          accept=".txt"
                          label="Select a file"
                          labelPlacement="outside"
                          onChange={handleFileChange}
                        />
                        <Textarea
                          label="Description"
                          labelPlacement="outside"
                          minRows={10}
                          placeholder="Enter your description"
                          isClearable
                          value={fileContent}
                          onChange={(e) => setFileContent(e.target.value)}
                        />
                      </>
                    )}
                    {tab === 1 && (
                      <>
                        <SearchUsers required label="Search for employee" />
                        <SearchExternalCompany label="Search for company" />
                        <SearchContacts
                          required={false}
                          label="Search for contact"
                        />
                        <DatePicker
                          label={"Conversation Date"}
                          labelPlacement="outside"
                        />
                      </>
                    )}
                  </div>
                </Form>

                <div className="flex justify-end py-2 gap-4">
                  {tab === 0 && (
                    <>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                      </Button>
                      <Button color="primary" onPress={() => setTab(tab + 1)}>
                        Next step
                      </Button>
                    </>
                  )}
                  {tab === 1 && (
                    <>
                      <Button variant="light" onPress={() => setTab(tab - 1)}>
                        Back
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        form="criteria-form"
                      >
                        Upload
                      </Button>
                    </>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
