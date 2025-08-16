import { PlanDetailsDTO } from "@/models/dto/plan/detail.plan.dto";
import { useCompanyStore } from "@/store/companyStore";
import { usePlanStore } from "@/store/planStore";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Switch,
  Badge,
} from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";

const AvailablePlansCard = () => {
  const { plans, getPlans, isLoading } = usePlanStore();
  const { companyDetails, getCompanyDetails } = useCompanyStore();
  const [isYearly, setIsYearly] = useState(false);

  const maxSavings = useMemo(() => {
    if (!plans || plans.length === 0) return 0;

    let maxPercentage = 0;

    plans.forEach((plan) => {
      const monthlyOption = plan.billingOptions.find(
        (opt) => opt.interval === "month"
      );
      const yearlyOption = plan.billingOptions.find(
        (opt) => opt.interval === "year"
      );

      if (monthlyOption && yearlyOption) {
        const monthlyPrice = monthlyOption.amount;
        const yearlyPrice = yearlyOption.amount;
        const monthlyEquivalent = monthlyPrice * 12;

        if (monthlyEquivalent > yearlyPrice) {
          const savings = monthlyEquivalent - yearlyPrice;
          const percentage = (savings / monthlyEquivalent) * 100;

          if (percentage > maxPercentage) {
            maxPercentage = Math.round(percentage);
          }
        }
      }
    });

    return maxPercentage;
  }, [plans]);

  const getCurrencySymbol = (currency: string) => {
    switch (currency.toLowerCase()) {
      case "usd":
        return "$";
      case "eur":
        return "€";
      case "gbp":
        return "£";
      default:
        return "$";
    }
  };

  const getBillingOption = (plan: any) => {
    const interval = isYearly ? "year" : "month";
    return (
      plan.billingOptions.find((option: any) => option.interval === interval) ||
      plan.billingOptions[0]
    );
  };

  const hasYearlyOption = (plan: any) => {
    return plan.billingOptions.some(
      (option: any) => option.interval === "year"
    );
  };

  const formatPrice = (amount: number, currency: string) => {
    const symbol = getCurrencySymbol(currency);
    const amountInDollars = amount / 100;

    return amountInDollars % 1 === 0
      ? `${symbol}${amountInDollars.toFixed(0)}`
      : `${symbol}${amountInDollars.toFixed(2)}`;
  };

  const getIntervalSuffix = (interval: string) => {
    switch (interval) {
      case "year":
        return "/yr";
      case "month":
        return "/mo";
      default:
        return "";
    }
  };

  function calculatePlanSavings(plan: any): number {
    const monthlyOption = plan.billingOptions.find(
      (opt: any) => opt.interval === "month"
    );
    const yearlyOption = plan.billingOptions.find(
      (opt: any) => opt.interval === "year"
    );

    if (!monthlyOption || !yearlyOption) return 0;

    const monthlyPrice = monthlyOption.amount;
    const yearlyPrice = yearlyOption.amount;
    const monthlyEquivalent = monthlyPrice * 12;

    if (monthlyEquivalent <= yearlyPrice) return 0;

    const savings = monthlyEquivalent - yearlyPrice;
    const percentage = (savings / monthlyEquivalent) * 100;

    return Math.round(percentage);
  }

  useEffect(() => {
    getPlans();
    getCompanyDetails();

    console.warn(plans);
    console.warn(companyDetails);
  }, []);

  const getPriceId = (plan: PlanDetailsDTO) => {
    return plan.billingOptions.find(
      (x) => x.interval === (isYearly ? "year" : "month")
    )?.stripePriceId;
  };

  return (
    <Card className="bg-[#1e1e1e]">
      <CardHeader>
        <div className="flex justify-between w-full gap-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">Available Plans</h2>
            <p className="text-xs">
              Changing your subscription plan will be applied immediately.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">Monthly</span>
              <Switch
                size="sm"
                isSelected={isYearly}
                onValueChange={() => setIsYearly(!isYearly)}
                isDisabled={maxSavings === 0}
              />
              <span className="text-sm">Yearly</span>
            </div>
            {/* <span className="text-xs">
              Save up to {maxSavings}% on yearly subscriptions
            </span> */}
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {isLoading ? (
          <div>Loading plans...</div>
        ) : (
          plans?.map((plan) => {
            const billingOption = getBillingOption(plan);
            const priceDisplay = formatPrice(
              billingOption.amount,
              plan.currency
            );
            const intervalSuffix = getIntervalSuffix(billingOption.interval);
            const isYearlyUnavailable = isYearly && !hasYearlyOption(plan);

            return (
              <div
                key={plan._id}
                className={`border rounded-lg p-4 transition-colors ${
                  getPriceId(plan) === companyDetails?.subscription.priceId
                    ? "border-primary bg-primary/10"
                    : "border-gray-700 hover:border-primary"
                } ${
                  isYearlyUnavailable ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{plan.name}</h3>
                    {getPriceId(plan) ===
                      companyDetails?.subscription.priceId && (
                      <Chip color="primary" size="sm">
                        Current
                      </Chip>
                    )}

                    {!hasYearlyOption(plan) && isYearly && (
                      <Chip color="warning" size="sm">
                        Yearly not available
                      </Chip>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {isYearly && hasYearlyOption(plan) && (
                      <div className="text-right">
                        <Chip color="primary">
                          Save {calculatePlanSavings(plan)}%
                        </Chip>
                      </div>
                    )}
                    <span className="text-primary font-bold">
                      {priceDisplay}
                      {intervalSuffix}
                    </span>
                  </div>
                </div>

                <p className="text-gray-500 text-sm my-2">{plan.description}</p>

                <ul className="text-sm space-y-1 mb-4">
                  <li>• up to {plan.allowedUsers} users</li>
                  <li>
                    • up to {plan.allowedTranscripts} transcripts per month
                  </li>
                  <li>• up to {plan.allowedReviews} reviews per month</li>
                </ul>

                <Button
                  className="w-full"
                  variant={
                    getPriceId(plan) === companyDetails?.subscription.priceId
                      ? "solid"
                      : "flat"
                  }
                  color={
                    getPriceId(plan) === companyDetails?.subscription.priceId
                      ? "primary"
                      : "default"
                  }
                  disabled={
                    getPriceId(plan) === companyDetails?.subscription.priceId ||
                    isYearlyUnavailable
                  }
                >
                  {getPriceId(plan) === companyDetails?.subscription.priceId
                    ? "Current Plan"
                    : isYearlyUnavailable
                      ? "Yearly Not Available"
                      : "Select Plan"}
                </Button>
              </div>
            );
          })
        )}
      </CardBody>
    </Card>
  );
};

export default AvailablePlansCard;
