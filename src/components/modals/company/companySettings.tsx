// components/CompanySettingsModal.tsx
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  Tooltip,
  useDisclosure,
  Form,
  Input,
  Chip,
  Progress,
} from "@heroui/react";
import React, { useState } from "react";
import { FaGear } from "react-icons/fa6";

interface Props {
  collapsed: boolean;
}

type CompanyFormData = {
  name: string;
  mainEmail: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

const CompanySettingsModal: React.FC<Props> = ({ collapsed }) => {
  // Mock company data - in real app this would come from your Company entity
  const [company, setCompany] = useState({
    id: "comp_123",
    name: "Acme Inc.",
    mainEmail: "contact@acme.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
      country: "USA",
    },
    stripeCustomerId: "cus_123456789",
    isActive: true,
    hashedApiKey: "sk_test_1234567890abcdef",
    apiKeyCreatedAt: "2023-01-15T12:00:00Z",
  });

  // Mock subscription data - from your Subscription entity
  const [subscription, setSubscription] = useState({
    status: "active",
    productName: "Business Plan",
    amount: 99,
    currency: "usd",
    interval: "month",
    currentPeriodStart: "2023-08-01",
    currentPeriodEnd: "2023-09-01",
    cancelAtPeriodEnd: false,
    allowedUsers: 10,
    allowedTranscripts: 500,
    allowedReviews: 200,
    usedUsers: 8,
    usedTranscripts: 243,
    usedReviews: 178,
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState("profile");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleSubmit = (formData: FormData) => {
    console.log("Saving company data:", Object.fromEntries(formData));
    onClose(); // Call the function properly
  };

  const buttonTrigger = (
    <button
      onClick={onOpen}
      className="flex items-center gap-3 px-2 py-2 rounded-md transition text-sm hover:bg-muted/50 text-foreground w-full text-left"
    >
      <FaGear className="w-5 h-5" />
      {!collapsed && <span>Company Settings</span>}
    </button>
  );

  return (
    <>
      {collapsed ? (
        <Tooltip content="Company Settings" placement="right">
          {buttonTrigger}
        </Tooltip>
      ) : (
        buttonTrigger
      )}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        disableAnimation
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Manage Company Settings</ModalHeader>
              <ModalBody>
                {isOpen && (
                  <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(String(key))}
                    aria-label="Manage company settings"
                    color="primary"
                    fullWidth
                    disableAnimation
                    destroyInactiveTabPanel={false}
                  >
                    <Tab key="profile" title="Company Profile" />
                    <Tab key="subscription" title="Subscription" />
                    <Tab key="team" title="Team Members" />
                    <Tab key="billing" title="Billing" />
                  </Tabs>
                )}

                <div className="mt-6">
                  {activeTab === "profile" && (
                    <Form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Company Name"
                          name="name"
                          value={company.name}
                          onChange={handleInputChange}
                          isRequired
                        />
                        <Input
                          label="Contact Email"
                          name="mainEmail"
                          type="email"
                          value={company.mainEmail}
                          onChange={handleInputChange}
                          isRequired
                        />
                        <Input
                          label="Phone"
                          name="phone"
                          value={company.phone}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="md:col-span-2 mt-6">
                        <h3 className="text-md font-medium mb-2">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Street"
                            name="street"
                            value={company.address.street}
                            onChange={handleAddressChange}
                          />
                          <Input
                            label="City"
                            name="city"
                            value={company.address.city}
                            onChange={handleAddressChange}
                          />
                          <Input
                            label="State/Province"
                            name="state"
                            value={company.address.state}
                            onChange={handleAddressChange}
                          />
                          <Input
                            label="Postal Code"
                            name="postalCode"
                            value={company.address.postalCode}
                            onChange={handleAddressChange}
                          />
                          <Input
                            label="Country"
                            name="country"
                            value={company.address.country}
                            onChange={handleAddressChange}
                          />
                        </div>
                      </div>
                    </Form>
                  )}

                  {activeTab === "subscription" && (
                    <div className="flex flex-col">
                      <div>
                        <h3 className="font-medium mb-4">Usage</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Active users</span>
                              <span>
                                {subscription.usedUsers} /{" "}
                                {subscription.allowedUsers}
                              </span>
                            </div>
                            <Progress
                              value={
                                (subscription.usedUsers /
                                  subscription.allowedUsers) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Transcripts this month</span>
                              <span>
                                {subscription.usedTranscripts} /{" "}
                                {subscription.allowedTranscripts}
                              </span>
                            </div>
                            <Progress
                              value={
                                (subscription.usedTranscripts /
                                  subscription.allowedTranscripts) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Reviews this month</span>
                              <span>
                                {subscription.usedReviews} /{" "}
                                {subscription.allowedReviews}
                              </span>
                            </div>
                            <Progress
                              value={
                                (subscription.usedReviews /
                                  subscription.allowedReviews) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-4 mt-10">
                        <div className="border border-gray-700 rounded-lg p-4 hover:border-primary transition-colors">
                          <div className="flex justify-between">
                            <h3 className="font-bold">Starter Plan</h3>
                            <span className="text-primary font-bold">
                              $49/mo
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm my-2">
                            For small teams getting started
                          </p>
                          <ul className="text-sm space-y-1 mb-4">
                            <li>• 5 users</li>
                            <li>• 100 transcripts/month</li>
                            <li>• 50 reviews/month</li>
                            <li>• Basic support</li>
                            <li>• Priority support</li>
                          </ul>
                          <Button variant="ghost" className="w-full">
                            Downgrade plan
                          </Button>
                        </div>
                        <div className="border border-primary rounded-lg p-4 bg-primary/10">
                          <div className="flex justify-between">
                            <div className="flex gap-4">
                              <h3 className="font-bold">Business Plan</h3>
                              <Chip color="primary" size="sm" className="mr-2">
                                Current
                              </Chip>
                            </div>
                            <span className="text-primary font-bold">
                              $99/mo
                            </span>
                          </div>
                          <div className="flex"></div>
                          <p className="text-gray-500 text-sm my-2">
                            For growing businesses
                          </p>
                          <ul className="text-sm space-y-1 mb-4">
                            <li>• 10 users</li>
                            <li>• 500 transcripts/month</li>
                            <li>• 200 reviews/month</li>
                            <li>• Priority support</li>
                            <li>• Advanced analytics</li>
                          </ul>
                          <Button
                            variant="solid"
                            color="default"
                            className="w-full"
                            isDisabled
                          >
                            Current Plan
                          </Button>
                        </div>
                        <div className="border border-gray-700 rounded-lg p-4 hover:border-primary transition-colors">
                          <div className="flex justify-between">
                            <h3 className="font-bold">Enterprise Plan</h3>
                            <span className="text-primary font-bold">
                              $199/mo
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm my-2">
                            For large organizations
                          </p>
                          <ul className="text-sm space-y-1 mb-4">
                            <li>• Unlimited users</li>
                            <li>• 2000 transcripts/month</li>
                            <li>• 500 reviews/month</li>
                            <li>• 24/7 premium support</li>
                            <li>• Custom integrations</li>
                          </ul>
                          <Button
                            variant="solid"
                            color="primary"
                            className="w-full"
                          >
                            Upgrade plan
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "team" && (
                    <div className="text-default-500 text-sm italic">
                      Team Members section is coming soon.
                    </div>
                  )}

                  {activeTab === "billing" && (
                    <div className="text-default-500 text-sm italic">
                      Billing information will appear here.
                    </div>
                  )}
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    if (activeTab === "profile") {
                      document
                        .querySelector<HTMLFormElement>("form")
                        ?.requestSubmit?.();
                    } else {
                      onClose();
                    }
                  }}
                >
                  Save changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CompanySettingsModal;
