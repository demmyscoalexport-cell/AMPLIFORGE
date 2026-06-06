"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search, LayoutGrid, List, Mic, Video as VideoIcon } from "lucide-react";
import { YoutubeIcon as Youtube } from "@/components/shared/brand-icons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime, cn } from "@/lib/utils";
import type { DbProject } from "@/lib/supabase/types";

const sourceIcon = {
  youtube: Youtube,
  podcast: Mic,
  webinar: VideoIcon,
} as const;

const FILTERS = ["All", "YouTube", "Podcast", "Webinar", "Processing", "Done", "Draft"] as const;

export function ProjectsListClient({ projects }: { projects: DbProject[] }) {
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = React.useState("");

  const filtered = projects.filter((p) => {
    if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
    if (filter === "All") return true;
    if (filter === "YouTube") return p.source === "youtube";
    if (filter === "Podcast") return p.source === "podcast";
    if (filter === "Webinar") return p.source === "webinar";
    if (filter === "Processing") return p.status === "processing";
    if (filter === "Done") return p.status === "done";
    if (filter === "Draft") return p.status === "draft";
    return true;
  });

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="pl-9"
          />
        </div>

        <div className="ml-auto inline-flex rounded-full border border-[var(--border)] p-0.5 bg-[var(--surface)]">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full",
              view === "grid" ? "bg-[var(--bg-primary)] shadow-sm" : "text-[var(--text-muted)]"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full",
              view === "list" ? "bg-[var(--bg-primary)] shadow-sm" : "text-[var(--text-muted)]"
            )}
          >
            <List className="h-3.5 w-3.5" /> List
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 text-xs rounded-full border transition-colors",
              filter === f
                ? "bg-[var(--brand-blue)]/12 border-[var(--brand-blue)]/30 text-[var(--brand-blue)]"
                : "bg-transparent border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface)]"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-16 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-hero/10 flex items-center justify-center mb-4">
            <Plus className="h-7 w-7 text-[var(--brand-blue)]" />
          </div>
          <h3 className="text-lg font-semibold">
            {projects.length === 0 ? "No projects yet" : "No projects match this filter"}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {projects.length === 0
              ? "Paste your first video link from the dashboard to get started."
              : "Try a different filter or clear your search."}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 mt-5 rounded-full bg-gradient-hero text-white text-sm font-medium px-5 py-2.5"
          >
            <Plus className="h-4 w-4" />
            Create first project
          </Link>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const Icon = sourceIcon[p.source];
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--elevated)] overflow-hidden hover:shadow-card-lg transition-all hover:-translate-y-1"
              >
                <div
                  className="aspect-video relative"
                  style={{ backgroundImage: p.thumbnail ?? "linear-gradient(135deg, #0D66D0, #9256D9)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2 py-1 text-[10px] text-white capitalize">
                    <Icon className="h-3 w-3" /> {p.source}
                  </span>
                  {p.duration && (
                    <span className="absolute top-3 right-3 inline-flex rounded-full bg-black/60 backdrop-blur px-2 py-1 text-[10px] text-white font-mono">
                      {p.duration}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold line-clamp-2 leading-snug group-hover:text-[var(--brand-blue)] transition-colors">
                    {p.title}
                  </h3>
                  {p.channel && <p className="text-xs text-[var(--text-muted)] mt-1">{p.channel}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <Badge
                      variant={
                        p.status === "done" ? "success" : p.status === "processing" ? "brand" : "outline"
                      }
                    >
                      {p.status}
                    </Badge>
                    <span className="text-xs text-[var(--text-muted)]">{formatRelativeTime(p.created_at)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] divide-y divide-[var(--border-subtle)]">
          {filtered.map((p) => {
            const Icon = sourceIcon[p.source];
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--surface)]/60 transition-colors"
              >
                <div
                  className="h-10 w-16 rounded-md shrink-0 relative"
                  style={{ backgroundImage: p.thumbnail ?? "linear-gradient(135deg, #0D66D0, #9256D9)" }}
                >
                  <Icon className="absolute inset-0 m-auto h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">
                    {p.channel ?? "—"} · {formatRelativeTime(p.created_at)}
                  </p>
                </div>
                <Badge variant={p.status === "done" ? "success" : p.status === "processing" ? "brand" : "outline"}>
                  {p.status}
                </Badge>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
