import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { UpgradeClient } from "@/components/dashboard/upgrade-client";
import { PRICING_TIERS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function UpgradePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { data: dbUser } = await createSupabaseAdminClient()
    .from("users")
    .select("plan, credits, credits_limit")
    .eq("id", userId)
    .maybeSingle();

  return (
    <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Choose your plan</h1>
        <p className="text-[var(--text-muted)] mt-2 max-w-xl mx-auto">
          Scale your content output. Upgrade or downgrade anytime.
        </p>
      </header>
      <UpgradeClient
        tiers={PRICING_TIERS}
        currentPlan={dbUser?.plan ?? "starter"}
        credits={dbUser?.credits ?? 0}
        creditsLimit={dbUser?.credits_limit ?? 5000}
      />
    </div>
  );
}
