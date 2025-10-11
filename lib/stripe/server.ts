"use server";

import { stripe } from "@/lib/stripe/config";
import { createClient } from "@/lib/supabase/server";
import { createOrRetrieveCustomer } from "@/lib/supabase/admin";
import { getURL, getErrorRedirect, calculateTrialEndUnixTimestamp } from "@/lib/helpers";
import { Tables } from "@/database.types";

type Price = Tables<"prices">;

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

export async function checkoutWithStripe(price: Price, redirectPath = "/dashboard"): Promise<CheckoutResponse> {
  if (process.env.NEXT_PUBLIC_ENABLE_STRIPE === "false") {
    console.warn("⚠️ Stripe checkout disabled");
    return { errorRedirect: getErrorRedirect(redirectPath, "Stripe disabled in this environment.", "Please enable Stripe to process payments.") };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("No user session found.");

    const customer = await createOrRetrieveCustomer({ uuid: user.id, email: user.email ?? "" });

    const params: any = {
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer,
      client_reference_id: user.id,
      metadata: price.metadata ?? {},
      customer_update: { address: "auto" },
      line_items: [{ price: price.id, quantity: 1 }],
      cancel_url: getURL(),
      success_url: getURL(redirectPath),
      mode: price.type === "recurring" ? "subscription" : "payment",
    };

    if (price.trial_period_days)
      params.subscription_data = { trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days) };

    const session = await stripe.checkout.sessions.create(params);
    return { sessionId: session.id };
  } catch (error) {
    console.error(error);
    return { errorRedirect: getErrorRedirect(redirectPath, "Checkout failed", "Please try again later.") };
  }
}

export async function createStripePortal(currentPath: string) {
  if (process.env.NEXT_PUBLIC_ENABLE_STRIPE === "false") {
    console.warn("⚠️ Stripe portal disabled");
    return getErrorRedirect(currentPath, "Stripe disabled in this environment.", "Enable Stripe in production.");
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("No user session found.");

    const customer = await createOrRetrieveCustomer({ uuid: user.id, email: user.email ?? "" });
    const { url } = await stripe.billingPortal.sessions.create({ customer, return_url: getURL("/account") });
    return url;
  } catch (error) {
    console.error(error);
    return getErrorRedirect(currentPath, "Portal creation failed", "Please try again later.");
  }
}
