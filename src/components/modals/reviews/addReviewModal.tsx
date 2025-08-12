// src/components/modals/teams/AddReviewModal.tsx
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
import SearchUsers from "@/components/data/users/searchUsers";
import { User } from "@/models/api/user.model";
import { ManagerSelection } from "@/components/managerSelection";
import { toast } from "react-toastify";
import { CreateTeamDTO } from "@/models/dto/create.team.dto";
import { useReviewStore } from "@/store/reviewStore";

export default function AddReviewModal() {
  const [tab, setTab] = useState(0);
  const { fetchReviews } = useReviewStore();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [postData, setPostData] = useState<CreateTeamDTO>({
    name: "",
    description: "",
    isActive: true,
    users: [],
  });

  useEffect(() => {
    if (!isOpen) {
      setPostData({
        name: "",
        description: "",
        isActive: true,
        users: [],
      });
      setErrors({});
    }
  }, [isOpen]);

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary">
        Create review
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create new review for transcript
              </ModalHeader>
              <ModalBody>
                <Form id="criteria-form">
                  <div className="flex flex-col w-full gap-4"></div>
                </Form>
              </ModalBody>
              <ModalFooter>
                <div className="flex items-center justify-end gap-4 w-full">
                  {tab === 0 && (
                    <>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={onClose}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button color="primary" onPress={() => setTab(tab + 1)}>
                        Next step
                      </Button>
                    </>
                  )}

                  {tab === 1 && (
                    <>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={() => setTab(tab - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        form="criteria-form"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Adding..." : "Add team"}
                      </Button>
                    </>
                  )}
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
