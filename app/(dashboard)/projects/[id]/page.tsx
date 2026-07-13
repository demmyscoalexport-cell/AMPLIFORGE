import Link from "next/link";
import { ChevronLeft, Download, ChevronDown } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/project/video-player";
import { TranscriptPanel } from "@/components/project/transcript-panel";
import { OutputTabs } from "@/components/project/output-tabs";
import { getProjectById } from "@/lib/data/projects";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const result = await getProjectById(id);
  if (!result) notFound();

  const { project, content } = result;
  const outputsCount = content.length;

  return (
    <div className="px-4 md:px-8 py-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link href="/projects" className="inline-flex items-center gap-1 hover:text-[var(--text-primary)]">
            <ChevronLeft className="h-4 w-4" />
            Projects
          </Link>
          <span>/</span>
          <span className="text-[var(--text-primary)] font-medium truncate max-w-[420px]">{project.title}</span>
        </div>

        <a href={`/api/v1/projects/${id}/export`} download>
          <Button size="md">
            <Download className="h-4 w-4" />
            Export All ({outputsCount})
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_minmax(0,560px)] xl:grid-cols-[380px_1fr_minmax(0,640px)] gap-6">
        <aside>
          <VideoPlayer project={project} outputsCount={outputsCount} />
        </aside>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Transcript
            </h3>
          </div>
          <TranscriptPanel projectId={project.id} />
        </section>

        <section>
          <OutputTabs content={content} projectId={project.id} />
        </section>
      </div>
    </div>
  );
}
