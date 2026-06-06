"use client";

import Link from "next/link";
import { Gem } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { formatCompact } from "@/lib/utils";

export function CreditsBadge() {
  const credits = useAppStore((s) => s.credits);
  return (
    <Link
      href="/upgrade"
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-gold)]/30 bg-[var(--brand-gold)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--brand-gold)] hover:bg-[var(--brand-gold)]/15 transition-colors"
    >
      <Gem className="h-3.5 w-3.5" />
      <span>{formatCompact(credits)} cr</span>
    </Link>
  );
}
