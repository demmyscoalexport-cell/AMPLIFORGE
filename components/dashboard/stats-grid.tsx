"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Video, Sparkles, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/lib/data/projects";

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

interface StatProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
  trend: number;
  trendLabel: string;
  accent: string;
}

function StatCard({ icon: Icon, label, value, suffix, trend, trendLabel, accent }: StatProps) {
  const animated = useCountUp(value, 1200);
  const up = trend >= 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-5 overflow-hidden shadow-card hover:shadow-card-lg transition-shadow"
    >
      <div className={cn("absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-10 blur-2xl", accent)} />

      <div className="flex items-start justify-between mb-4">
        <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br", accent)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        {trend !== 0 && (
          <span className={cn(
            "inline-flex items-center gap-0.5 text-xs font-semibold rounded-full px-2 py-0.5",
            up ? "text-[var(--success)] bg-[var(--success)]/10" : "text-[var(--danger)] bg-[var(--danger)]/10"
          )}>
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight tabular-nums">{animated.toLocaleString()}</span>
          {suffix && <span className="text-sm text-[var(--text-muted)]">{suffix}</span>}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1.5">{label}</p>
        <p className="text-[10px] text-[var(--text-muted)] mt-2 uppercase tracking-wider">{trendLabel}</p>
      </div>
    </motion.div>
  );
}

export function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Video}
        label="Videos Processed"
        value={stats.videosProcessed}
        trend={0}
        trendLabel="lifetime"
        accent="from-[#0D66D0] to-[#0EA5E9]"
      />
      <StatCard
        icon={Sparkles}
        label="Content Generated"
        value={stats.contentGenerated}
        trend={0}
        trendLabel="lifetime"
        accent="from-[#9256D9] to-[#0D66D0]"
      />
      <StatCard
        icon={Clock}
        label="Time Saved"
        value={stats.timeSavedHours}
        suffix="hrs"
        trend={0}
        trendLabel="estimated"
        accent="from-[#D4AF37] to-[#FFD700]"
      />
      <StatCard
        icon={TrendingUp}
        label="Engagement Growth"
        value={stats.engagementGrowth}
        suffix="%"
        trend={0}
        trendLabel="projected"
        accent="from-[#E34850] to-[#FF6B6B]"
      />
    </div>
  );
}
