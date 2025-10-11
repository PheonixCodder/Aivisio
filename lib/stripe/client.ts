import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = async () => {
  if (process.env.NEXT_PUBLIC_ENABLE_STRIPE === "false") {
    console.warn("⚠️ Stripe disabled in this environment");
    return null;
  }

  if (!stripePromise) {
    const key =
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
      "";

    stripePromise = loadStripe(key);
  }

  return stripePromise;
};
