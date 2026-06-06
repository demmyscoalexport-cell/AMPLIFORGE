"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Copy,
  Star,
  StarOff,
  FileText,
  Mail,
  Zap,
  AlignLeft,
  Images,
  MessageSquare,
} from "lucide-react";
import { LinkedinIcon, TwitterIcon } from "@/components/shared/brand-icons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DbContentItem, ContentType } from "@/lib/supabase/types";
import { toast } from "sonner";

const TYPE_META: Record<ContentType, { label: string; icon: React.ElementType; color: string }> = {
  linkedin: { label: "LinkedIn", icon: LinkedinIcon, color: "text-blue-500" },
  email: { label: "Email", icon: Mail, color: "text-amber-500" },
  thread: { label: "Thread", icon: TwitterIcon, color: "text-sky-500" },
  hook: { label: "Hook", icon: Zap, color: "text-purple-500" },
  summary: { label: "Summary", icon: AlignLeft, color: "text-green-500" },
  carousel: { label: "Carousel", icon: Images, color: "text-pink-500" },
  caption: { label: "Caption", icon: MessageSquare, color: "text-orange-500" },
};

const ALL_TYPES: ContentType[] = ["linkedin", "email", "thread", "hook", "summary", "carousel", "caption"];

export function LibraryClient({ items }: { items: DbContentItem[] }) {
  const [query, setQuery] = React.useState("");
  const [activeType, setActiveType] = React.useState<ContentType | "all">("all");
  const [starredOnly, setStarredOnly] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const filtered = items.filter((item) => {
    if (starredOnly && !item.starred) return false;
    if (activeType !== "all" && item.type !== activeType) return false;
    if (query && !item.title.toLowerCase().includes(query.toLowerCase()) && !item.body.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  function copyItem(body: string) {
    navigator.clipboard.writeText(body).then(() => toast.success("Copied to clipboard"));
  }

  return (
    <div className="space-y-5">
      {/* Search + filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search library…"
            className="pl-9"
          />
        </div>
        <button
          onClick={() => setStarredOnly((v) => !v)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-full border transition-colors",
            starredOnly
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
              : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface)]"
          )}
        >
          <Star className="h-3.5 w-3.5" />
          Starred
        </button>
      </div>

      {/* Type tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveType("all")}
          className={cn(
            "px-3 py-1.5 text-xs rounded-full border transition-colors",
            activeType === "all"
              ? "bg-[var(--brand-blue)]/12 border-[var(--brand-blue)]/30 text-[var(--brand-blue)]"
              : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface)]"
          )}
        >
          All ({items.length})
        </button>
        {ALL_TYPES.map((t) => {
          const meta = TYPE_META[t];
          const count = items.filter((i) => i.type === t).length;
          if (count === 0) return null;
          return (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-colors",
                activeType === t
                  ? "bg-[var(--brand-blue)]/12 border-[var(--brand-blue)]/30 text-[var(--brand-blue)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface)]"
              )}
            >
              <meta.icon className={cn("h-3 w-3", meta.color)} />
              {meta.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Content grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-16 text-center">
          <FileText className="mx-auto h-10 w-10 text-[var(--text-muted)] mb-4" />
          <h3 className="text-lg font-semibold">
            {items.length === 0 ? "No content yet" : "Nothing matches your filters"}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {items.length === 0
              ? "Create a project to generate your first content pieces."
              : "Try a different type or clear the search."}
          </p>
          {items.length === 0 && (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 mt-5 rounded-full bg-gradient-hero text-white text-sm font-medium px-5 py-2.5"
            >
              Create a project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const meta = TYPE_META[item.type];
            const isExpanded = expanded === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-5 flex flex-col gap-3 hover:shadow-card transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-7 w-7 rounded-lg bg-[var(--surface)] flex items-center justify-center", meta.color)}>
                      <meta.icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {meta.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.starred ? (
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ) : (
                      <StarOff className="h-4 w-4 text-[var(--text-muted)]" />
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold leading-snug">{item.title}</h3>
                  <p className={cn("text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed whitespace-pre-line", !isExpanded && "line-clamp-4")}>
                    {item.body}
                  </p>
                  {item.body.length > 200 && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                      className="text-xs text-[var(--brand-blue)] mt-1 hover:underline"
                    >
                      {isExpanded ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)]">{item.word_count} words</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs gap-1"
                    onClick={() => copyItem(item.body)}
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
