"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tables } from "@/database.types";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import React from "react";
import { SubscriptionWithProduct } from "./PlanSummary";
import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { checkoutWithStripe } from "@/lib/stripe/server";
import { getErrorRedirect } from "@/lib/helpers";
import { getStripe } from "@/lib/stripe/client";

type Product = Tables<"products">;
type Price = Tables<"prices">;

export interface ProductWithPrices extends Product {
  prices: Price[];
}

interface PricingProps {
  products: ProductWithPrices[];
  MostPopular?: string;
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  showInterval?: boolean;
  className?: string;
  activeProduct?: string
}

const renderPricingBtn = ({
  subscription,
  user,
  product,
  price,
  MostPopular,
  handleStripePortalRequest,
  handleStripeCheckout,
}: {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  product: ProductWithPrices;
  price: Price;
  MostPopular: string;
  handleStripePortalRequest: (price: Price) => Promise<void>;
  handleStripeCheckout: (price: Price) => Promise<void>;
}) => {
  if (user && subscription &&  subscription.prices?.products?.name?.toLowerCase() === product.name?.toLowerCase()) {
     return(
      <Button
        variant={
          product.name?.toLowerCase() === MostPopular.toLowerCase()
            ? "default"
            : "outline"
        }
        className="mt-8 w-full font-semibold"
        onClick={() => handleStripePortalRequest(price)}
      >
        Manage Subscription
      </Button>
     )
  }
  if (user && !subscription) {
    return (
      <Button
        variant={
          product.name?.toLowerCase() === MostPopular.toLowerCase()
            ? "default"
            : "outline"
        }
        className="mt-8 w-full font-semibold"
        onClick={() => handleStripeCheckout(price)}
      >
        Subscribe
      </Button>
    );
  }
};

const Pricing = ({
  products,
  MostPopular = "pro",
  subscription,
  user,
  showInterval = true,
  className,
  activeProduct = "pro"
}: PricingProps) => {
  const router = useRouter();
  const currentPath = usePathname();
  const [billingInterval, setBillingInterval] = React.useState<
    "year" | "month"
  >("month");

  const handleStripeCheckout = async (price: Price) => {
    if (!user) {
      router.push(`${ROUTES.SIGNUP}?state=login`);
      return;
    }

    if (process.env.NEXT_PUBLIC_ENABLE_STRIPE === "false") {
      console.warn("⚠️ Stripe disabled - redirecting to dashboard");
      return router.push("/dashboard");
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );
    if (errorRedirect) return router.push(errorRedirect);

    if (!sessionId) {
      return router.push(
        getErrorRedirect(
          currentPath,
          "Unexpected error",
          "Please try again later."
        )
      );
    }

    const stripe = await getStripe();
    if (!stripe) return router.push("/dashboard");
    await stripe.redirectToCheckout({ sessionId });
  };

  const handleStripePortalRequest = async () => {
    if (process.env.NEXT_PUBLIC_ENABLE_STRIPE === "false") {
      console.warn("⚠️ Stripe disabled - redirecting to dashboard");
      return router.push("/dashboard");
    }
    const url = await createStripePortal(currentPath);
    if (url) return window.location.assign(url);
  };

  return (
    <section className={cn("max-w-7xl mx-auto px-8 py-16 w-full flex flex-col", className)}>
      {showInterval && (
        <>
          {/* Switch */}
          <div className="flex justify-center items-center space-x-4 py-8">
            <Label htmlFor="pricing-switch" className="font-semibold text-base">
              Monthly
            </Label>
            <Switch
              id="pricing-switch"
              checked={billingInterval === "year"}
              onCheckedChange={(checked) =>
                setBillingInterval(checked ? "year" : "month")
              }
            />
            <Label htmlFor="pricing-switch" className="font-semibold text-base">
              Yearly
            </Label>
          </div>
        </>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 place-items-center mx-auto gap-8 space-y-4">
        {products.map((product) => {
          const price = product.prices.find(
            (p) => p.interval === billingInterval
          );
          if (!price) return null;

          const priceString = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: price.currency ?? "USD",
            minimumFractionDigits: 0,
          }).format((price.unit_amount || 0) / 100);

          return (
            <div
              key={product.id}
              className={cn(
                "border bg-background rounded-xl shadow-sm h-fit divide-border divide-y transition-transform duration-300 hover:scale-105",
                product.name?.toLowerCase() === activeProduct!.toLowerCase()
                  ? "border-primary drop-shadow-md scale-105"
                  : "border-border"
              )}
            >
              <div className="p-6">
                <h2 className="text-2xl leading-6 font-semibold text-foreground flex items-center justify-between">
                  {product.name}
                  {product.name?.toLowerCase() === activeProduct.toLowerCase() ? (
                    <Badge className="border-border font-semibold">
                      Selected
                    </Badge>
                  ) : null}
                  {product.name?.toLowerCase() === MostPopular.toLowerCase() ? (
                    <Badge className="border-border font-semibold">
                      Most Popular
                    </Badge>
                  ) : null}
                </h2>

                <p className="mt-4 text-muted-foreground text-sm">
                  {product.description}
                </p>

                <p className="mt-8">
                  <span className="text-4xl font-extrabold">{priceString}</span>
                  <span>{billingInterval === "year" ? "/year" : "/month"}</span>
                </p>
                {renderPricingBtn({
                  subscription,
                  user,
                  product,
                  price,
                  MostPopular,
                  handleStripeCheckout,
                  handleStripePortalRequest,
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Pricing;
