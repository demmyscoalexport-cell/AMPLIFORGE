"use client";

import { Play, Eye, Calendar, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import type { DbProject } from "@/lib/supabase/types";

export function VideoPlayer({ project, outputsCount }: { project: DbProject; outputsCount: number }) {
  const thumbnail = project.thumbnail ?? "linear-gradient(135deg, #0D66D0, #9256D9)";

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--border)]"
        style={{ backgroundImage: thumbnail }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center group"
        >
          <span className="h-16 w-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            <Play className="h-6 w-6 text-zinc-900 ml-1" fill="currentColor" />
          </span>
        </button>
        {project.duration && (
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
            <span className="font-mono text-xs bg-black/60 px-2 py-1 rounded">{project.duration}</span>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold leading-snug">{project.title}</h2>
        {project.channel && <p className="text-sm text-[var(--text-muted)] mt-1">{project.channel}</p>}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" /> {outputsCount} outputs
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {formatRelativeTime(project.created_at)}
          </span>
          <span className="capitalize inline-flex items-center gap-1">
            <Hash className="h-3 w-3" /> {project.source}
          </span>
        </div>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mr-1 self-center">
              Topics
            </p>
            {project.tags.map((tag) => (
              <Badge key={tag} variant="brand">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
