"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui-store";
import { PRICING_TIERS } from "@/lib/mock-data";

export function UpgradeModal() {
  const open = useUIStore((s) => s.upgradeOpen);
  const setOpen = useUIStore((s) => s.setUpgradeOpen);
  const pro = PRICING_TIERS.find((t) => t.id === "pro")!;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <div className="relative bg-gradient-hero p-6 text-white">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="relative">
            <Sparkles className="h-7 w-7 mb-3" />
            <h2 className="text-2xl font-bold">Upgrade to Pro</h2>
            <p className="text-white/85 text-sm mt-1">
              Unlock unlimited creator power.
            </p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base">Everything in Pro</DialogTitle>
            <DialogDescription>
              <span className="text-3xl font-bold text-[var(--text-primary)]">${pro.price.monthly}</span>
              <span className="text-[var(--text-muted)] ml-1">/month</span>
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2.5 text-sm">
            {pro.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-[var(--success)] shrink-0 mt-0.5" />
                <span className="text-[var(--text-secondary)]">{f}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 pt-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/upgrade" onClick={() => setOpen(false)}>
                Upgrade now
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
