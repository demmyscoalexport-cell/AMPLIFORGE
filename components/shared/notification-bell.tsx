"use client";

import { Bell, Check, Sparkles, AlertTriangle, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { formatRelativeTime, cn } from "@/lib/utils";

const toneIcon = {
  success: { icon: Check, cls: "text-[var(--success)] bg-[var(--success)]/15" },
  warning: { icon: AlertTriangle, cls: "text-[var(--warning)] bg-[var(--warning)]/15" },
  info: { icon: Info, cls: "text-[var(--brand-blue)] bg-[var(--brand-blue)]/15" },
} as const;

export function NotificationBell() {
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]/40 transition-colors"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand-crimson)] px-1 text-[10px] font-bold text-white ring-2 ring-[var(--bg-primary)]">
              {unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <button className="text-xs text-[var(--brand-blue)] hover:underline">Mark all read</button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {MOCK_NOTIFICATIONS.map((n) => {
            const Tone = toneIcon[n.tone];
            return (
              <div
                key={n.id}
                className={cn(
                  "flex gap-3 px-4 py-3 border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface)] transition-colors cursor-pointer",
                  !n.read && "bg-[var(--brand-blue)]/[0.03]"
                )}
              >
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", Tone.cls)}>
                  <Tone.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-[var(--brand-blue)] shrink-0" />}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{n.body}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1.5 uppercase tracking-wider">
                    {formatRelativeTime(n.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-[var(--border)] px-4 py-2.5 text-center">
          <button className="text-xs font-medium text-[var(--brand-blue)] hover:underline">
            View all notifications
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
