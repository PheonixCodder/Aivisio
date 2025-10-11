import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tables } from "@/database.types";
import { User } from "@supabase/supabase-js";
import React from "react";
import PricingSheet from "./PricingSheet";
import { format } from "date-fns";

type Product = Tables<"products">;
type Price = Tables<"prices">;
type Subscription = Tables<"subscriptions">;
type Credits = Tables<"credits">;

export interface ProductWithPrices extends Product {
  prices: Price[];
}

export interface PriceWithProduct extends Price {
  products: Product | null;
}

export interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

export interface PlanSummaryProps {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  products: ProductWithPrices[];
  credits: Partial<Credits>;
}

const PlanSummary = ({
  subscription,
  user,
  products,
  credits,
}: PlanSummaryProps) => {
  const imageGenCount = credits?.image_generation_count ?? 0;
  const modelTrainCount = credits?.model_training_count ?? 0;
  const maxImageGenCount = credits?.max_image_generation_count ?? 1; // prevent divide by zero
  const maxModelTrainCount = credits?.max_model_training_count ?? 1;

  const noActivePlan =
    !subscription || !subscription.status || subscription.status !== "active";

  // If no active plan
  if (noActivePlan) {
    return (
      <Card className="max-w-5xl">
        <CardContent className="px-5 py-4">
          <h3 className="pb-4 text-base font-semibold flex flex-wrap items-center gap-x-2">
            <span>Plan Summary</span>
            <Badge variant="secondary" className="bg-primary/10">
              No Plan
            </Badge>
          </h3>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>
                  {imageGenCount}/{maxImageGenCount}
                </span>
                <span className="text-muted-foreground">
                  Image Generation Credits left
                </span>
              </div>
              <Progress
                value={(imageGenCount / maxImageGenCount) * 100}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>
                  {modelTrainCount}/{maxModelTrainCount}
                </span>
                <span className="text-muted-foreground">
                  Model Training Credits left
                </span>
              </div>
              <Progress
                value={(modelTrainCount / maxModelTrainCount) * 100}
                className="h-2"
              />
            </div>

            <div className="col-span-full text-sm text-muted-foreground mt-3">
              Please upgrade your plan to continue using our services.
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border px-4 py-3">
          <span className="ml-auto">
            <PricingSheet user={user} products={products} subscription={subscription} />
          </span>
        </CardFooter>
      </Card>
    );
  }

  // Active Plan
  const { products: subscriptionProduct, unit_amount, currency } =
    subscription.prices || {};

  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
    minimumFractionDigits: 0,
  }).format((unit_amount || 0) / 100);

  return (
    <Card className="max-w-5xl">
      <CardContent className="px-5 py-4">
        <h3 className="pb-4 text-base font-semibold flex flex-wrap items-center gap-x-2">
          <span>Plan Summary</span>
          <Badge variant="secondary" className="bg-primary/10">
            {subscriptionProduct?.name ?? "Active Plan"}
          </Badge>
        </h3>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>Image Generation Credits</span>
              <span>
                {imageGenCount}/{maxImageGenCount}
              </span>
            </div>
            <Progress
              value={(imageGenCount / maxImageGenCount) * 100}
              className="h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>Model Training Credits</span>
              <span>
                {modelTrainCount}/{maxModelTrainCount}
              </span>
            </div>
            <Progress
              value={(modelTrainCount / maxModelTrainCount) * 100}
              className="h-2"
            />
          </div>

          <div className="flex flex-col space-y-2 text-sm font-medium">
            <div>
              <span className="text-muted-foreground">Price/Month:</span>{" "}
              {priceString}
            </div>
            <div>
              <span className="text-muted-foreground">Included Credits:</span>{" "}
              {maxImageGenCount}
            </div>
            <div>
              <span className="text-muted-foreground">Renewal Date:</span>{" "}
              {format(
                new Date(subscription.current_period_end),
                "MMM d, yyyy"
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanSummary;
