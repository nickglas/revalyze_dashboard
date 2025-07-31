import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Form, Input, Select, SelectItem } from "@heroui/react";
import { Switch } from "@heroui/react";

export const userRoles = [
  { key: "admin", label: "Admin" },
  { key: "employee", label: "Employee" },
];

export default function AddUserModal() {
  const [submitted, setSubmitted] = React.useState<{
    [k: string]: FormDataEntryValue;
  } | null>(null);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onSubmit = (e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    // Custom validation checks
    const newErrors = {};

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    if (data.terms !== "true") {
      setErrors({ terms: "Please accept the terms" });

      return;
    }

    // Clear errors and submit
    setErrors({});
    setSubmitted(data);
  };

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary">
        Add user
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add new user
              </ModalHeader>
              <ModalBody>
                <Form
                  className="w-full space-y-4 flex flex-1"
                  validationErrors={errors}
                  onReset={() => setSubmitted(null)}
                  onSubmit={onSubmit}
                >
                  <div className="flex flex-col gap-4 w-full">
                    <Input
                      isRequired
                      errorMessage={({ validationDetails }) => {
                        if (validationDetails.valueMissing) {
                          return "Please enter the new users name";
                        }

                        return errors.name ?? "";
                      }}
                      label="Name"
                      labelPlacement="outside"
                      name="name"
                      placeholder="Enter the new users name"
                    />

                    <Input
                      isRequired
                      errorMessage={({ validationDetails }) => {
                        if (validationDetails.valueMissing) {
                          return "Please enter new users email";
                        }
                        if (validationDetails.typeMismatch) {
                          return "Please enter a valid email address";
                        }
                      }}
                      label="Email"
                      labelPlacement="outside"
                      name="email"
                      placeholder="Enter new users email"
                      type="email"
                    />

                    <Select
                      items={userRoles}
                      label="Select role"
                      placeholder="Select a role"
                      labelPlacement="outside"
                      defaultSelectedKeys={"employee"}
                      isRequired
                    >
                      {(animal) => <SelectItem>{animal.label}</SelectItem>}
                    </Select>

                    <Switch defaultSelected color="primary" size="sm">
                      Enable user
                    </Switch>

                    {errors.terms && (
                      <span className="text-danger text-small">
                        {errors.terms}
                      </span>
                    )}
                  </div>

                  {submitted && (
                    <div className="text-small text-default-500 mt-4">
                      Submitted data:{" "}
                      <pre>{JSON.stringify(submitted, null, 2)}</pre>
                    </div>
                  )}
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Add user
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
