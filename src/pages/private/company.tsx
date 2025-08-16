// src/pages/CompanyPage.tsx
import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Chip,
  Progress,
  Badge,
  Avatar,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@heroui/react";
import {
  FaRegBuilding,
  FaRegCreditCard,
  FaChartLine,
  FaCopy,
  FaSync,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useCompanyStore } from "@/store/companyStore";
import { CompanyDetails } from "@/models/dto/company/company.detailed.dto";
import UpdateCompanyCard from "@/components/company/UpdateCompanyCard";
import AvailablePlansCard from "@/components/plans/AvailablePlansCard";
import SubscriptionDowngradeWarning from "@/components/plans/SubscriptionDowngradeWarning";

const renewalHistory = [
  {
    date: new Date("2024-01-15T14:30:00"),
    reason: "Security audit",
  },
  {
    date: new Date("2023-12-01T09:15:00"),
    reason: "Manual regeneration",
  },
  {
    date: new Date("2023-10-20T16:45:00"),
    reason: "Scheduled rotation",
  },
  {
    date: new Date("2023-09-05T11:20:00"),
    reason: "Compromised key",
  },
];

const CompanyPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyDetails>>({});

  const {
    companyDetails,
    getCompanyDetails,
    updateCompanyDetails,
    isUpdating,
  } = useCompanyStore();

  useEffect(() => {
    getCompanyDetails();
  }, []);

  useEffect(() => {
    if (companyDetails) {
      setFormData({
        name: companyDetails.name,
        email: companyDetails.email,
        phone: companyDetails.phone,
        address: companyDetails.address,
      });
    }
  }, [companyDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      await updateCompanyDetails(formData);
    } catch (error) {
      // Error handled in store
    }
  };

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
    cancelAtPeriodEnd: true,
    scheduledDowngrade: "Starter Plan",
    allowedUsers: 10,
    allowedTranscripts: 500,
    allowedReviews: 200,
    usedUsers: 8,
    usedTranscripts: 243,
    usedReviews: 178,
  });

  // Mock users
  const users = [
    {
      id: "user_1",
      name: "Sarah Johnson",
      email: "sarah@acme.com",
      role: "admin",
      status: "active",
    },
    {
      id: "user_2",
      name: "Michael Chen",
      email: "michael@acme.com",
      role: "manager",
      status: "active",
    },
    {
      id: "user_3",
      name: "Emma Rodriguez",
      email: "emma@acme.com",
      role: "employee",
      status: "active",
    },
    {
      id: "user_4",
      name: "David Wilson",
      email: "david@acme.com",
      role: "employee",
      status: "pending",
    },
  ];

  // Mock invoices
  const invoices = [
    {
      id: "inv_001",
      date: "2023-08-01",
      amount: "$99.00",
      status: "paid",
      plan: "Business Plan",
    },
    {
      id: "inv_002",
      date: "2023-07-01",
      amount: "$99.00",
      status: "paid",
      plan: "Business Plan",
    },
    {
      id: "inv_003",
      date: "2023-06-01",
      amount: "$99.00",
      status: "paid",
      plan: "Business Plan",
    },
  ];

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

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(company.hashedApiKey);
  };

  const handleCancelDowngrade = () => {
    setSubscription((prev) => ({
      ...prev,
      cancelAtPeriodEnd: false,
    }));
  };

  const renderProfileTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Company Information */}
      <UpdateCompanyCard />

      {/* API Key Management */}
      <Card className="bg-[#1e1e1e]">
        <CardHeader>
          <h2 className="text-lg font-semibold">API Key</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center gap-3">
            <Input label="Your API Key" value={company.hashedApiKey} readOnly />
            <Tooltip content="Copy to clipboard">
              <Button
                variant="flat"
                className="h-full"
                onClick={handleCopyApiKey}
              >
                <FaCopy className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Regenerate key">
              <Button
                variant="flat"
                className="h-full"
                color="warning"
                onClick={handleRegenerateApiKey}
                isLoading={isLoading}
              >
                <FaSync className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Created on {new Date(company.apiKeyCreatedAt).toLocaleDateString()}
          </p>
          <div className="space-y-3 mt-4">
            {renewalHistory.map((renewal, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Key Regenerated</p>
                    <p className="text-xs text-gray-500">
                      {new Date(renewal.date).toLocaleDateString()} at{" "}
                      {new Date(renewal.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{renewal.reason}</div>
              </div>
            ))}
          </div>
        </CardBody>
        <CardFooter className="text-xs text-gray-500">
          Use this key to authenticate API requests. Keep it secure.
        </CardFooter>
      </Card>
    </div>
  );

  const renderSubscriptionTab = () => (
    <>
      <SubscriptionDowngradeWarning />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Subscription */}
        <Card className="bg-[#1e1e1e]">
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
                    subscription.status === "active" ? "success" : "warning"
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

            {subscription.cancelAtPeriodEnd && (
              <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                <div className="flex items-center gap-4">
                  <div className="text-yellow-500">
                    <FaChartLine className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-yellow-300">
                      Scheduled Downgrade
                    </h1>
                    <p className="text-sm text-yellow-500">
                      Your subscription will be downgraded to the{" "}
                      {subscription.scheduledDowngrade} plan on{" "}
                      {new Date(
                        subscription.currentPeriodEnd
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="md"
                    variant="solid"
                    color="danger"
                    className="ml-auto"
                    onClick={handleCancelDowngrade}
                  >
                    {}
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-4">Usage</h4>
              <div className="space-y-6 mb-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Active Users</span>
                    <span>
                      {subscription.usedUsers} / {subscription.allowedUsers}
                    </span>
                  </div>
                  <Progress
                    value={
                      (subscription.usedUsers / subscription.allowedUsers) * 100
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
                    color="primary"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Reviews</span>
                    <span>
                      {subscription.usedReviews} / {subscription.allowedReviews}
                    </span>
                  </div>
                  <Progress
                    value={
                      (subscription.usedReviews / subscription.allowedReviews) *
                      100
                    }
                    className="h-2"
                    color="primary"
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Available Plans */}
        <AvailablePlansCard />
      </div>
    </>
  );

  const renderTeamTab = () => (
    <Card className="bg-[#1e1e1e]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Team Members</h2>
          <Button color="primary" variant="solid">
            Invite Member
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <Table aria-label="Team members table">
          <TableHeader>
            <TableColumn>MEMBER</TableColumn>
            <TableColumn>ROLE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={`https://i.pravatar.cc/150?u=${user.id}`}
                      className="w-8 h-8"
                    />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Badge
                    color={user.status === "active" ? "success" : "warning"}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="flat" size="sm" className="mr-2">
                    Edit
                  </Button>
                  <Button variant="flat" size="sm" color="danger">
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
      <CardFooter className="text-xs text-gray-500">
        {subscription.usedUsers} of {subscription.allowedUsers} user slots used
      </CardFooter>
    </Card>
  );

  const renderBillingTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Billing History */}
      <Card className="bg-[#1e1e1e]">
        <CardHeader>
          <h2 className="text-lg font-semibold">Billing History</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Billing history table">
            <TableHeader>
              <TableColumn>DATE</TableColumn>
              <TableColumn>PLAN</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.plan}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge color="success">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="flat" size="sm">
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500">Showing 3 of 12 invoices</p>
          <Button variant="flat">View All</Button>
        </CardFooter>
      </Card>

      {/* Payment Method */}
      <Card className="bg-[#1e1e1e]">
        <CardHeader>
          <h2 className="text-lg font-semibold">Payment Method</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg">
            <div className="flex items-center">
              <div className="bg-gray-200 border rounded-md w-12 h-8 mr-4" />
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-gray-500">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="flat">Change</Button>
          </div>
        </CardBody>
        <CardFooter className="text-xs text-gray-500">
          Update your payment method for subscription renewals
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Company Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your company information and subscription
          </p>
        </div>
      </div>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="bg-[
#1e1e1e]"
        color="primary"
        fullWidth
      >
        <Tab
          key="profile"
          title={
            <div className="flex items-center gap-2">
              <FaRegBuilding className="w-4 h-4" />
              <span>Company Profile</span>
            </div>
          }
        />
        <Tab
          key="subscription"
          title={
            <div className="flex items-center gap-2">
              <FaChartLine className="w-4 h-4" />
              <span>Subscription</span>
            </div>
          }
        />
        <Tab
          key="billing"
          title={
            <div className="flex items-center gap-2">
              <FaRegCreditCard className="w-4 h-4" />
              <span>Billing</span>
            </div>
          }
        />
      </Tabs>

      {activeTab === "profile" && renderProfileTab()}
      {activeTab === "subscription" && renderSubscriptionTab()}
      {activeTab === "team" && renderTeamTab()}
      {activeTab === "billing" && renderBillingTab()}
    </div>
  );
};

export default CompanyPage;
