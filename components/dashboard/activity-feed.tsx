"use client";

import {
  Sparkles, Copy, Bookmark, Share2, Video, Edit, Download,
} from "lucide-react";
import { MOCK_ACTIVITY } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";

const iconMap = {
  sparkles: Sparkles,
  copy: Copy,
  bookmark: Bookmark,
  share: Share2,
  video: Video,
  edit: Edit,
  download: Download,
} as const;

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)]">
      <div className="px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-base font-semibold">Activity</h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">Last 24 hours</p>
      </div>
      <ol className="p-2">
        {MOCK_ACTIVITY.map((a, i) => {
          const Icon = (iconMap as Record<string, typeof Sparkles>)[a.icon] ?? Sparkles;
          const isLast = i === MOCK_ACTIVITY.length - 1;
          return (
            <li key={a.id} className="relative flex gap-3 px-3 py-3">
              {!isLast && (
                <span className="absolute left-[26px] top-10 bottom-0 w-px bg-[var(--border)]" aria-hidden />
              )}
              <div className="relative h-7 w-7 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0">
                <Icon className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] leading-tight">{a.label}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{a.meta}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">
                  {formatRelativeTime(a.createdAt)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
