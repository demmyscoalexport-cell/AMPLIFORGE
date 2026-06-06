"use client";

import * as React from "react";
import { Check, Zap, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { PricingTier, PlanTier } from "@/types";
import { toast } from "sonner";

export function UpgradeClient({
  tiers,
  currentPlan,
  credits,
  creditsLimit,
}: {
  tiers: PricingTier[];
  currentPlan: PlanTier;
  credits: number;
  creditsLimit: number;
}) {
  const [billing, setBilling] = React.useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = React.useState<string | null>(null);

  async function handleUpgrade(tierId: string) {
    if (tierId === currentPlan) return;
    if (tierId === "agency") {
      window.location.href = "mailto:hello@ampliforge.com?subject=Agency Plan Inquiry";
      return;
    }
    setLoading(tierId);
    try {
      const res = await fetch("/api/v1/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: tierId, billing }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Failed to create checkout");
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  const creditPct = creditsLimit > 0 ? (credits / creditsLimit) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Current usage */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-5 flex items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Credits remaining</span>
            <span className="font-mono text-[var(--text-muted)]">
              {credits.toLocaleString()} / {creditsLimit.toLocaleString()}
            </span>
          </div>
          <Progress value={creditPct} className="h-2" />
          <p className="text-xs text-[var(--text-muted)] mt-1.5">
            Each video costs 500 credits · You have ~{Math.floor(credits / 500)} videos remaining
          </p>
        </div>
        <Badge variant="outline" className="capitalize shrink-0">{currentPlan} plan</Badge>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={cn("text-sm", billing === "monthly" ? "font-medium" : "text-[var(--text-muted)]")}>
          Monthly
        </span>
        <button
          onClick={() => setBilling((b) => (b === "monthly" ? "yearly" : "monthly"))}
          className={cn(
            "relative h-6 w-11 rounded-full border transition-colors",
            billing === "yearly" ? "bg-[var(--brand-blue)] border-[var(--brand-blue)]" : "bg-[var(--surface)] border-[var(--border)]"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
              billing === "yearly" && "translate-x-5"
            )}
          />
        </button>
        <span className={cn("text-sm flex items-center gap-1.5", billing === "yearly" ? "font-medium" : "text-[var(--text-muted)]")}>
          Yearly
          <Badge variant="success" className="text-[10px] px-1.5 py-0">Save 40%</Badge>
        </span>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tiers.map((tier) => {
          const isCurrent = tier.id === currentPlan;
          const price = billing === "yearly" ? tier.price.yearly : tier.price.monthly;
          return (
            <div
              key={tier.id}
              className={cn(
                "relative rounded-2xl border p-6 flex flex-col gap-5 transition-all",
                tier.highlight
                  ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]/5 shadow-[0_0_0_1px_var(--brand-blue)]"
                  : "border-[var(--border)] bg-[var(--elevated)]"
              )}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-hero text-white text-[10px] font-semibold px-3 py-1 shadow-glow-blue">
                  <Sparkles className="h-3 w-3" /> Most Popular
                </span>
              )}

              <div>
                <h3 className="font-semibold text-lg">{tier.name}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{tier.description}</p>
              </div>

              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold tracking-tight">${price}</span>
                <span className="text-[var(--text-muted)] text-sm mb-1">/mo</span>
              </div>

              <ul className="space-y-2.5 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-[var(--brand-blue)] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={tier.highlight ? "default" : "secondary"}
                disabled={isCurrent || loading === tier.id}
                onClick={() => handleUpgrade(tier.id)}
              >
                {loading === tier.id ? (
                  "Redirecting…"
                ) : isCurrent ? (
                  "Current plan"
                ) : tier.id === "agency" ? (
                  <>Contact Sales <ArrowRight className="h-4 w-4" /></>
                ) : (
                  <><Zap className="h-4 w-4" /> {tier.cta}</>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-[var(--text-muted)]">
        All plans include a 7-day free trial. Cancel anytime. Payments processed securely by Stripe.
      </p>
    </div>
  );
}
