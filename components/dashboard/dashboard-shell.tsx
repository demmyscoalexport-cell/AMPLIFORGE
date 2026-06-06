"use client";

import { motion } from "framer-motion";
import { AiCommandBar } from "@/components/dashboard/ai-command-bar";
import { ProcessingCard } from "@/components/dashboard/processing-card";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { DbProject } from "@/lib/supabase/types";
import type { DashboardStats } from "@/lib/data/projects";

interface Props {
  greetingName: string;
  stats: DashboardStats;
  recentProjects: DbProject[];
}

export function DashboardShell({ greetingName, stats, recentProjects }: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-8"
    >
      <motion.header variants={fadeUp} className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
            Good morning, {greetingName}
          </p>
          <h1 className="text-3xl font-bold tracking-tight mt-1">
            Let&apos;s turn one video into a week of content.
          </h1>
        </div>
      </motion.header>

      <motion.div variants={fadeUp}>
        <AiCommandBar />
      </motion.div>

      <motion.div variants={fadeUp}>
        <ProcessingCard />
      </motion.div>

      <motion.section variants={fadeUp}>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
          Overview
        </h2>
        <StatsGrid stats={stats} />
      </motion.section>

      <motion.section variants={fadeUp}>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
          Quick actions
        </h2>
        <QuickActions />
      </motion.section>

      <motion.section variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <RecentProjects projects={recentProjects} />
        <ActivityFeed />
      </motion.section>
    </motion.div>
  );
}
