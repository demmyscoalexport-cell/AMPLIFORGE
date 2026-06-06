import "server-only";
import Stripe from "stripe";

// Singleton Stripe client — server-only
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-05-27.dahlia",
  typescript: true,
});

// Stripe Price IDs — map plan + billing cycle to Stripe price.
// Create these in your Stripe dashboard and set the env vars.
export const STRIPE_PRICES: Record<string, Record<string, string>> = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? "",
  },
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "",
    yearly: process.env.STRIPE_PRICE_STARTER_YEARLY ?? "",
  },
};
