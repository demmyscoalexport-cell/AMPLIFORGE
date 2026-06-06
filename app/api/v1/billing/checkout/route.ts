import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/api/auth";
import { stripe, STRIPE_PRICES } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const userId = await requireUserId();

  const body = (await req.json()) as { plan?: string; billing?: string };
  const plan = body.plan ?? "pro";
  const billing = body.billing === "yearly" ? "yearly" : "monthly";

  const priceId = STRIPE_PRICES[plan]?.[billing];
  if (!priceId) {
    return NextResponse.json({ error: "Invalid plan or billing cycle" }, { status: 400 });
  }

  // Get or create Stripe customer
  const supabase = createSupabaseAdminClient();
  const { data: dbUser } = await supabase
    .from("users")
    .select("email, full_name")
    .eq("id", userId)
    .maybeSingle();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: dbUser?.email,
    client_reference_id: userId,
    metadata: { userId, plan, billing },
    success_url: `${appUrl}/upgrade?success=1`,
    cancel_url: `${appUrl}/upgrade?canceled=1`,
    subscription_data: {
      metadata: { userId, plan },
    },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
