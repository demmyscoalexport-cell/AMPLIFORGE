"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ChevronRight, LogOut, CreditCard, User, Keyboard, Settings } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NotificationBell } from "@/components/shared/notification-bell";
import { CreditsBadge } from "@/components/shared/credits-badge";
import { useUIStore } from "@/store/ui-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";

function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const titleize = (s: string) => s.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1 text-sm text-[var(--text-secondary)]">
      <Link href="/dashboard" className="hover:text-[var(--text-primary)]">Dashboard</Link>
      {segments.length > 0 && segments[0] !== "dashboard" && segments.map((seg, i) => (
        <span key={seg + i} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          <span className={i === segments.length - 1 ? "text-[var(--text-primary)] font-medium" : ""}>
            {titleize(seg)}
          </span>
        </span>
      ))}
    </nav>
  );
}

export function TopNavbar() {
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);
  const { user } = useUser();
  const { signOut } = useClerk();

  const displayName = user?.fullName ?? user?.firstName ?? user?.username ?? "Creator";
  const displayEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const avatarUrl = user?.imageUrl;
  const avatarFallback = initials(displayName);

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-[var(--border)] bg-[var(--bg-primary)]/85 backdrop-blur-xl">
      <div className="flex h-full items-center gap-3 px-6">
        <Breadcrumb />

        <button
          onClick={() => setCommandOpen(true)}
          className="ml-auto group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--elevated)] hover:border-[var(--text-muted)]/30 transition-all min-w-[200px] md:min-w-[280px]"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="rounded border border-[var(--border)] bg-[var(--bg-primary)] px-1.5 py-0.5 text-[10px] font-mono">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="hidden sm:block">
            <CreditsBadge />
          </div>
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full transition-transform hover:scale-105">
                <Avatar>
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{displayName}</p>
                  {displayEmail && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{displayEmail}</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings/profile"><User /> Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings"><Settings /> Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/billing"><CreditCard /> Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setCommandOpen(true)}>
                <Keyboard /> Keyboard shortcuts
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => signOut({ redirectUrl: "/" })}>
                <LogOut /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
