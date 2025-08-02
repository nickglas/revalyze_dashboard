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
  Badge,
  Divider,
  Card,
  CardBody,
  Avatar,
  Select,
  SelectItem,
} from "@heroui/react";
import React, { useState } from "react";
import { FaArrowDown, FaExclamationTriangle } from "react-icons/fa";
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
  // Mock company data
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

  // Mock subscription data
  const [subscription, setSubscription] = useState({
    status: "active",
    productName: "Business Plan",
    amount: 99,
    currency: "usd",
    interval: "month",
    currentPeriodStart: "2023-08-01",
    currentPeriodEnd: "2023-09-01",
    cancelAtPeriodEnd: true, // Set to true to show scheduled downgrade
    scheduledDowngrade: "Starter Plan", // Added scheduled downgrade info
    allowedUsers: 10,
    allowedTranscripts: 500,
    allowedReviews: 200,
    usedUsers: 8,
    usedTranscripts: 243,
    usedReviews: 178,
  });

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const handleRegenerateApiKey = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCompany((prev) => ({
        ...prev,
        hashedApiKey: `sk_${Math.random().toString(36).substring(2, 15)}`,
        apiKeyCreatedAt: new Date().toISOString(),
      }));
      setIsLoading(false);
    }, 1000);
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
        className="bg-[#1e1e1e]"
      >
        <ModalContent className="bg-[#1e1e1e] text-white">
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-gray-800">
                <h2 className="text-xl font-bold">Company Settings</h2>
              </ModalHeader>
              <ModalBody className="py-4">
                <Tabs
                  selectedKey={activeTab}
                  onSelectionChange={(key) => setActiveTab(String(key))}
                  aria-label="Manage company settings"
                  color="primary"
                  fullWidth
                  className="mb-6"
                >
                  <Tab key="profile" title="Company Profile" />
                  <Tab key="subscription" title="Subscription" />
                  <Tab key="team" title="Team Members" />
                  <Tab key="billing" title="Billing" />
                </Tabs>

                {activeTab === "profile" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Company Information */}
                    <Card className="bg-[#2a2a2a]">
                      <CardBody>
                        <h3 className="text-lg font-semibold mb-4">
                          Company Information
                        </h3>
                        <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Company Name"
                            name="name"
                            value={company.name}
                            onChange={handleInputChange}
                            className="bg-[#1e1e1e]"
                          />
                          <Input
                            label="Contact Email"
                            name="mainEmail"
                            type="email"
                            value={company.mainEmail}
                            onChange={handleInputChange}
                            className="bg-[#1e1e1e]"
                          />
                          <Input
                            label="Phone"
                            name="phone"
                            value={company.phone}
                            onChange={handleInputChange}
                            className="bg-[#1e1e1e]"
                          />
                        </Form>

                        <div className="mt-6">
                          <h3 className="text-md font-medium mb-3">Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Street"
                              name="street"
                              value={company.address.street}
                              onChange={handleAddressChange}
                              className="bg-[#1e1e1e]"
                            />
                            <Input
                              label="City"
                              name="city"
                              value={company.address.city}
                              onChange={handleAddressChange}
                              className="bg-[#1e1e1e]"
                            />
                            <Input
                              label="State/Province"
                              name="state"
                              value={company.address.state}
                              onChange={handleAddressChange}
                              className="bg-[#1e1e1e]"
                            />
                            <Input
                              label="Postal Code"
                              name="postalCode"
                              value={company.address.postalCode}
                              onChange={handleAddressChange}
                              className="bg-[#1e1e1e]"
                            />
                            <Input
                              label="Country"
                              name="country"
                              value={company.address.country}
                              onChange={handleAddressChange}
                              className="bg-[#1e1e1e]"
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* API Key Management */}
                    <Card className="bg-[#2a2a2a]">
                      <CardBody>
                        <h3 className="text-lg font-semibold mb-4">API Key</h3>
                        <div className="flex flex-col gap-4">
                          <Input
                            label="Your API Key"
                            value={company.hashedApiKey}
                            readOnly
                            className="bg-[#1e1e1e]"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="flat"
                              className="flex-1"
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  company.hashedApiKey
                                )
                              }
                            >
                              Copy Key
                            </Button>
                            <Button
                              variant="flat"
                              color="warning"
                              className="flex-1"
                              onClick={handleRegenerateApiKey}
                              isLoading={isLoading}
                            >
                              Regenerate
                            </Button>
                          </div>
                          <p className="text-sm text-gray-400 mt-2">
                            Created on{" "}
                            {new Date(
                              company.apiKeyCreatedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}

                {activeTab === "subscription" && (
                  <div className="flex flex-col gap-6">
                    {/* Scheduled Downgrade Notice */}
                    {subscription.cancelAtPeriodEnd && (
                      <Card className="bg-yellow-900/20 border-yellow-500/50">
                        <CardBody className="flex items-center gap-4">
                          <FaExclamationTriangle className="text-yellow-500 text-xl flex-shrink-0" />
                          <div>
                            <h3 className="font-medium">Scheduled Downgrade</h3>
                            <p className="text-sm text-yellow-300">
                              Your subscription will downgrade to{" "}
                              <span className="font-semibold">
                                {subscription.scheduledDowngrade}
                              </span>{" "}
                              at the end of your billing period on{" "}
                              {new Date(
                                subscription.currentPeriodEnd
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="flat"
                            color="success"
                            size="sm"
                            className="ml-auto"
                            onClick={() =>
                              setSubscription((prev) => ({
                                ...prev,
                                cancelAtPeriodEnd: false,
                              }))
                            }
                          >
                            Cancel Downgrade
                          </Button>
                        </CardBody>
                      </Card>
                    )}

                    {/* Current Subscription */}
                    <Card className="bg-[#2a2a2a]">
                      <CardBody className="space-y-6">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                          <div>
                            <h3 className="text-lg font-bold">
                              {subscription.productName}
                            </h3>
                            <p className="text-gray-400">
                              ${subscription.amount}/{subscription.interval}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Chip
                              color={
                                subscription.status === "active"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {subscription.status}
                            </Chip>
                            {subscription.cancelAtPeriodEnd && (
                              <Chip color="warning" variant="dot">
                                Ending Soon
                              </Chip>
                            )}
                          </div>
                        </div>

                        <Divider className="bg-gray-700" />

                        <div>
                          <h4 className="font-medium mb-4">Usage</h4>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1 text-sm">
                                <span>Active Users</span>
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
                                color="primary"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1 text-sm">
                                <span>Transcripts</span>
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
                                color="success"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1 text-sm">
                                <span>Reviews</span>
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
                                color="warning"
                              />
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Plan Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Plan 1 */}
                      <Card className="bg-[#2a2a2a] hover:border-primary transition-colors">
                        <CardBody className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold">Starter Plan</h3>
                            <div className="text-right">
                              <div className="text-primary font-bold">
                                $49/mo
                              </div>
                              <div className="text-xs text-gray-500">
                                billed monthly
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mb-4">
                            For small teams getting started
                          </p>
                          <ul className="text-sm space-y-2 mb-6 flex-1">
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>5 users</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>100 transcripts/month</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>50 reviews/month</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>Basic support</span>
                            </li>
                          </ul>
                          <Button
                            variant={
                              subscription.productName === "Starter Plan"
                                ? "solid"
                                : "flat"
                            }
                            color={
                              subscription.productName === "Starter Plan"
                                ? "default"
                                : "primary"
                            }
                            disabled={
                              subscription.productName === "Starter Plan"
                            }
                            fullWidth
                          >
                            {subscription.productName === "Starter Plan"
                              ? "Current Plan"
                              : "Select Plan"}
                          </Button>
                        </CardBody>
                      </Card>

                      {/* Current Plan */}
                      <Card className="bg-[#2a2a2a] border-primary/50">
                        <div className="absolute top-4 right-4">
                          <Chip color="primary">Current</Chip>
                        </div>
                        <CardBody className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold">Business Plan</h3>
                            <div className="text-right">
                              <div className="text-primary font-bold">
                                $99/mo
                              </div>
                              <div className="text-xs text-gray-500">
                                billed monthly
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mb-4">
                            For growing businesses
                          </p>
                          <ul className="text-sm space-y-2 mb-6 flex-1">
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>10 users</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>500 transcripts/month</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>200 reviews/month</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>Priority support</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>Advanced analytics</span>
                            </li>
                          </ul>
                          <Button
                            variant="solid"
                            color="default"
                            fullWidth
                            disabled
                          >
                            Current Plan
                          </Button>
                        </CardBody>
                      </Card>

                      {/* Plan 3 */}
                      <Card className="bg-[#2a2a2a] hover:border-primary transition-colors">
                        <CardBody className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold">Enterprise Plan</h3>
                            <div className="text-right">
                              <div className="text-primary font-bold">
                                $199/mo
                              </div>
                              <div className="text-xs text-gray-500">
                                billed monthly
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mb-4">
                            For large organizations
                          </p>
                          <ul className="text-sm space-y-2 mb-6 flex-1">
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>Unlimited users</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>2000 transcripts/month</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>500 reviews/month</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>24/7 premium support</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>Custom integrations</span>
                            </li>
                          </ul>
                          <Button variant="solid" color="primary" fullWidth>
                            Upgrade Plan
                          </Button>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === "team" && (
                  <div className="bg-[#2a2a2a] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Team Members</h3>
                      <Button variant="solid" color="primary">
                        Invite Team Member
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          id: "1",
                          name: "Sarah Johnson",
                          role: "admin",
                          email: "sarah@acme.com",
                        },
                        {
                          id: "2",
                          name: "Michael Chen",
                          role: "manager",
                          email: "michael@acme.com",
                        },
                        {
                          id: "3",
                          name: "Emma Rodriguez",
                          role: "employee",
                          email: "emma@acme.com",
                        },
                        {
                          id: "4",
                          name: "David Wilson",
                          role: "employee",
                          email: "david@acme.com",
                        },
                      ].map((user) => (
                        <Card key={user.id} className="bg-[#1e1e1e]">
                          <CardBody className="flex items-center gap-4">
                            <Avatar
                              src={`https://i.pravatar.cc/150?u=${user.id}`}
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{user.name}</h4>
                              <p className="text-sm text-gray-400">
                                {user.email}
                              </p>
                            </div>
                            <Chip
                              color={
                                user.role === "admin"
                                  ? "primary"
                                  : user.role === "manager"
                                    ? "warning"
                                    : "default"
                              }
                              size="sm"
                            >
                              {user.role}
                            </Chip>
                          </CardBody>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-6 text-center text-gray-500 text-sm">
                      {subscription.usedUsers} of {subscription.allowedUsers}{" "}
                      user slots used
                    </div>
                  </div>
                )}

                {activeTab === "billing" && (
                  <div className="bg-[#2a2a2a] rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-6">
                      Billing Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-[#1e1e1e]">
                        <CardBody>
                          <h4 className="font-medium mb-4">Payment Method</h4>
                          <div className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-200 border rounded-md w-10 h-6" />
                              <div>
                                <p className="font-medium">
                                  Visa ending in 4242
                                </p>
                                <p className="text-sm text-gray-500">
                                  Expires 12/2025
                                </p>
                              </div>
                            </div>
                            <Button variant="flat">Change</Button>
                          </div>
                        </CardBody>
                      </Card>

                      <Card className="bg-[#1e1e1e]">
                        <CardBody>
                          <h4 className="font-medium mb-4">Billing History</h4>
                          <div className="space-y-3">
                            {[
                              {
                                date: "Aug 1, 2023",
                                plan: "Business Plan",
                                amount: "$99.00",
                                status: "Paid",
                              },
                              {
                                date: "Jul 1, 2023",
                                plan: "Business Plan",
                                amount: "$99.00",
                                status: "Paid",
                              },
                              {
                                date: "Jun 1, 2023",
                                plan: "Business Plan",
                                amount: "$99.00",
                                status: "Paid",
                              },
                            ].map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center py-2 border-b border-gray-700"
                              >
                                <div>
                                  <p className="font-medium">{item.date}</p>
                                  <p className="text-sm text-gray-500">
                                    {item.plan}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{item.amount}</p>
                                  <Badge color="success" size="sm">
                                    {item.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardBody>
                      </Card>
                    </div>

                    <div className="mt-6">
                      <Button variant="flat" fullWidth>
                        View All Invoices
                      </Button>
                    </div>
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="border-t border-gray-800">
                <Button
                  color="default"
                  variant="flat"
                  onPress={onClose}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button color="primary" isLoading={isLoading}>
                  Save Changes
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
