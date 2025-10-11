import Stripe from "stripe";

export const stripe =
  process.env.NEXT_PUBLIC_ENABLE_STRIPE === "false"
    ? ({} as Stripe)
    : new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
        apiVersion: "2025-09-30.clover",
      });
