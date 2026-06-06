import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAnalyticsSeries } from "@/lib/data/analytics";
import { getDashboardStats } from "@/lib/data/projects";
import { AnalyticsClient } from "@/components/dashboard/analytics-client";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [series30, stats] = await Promise.all([
    getAnalyticsSeries(30).catch(() => []),
    getDashboardStats().catch(() => ({
      videosProcessed: 0,
      contentGenerated: 0,
      timeSavedHours: 0,
      engagementGrowth: 0,
    })),
  ]);

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Track your content output, time saved, and engagement growth
        </p>
      </header>
      <AnalyticsClient series={series30} stats={stats} />
    </div>
  );
}
