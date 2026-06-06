import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

const CREDITS_BY_PLAN: Record<string, number> = {
  starter: 5_000,
  pro: 50_000,
  agency: 999_999_999,
};

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.CheckoutSession;
      const userId = session.client_reference_id ?? session.metadata?.userId;
      const plan = session.metadata?.plan ?? "pro";
      if (userId) {
        await supabase
          .from("users")
          .update({
            plan: plan as "starter" | "pro" | "agency",
            credits_limit: CREDITS_BY_PLAN[plan] ?? 50_000,
            credits: CREDITS_BY_PLAN[plan] ?? 50_000,
          })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      const plan = sub.metadata?.plan ?? "pro";
      const active = sub.status === "active" || sub.status === "trialing";
      if (userId) {
        await supabase
          .from("users")
          .update({
            plan: active ? (plan as "starter" | "pro" | "agency") : "starter",
            credits_limit: active ? (CREDITS_BY_PLAN[plan] ?? 50_000) : CREDITS_BY_PLAN.starter,
          })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) {
        await supabase
          .from("users")
          .update({ plan: "starter", credits_limit: CREDITS_BY_PLAN.starter })
          .eq("id", userId);
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
