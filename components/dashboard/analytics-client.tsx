"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Clock, Video, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DbAnalyticsDaily } from "@/lib/supabase/types";

interface Stats {
  videosProcessed: number;
  contentGenerated: number;
  timeSavedHours: number;
  engagementGrowth: number;
}

const RANGES = [7, 30, 90] as const;

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">{label}</span>
        <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center", color)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>
    </div>
  );
}

export function AnalyticsClient({
  series,
  stats,
}: {
  series: DbAnalyticsDaily[];
  stats: Stats;
}) {
  const [range, setRange] = React.useState<(typeof RANGES)[number]>(30);

  const chartData = series
    .slice(-range)
    .map((row) => ({
      date: new Date(row.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      total: row.total,
      linkedin: row.linkedin,
      email: row.email,
      threads: row.threads,
    }));

  const hasData = chartData.length > 0;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Videos processed"
          value={stats.videosProcessed}
          sub="All time"
          icon={Video}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          label="Content pieces"
          value={stats.contentGenerated}
          sub="Generated across all projects"
          icon={Sparkles}
          color="bg-purple-500/10 text-purple-500"
        />
        <StatCard
          label="Hours saved"
          value={`${stats.timeSavedHours}h`}
          sub="~2h saved per video"
          icon={Clock}
          color="bg-green-500/10 text-green-500"
        />
        <StatCard
          label="Engagement growth"
          value={`+${stats.engagementGrowth}%`}
          sub="Estimated from repurposing"
          icon={TrendingUp}
          color="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Range selector */}
      <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5 w-fit">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-full transition-colors",
              range === r
                ? "bg-[var(--bg-primary)] shadow-sm text-[var(--text-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            {r}d
          </button>
        ))}
      </div>

      {/* Area chart — total content over time */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-6">
        <h2 className="text-sm font-semibold mb-5">Content generated over time</h2>
        {hasData ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D66D0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0D66D0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="total" stroke="#0D66D0" strokeWidth={2} fill="url(#totalGrad)" name="Total" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart label="No data yet — process your first video to see trends" />
        )}
      </div>

      {/* Bar chart — by content type */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-6">
        <h2 className="text-sm font-semibold mb-5">Breakdown by content type</h2>
        {hasData ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="linkedin" stackId="a" fill="#0D66D0" name="LinkedIn" radius={[0, 0, 0, 0]} />
              <Bar dataKey="email" stackId="a" fill="#F59E0B" name="Email" />
              <Bar dataKey="threads" stackId="a" fill="#0EA5E9" name="Thread" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart label="Content type breakdown will appear after your first project" />
        )}
      </div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-60 flex items-center justify-center">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
