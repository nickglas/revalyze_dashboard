import { useCompanyStore } from "@/store/companyStore";
import { Button, Card, CardBody } from "@heroui/react";
import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const SubscriptionDowngradeWarning = () => {
  const { companyDetails, getCompanyDetails, cancelScheduledDowngrade } =
    useCompanyStore();

  useEffect(() => {
    getCompanyDetails();
  }, [getCompanyDetails]);

  const subscription = companyDetails?.subscription;

  if (!subscription?.scheduledUpdate) {
    return null;
  }

  return (
    <Card className="bg-yellow-900/20 border-yellow-500/50">
      <CardBody className="flex items-center gap-4">
        <FaExclamationTriangle className="text-yellow-500 text-3xl flex-shrink-0" />
        <div className="flex flex-col items-center gap-4">
          <h3 className="font-medium text-xl">Scheduled Downgrade</h3>
          <p className="text-lg text-yellow-300 text-center">
            Your subscription will downgrade to{" "}
            <span className="font-semibold">
              {subscription.scheduledUpdate.productName}
            </span>{" "}
            at the end of your billing period on{" "}
            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
          </p>
          <Button
            variant="solid"
            color="danger"
            size="md"
            className="text-md font-semibold"
            onPress={cancelScheduledDowngrade}
          >
            Cancel Downgrade
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default SubscriptionDowngradeWarning;
