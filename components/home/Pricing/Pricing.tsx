"use client";

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tables } from "@/database.types";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Check } from "lucide-react"; // ✅ import this

type Product = Tables<"products">;
type Price = Tables<"prices">;

export interface ProductWithPrices extends Product {
  prices: Price[];
}

interface PricingProps {
  products: ProductWithPrices[];
  MostPopular?: string;
}

const Pricing = ({ products, MostPopular = "pro" }: PricingProps) => {
  const [billingInterval, setBillingInterval] = React.useState<"year" | "month">(
    "month"
  );

  return (
    <section className="w-full bg-muted flex flex-col justify-center items-center">
      <div className="w-full container mx-auto py-32 flex flex-col items-center justify-center space-y-8">
        {/* Header */}
        <div className="text-center flex flex-col items-center justify-center">
          <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
            <span
              className={cn(
                "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
              )}
              style={{
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "subtract",
                WebkitClipPath: "padding-box",
              }}
            />
            <AnimatedGradientText className="text-sm font-medium">
              Price
            </AnimatedGradientText>
          </div>

          <h1 className="mt-4 capitalize text-4xl font-bold">
            Choose the Plan that fits your needs
          </h1>
          <p className="text-base text-muted-foreground max-w-3xl">
            Choose an affordable plan that is packed with the best features for
            engaging your audience, creating customer loyalty, and growing your
            business.
          </p>
        </div>

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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 place-items-center mx-auto gap-8">
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
                  product.name?.toLowerCase() === MostPopular.toLowerCase()
                    ? "border-primary drop-shadow-md scale-105"
                    : "border-border"
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl leading-6 font-semibold text-foreground flex items-center justify-between">
                    {product.name}
                    {product.name?.toLowerCase() ===
                    MostPopular.toLowerCase() ? (
                      <Badge className="border-border font-semibold">
                        Most Popular
                      </Badge>
                    ) : null}
                  </h2>

                  <p className="mt-4 text-muted-foreground text-sm">
                    {product.description}
                  </p>

                  <p className="mt-8">
                    <span className="text-4xl font-extrabold">
                      {priceString}
                    </span>
                    <span>
                      {billingInterval === "year" ? "/year" : "/month"}
                    </span>
                  </p>

                  <Link href={`${ROUTES.LOGIN}?state=signup`}>
                    <Button
                      variant={
                        product.name?.toLowerCase() ===
                        MostPopular.toLowerCase()
                          ? "default"
                          : "outline"
                      }
                      className="mt-8 w-full font-semibold"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>

                {/* Features */}
                <div className="pt-6 pb-8 px-6">
                  <h3 className="font-semibold mb-3">What&apos;s included</h3>
                  <ul className="space-y-2">
                    {Object.entries(product.metadata || {})
                      .filter(([key]) => !isNaN(Number(key))) // ✅ only use numbered keys
                      .map(([key, feature]) => (
                        <li key={key} className="flex space-x-3 items-start">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span className="text-sm text-muted-foreground">{String(feature)}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
