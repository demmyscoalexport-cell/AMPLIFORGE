"use client";

import * as React from "react";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TranscriptSegment } from "@/lib/supabase/types";

interface Props {
  projectId: string;
  initialSegments?: TranscriptSegment[];
}

export function TranscriptPanel({ projectId, initialSegments = [] }: Props) {
  const [active, setActive] = React.useState(0);
  const [query, setQuery] = React.useState("");
  const [segments, setSegments] = React.useState<TranscriptSegment[]>(initialSegments);
  const [loading, setLoading] = React.useState(initialSegments.length === 0);

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/v1/projects/${projectId}/transcript`);
        if (!res.ok) return;
        const data = (await res.json()) as { segments?: TranscriptSegment[] };
        if (!cancelled && data.segments?.length) {
          setSegments(data.segments);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (initialSegments.length === 0) {
      void load();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [projectId, initialSegments.length]);

  const filtered = query
    ? segments.filter((t) => t.text.toLowerCase().includes(query.toLowerCase()))
    : segments;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transcript…"
            className="pl-9 h-9 text-xs"
          />
        </div>
        <Button variant="secondary" size="sm" disabled>
          <Download className="h-3 w-3" />
          Export
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--text-muted)] py-8 text-center">Loading transcript…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] py-8 text-center">
          Transcript will appear after processing finishes.
        </p>
      ) : (
        <div className="space-y-2 overflow-y-auto pr-2 flex-1 max-h-[600px]">
          {filtered.map((entry, i) => {
            const isActive = i === active && !query;
            return (
              <button
                key={`${entry.time}-${i}`}
                onClick={() => setActive(i)}
                className={cn(
                  "w-full text-left rounded-lg p-3 transition-colors border",
                  isActive
                    ? "border-[var(--brand-blue)]/30 bg-[var(--brand-blue)]/5"
                    : "border-transparent hover:bg-[var(--surface)] hover:border-[var(--border-subtle)]"
                )}
              >
                <span
                  className={cn(
                    "text-xs font-mono",
                    isActive ? "text-[var(--brand-blue)] font-semibold" : "text-[var(--text-muted)]"
                  )}
                >
                  {entry.time}
                </span>
                <p
                  className={cn(
                    "text-sm leading-relaxed mt-1",
                    isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                  )}
                >
                  {entry.text}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
