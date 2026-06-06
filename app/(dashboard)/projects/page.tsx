import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getProjects } from "@/lib/data/projects";
import { ProjectsListClient } from "@/components/dashboard/projects-list-client";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const projects = await getProjects().catch(() => []);

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-hero text-white text-sm font-medium px-5 py-2.5 shadow-[0_4px_14px_rgba(13,102,208,0.35)]"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </header>

      <ProjectsListClient projects={projects} />
    </div>
  );
}
