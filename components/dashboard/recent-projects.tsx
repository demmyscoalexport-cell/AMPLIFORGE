"use client";

import Link from "next/link";
import { MoreHorizontal, ExternalLink, Download, Mic, Video as VideoIcon } from "lucide-react";
import { YoutubeIcon as Youtube } from "@/components/shared/brand-icons";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime, cn } from "@/lib/utils";
import type { DbProject } from "@/lib/supabase/types";

const sourceIcon = {
  youtube: Youtube,
  podcast: Mic,
  webinar: VideoIcon,
} as const;

const statusVariant = {
  done: { label: "Done", variant: "success" as const },
  processing: { label: "Processing", variant: "brand" as const },
  draft: { label: "Draft", variant: "outline" as const },
  failed: { label: "Failed", variant: "danger" as const },
};

export function RecentProjects({ projects }: { projects: DbProject[] }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <div>
          <h3 className="text-base font-semibold">Recent Projects</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {projects.length === 0
              ? "Paste a link above to create your first project."
              : "Pick up where you left off"}
          </p>
        </div>
        <Link href="/projects" className="text-xs font-medium text-[var(--brand-blue)] hover:underline">
          View all →
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-[var(--text-muted)]">
          No projects yet.
        </div>
      ) : (
        <>
          <div className="hidden md:grid grid-cols-[2fr_120px_100px_110px_140px_60px] gap-4 px-5 py-2.5 text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold border-b border-[var(--border-subtle)]">
            <div>Title</div>
            <div>Type</div>
            <div>Outputs</div>
            <div>Status</div>
            <div>Created</div>
            <div></div>
          </div>

          <div>
            {projects.map((p) => {
              const Icon = sourceIcon[p.source];
              const status = statusVariant[p.status];
              return (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="group grid grid-cols-1 md:grid-cols-[2fr_120px_100px_110px_140px_60px] gap-2 md:gap-4 px-5 py-3.5 border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface)]/60 transition-colors items-center"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-10 w-16 rounded-md shrink-0 relative overflow-hidden"
                      style={{ backgroundImage: p.thumbnail ?? "linear-gradient(135deg, #0D66D0, #9256D9)" }}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="h-3.5 w-3.5 text-white drop-shadow" />
                      </div>
                      {p.duration && (
                        <span className="absolute bottom-0.5 right-0.5 text-[9px] font-mono text-white bg-black/50 px-1 rounded">
                          {p.duration}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate text-[var(--text-primary)] group-hover:text-[var(--brand-blue)] transition-colors">
                        {p.title}
                      </p>
                      {p.channel && <p className="text-xs text-[var(--text-muted)] truncate">{p.channel}</p>}
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <Icon className="h-3 w-3" />
                    <span className="capitalize">{p.source}</span>
                  </div>

                  <div className="hidden md:block text-xs font-medium text-[var(--text-primary)]">
                    <span className="text-[var(--text-muted)]">view</span>
                  </div>

                  <div className="hidden md:block">
                    <Badge variant={status.variant} className={cn(p.status === "processing" && "animate-pulse")}>
                      {status.label}
                    </Badge>
                  </div>

                  <div className="hidden md:block text-xs text-[var(--text-muted)]">
                    {formatRelativeTime(p.created_at)}
                  </div>

                  <div className="hidden md:flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.preventDefault()}
                          className="h-7 w-7 inline-flex items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="More actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <ExternalLink /> Open
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download /> Export
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[var(--danger)]">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
