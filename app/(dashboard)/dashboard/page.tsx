import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProjects, getDashboardStats } from "@/lib/data/projects";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [user, stats, recentProjects] = await Promise.all([
    currentUser(),
    getDashboardStats().catch(() => ({
      videosProcessed: 0,
      contentGenerated: 0,
      timeSavedHours: 0,
      engagementGrowth: 0,
    })),
    getProjects(5).catch(() => []),
  ]);

  const greetingName = user?.firstName ?? user?.username ?? "Creator";

  return (
    <DashboardShell
      greetingName={greetingName}
      stats={stats}
      recentProjects={recentProjects}
    />
  );
}
