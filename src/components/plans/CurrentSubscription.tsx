import { useCompanyStore } from "@/store/companyStore";
import { Button, Card, CardBody, Chip, Divider, Progress } from "@heroui/react";
import React, { useEffect } from "react";
import { FaChartLine } from "react-icons/fa6";

const CurrentSubscription = () => {
  const { companyDetails, getCompanyDetails, cancelScheduledDowngrade } =
    useCompanyStore();

  useEffect(() => {
    getCompanyDetails();
  }, []);

  if (!companyDetails) {
    return;
  }

  return (
    <Card className="bg-[#1e1e1e]">
      <CardBody className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold">
              {companyDetails?.subscription.productName}
            </h3>
            <p className="text-gray-400">
              ${companyDetails?.subscription.amount}/
              {companyDetails?.subscription.interval}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Chip
              color={
                companyDetails?.subscription.status === "active"
                  ? "success"
                  : "warning"
              }
            >
              {companyDetails?.subscription.status}
            </Chip>
            {companyDetails?.subscription.cancelAtPeriodEnd && (
              <Chip color="warning" variant="dot">
                Ending Soon
              </Chip>
            )}
          </div>
        </div>

        <Divider className="bg-gray-700" />

        {companyDetails?.subscription.scheduledUpdate && (
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
                  {companyDetails?.subscription.scheduledUpdate?.productName}{" "}
                  plan on{" "}
                  {new Date(
                    companyDetails?.subscription.currentPeriodEnd
                  ).toLocaleDateString()}
                </p>
              </div>
              <Button
                size="md"
                variant="solid"
                color="danger"
                className="ml-auto"
                onPress={cancelScheduledDowngrade}
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
                  {4} / {companyDetails?.subscription.allowedUsers}
                </span>
              </div>
              <Progress
                value={(4 / companyDetails?.subscription.allowedUsers) * 100}
                className="h-2"
                color="primary"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Transcripts</span>
                <span>
                  {55} / {companyDetails?.subscription.allowedTranscripts}
                </span>
              </div>
              <Progress
                value={
                  (55 / companyDetails?.subscription.allowedTranscripts) * 100
                }
                className="h-2"
                color="primary"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Reviews</span>
                <span>
                  {5} / {companyDetails?.subscription.allowedReviews}
                </span>
              </div>
              <Progress
                value={(5 / companyDetails?.subscription.allowedReviews) * 100}
                className="h-2"
                color="primary"
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CurrentSubscription;
