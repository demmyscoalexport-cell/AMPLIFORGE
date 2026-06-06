"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Folder,
  Library,
  Palette,
  BarChart3,
  Sparkles,
  Settings,
  User,
  Plus,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ChevronDown,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUIStore } from "@/store/ui-store";
import { useAppStore } from "@/store/app-store";
import { cn, formatNumber } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const iconMap = {
  home: Home,
  folder: Folder,
  library: Library,
  palette: Palette,
  "bar-chart": BarChart3,
  sparkles: Sparkles,
  settings: Settings,
  user: User,
} as const;

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "home" as const },
      { label: "Projects", href: "/projects", icon: "folder" as const },
      { label: "Library", href: "/library", icon: "library" as const },
      { label: "Templates", href: "/templates", icon: "palette" as const },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Analytics", href: "/analytics", icon: "bar-chart" as const },
      { label: "AI Assistant", href: "/dashboard", icon: "sparkles" as const, badge: "Beta" },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Settings", href: "/settings", icon: "settings" as const },
      { label: "Profile", href: "/settings/profile", icon: "user" as const },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const { credits, creditsLimit, plan } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-[var(--border)] bg-[var(--bg-secondary)] transition-all duration-300 hidden lg:flex flex-col",
        collapsed ? "w-[76px]" : "w-[280px]"
      )}
    >
      {/* Top: Logo + workspace */}
      <div className="px-4 py-5 border-b border-[var(--border-subtle)]">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {collapsed ? (
            <Link href="/dashboard" aria-label="Home">
              <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
            </Link>
          ) : (
            <Logo size="sm" />
          )}
          <button
            onClick={toggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors",
              collapsed && "absolute -right-3 top-7 h-6 w-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full"
            )}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        </div>

        {!collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mt-4 w-full flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 hover:bg-[var(--elevated)] transition-colors text-left">
                <div className="h-6 w-6 rounded bg-gradient-hero text-white text-xs font-bold flex items-center justify-center">
                  AR
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--text-primary)] truncate">Ava Romero</p>
                  <p className="text-[10px] text-[var(--text-muted)] truncate">Personal Workspace</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[252px]">
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              <DropdownMenuItem>Personal Workspace</DropdownMenuItem>
              <DropdownMenuItem>Growth Founders LLC</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="h-4 w-4" /> Create workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          asChild
          size={collapsed ? "icon" : "md"}
          className={cn("mt-3 w-full", collapsed && "h-10")}
        >
          <Link href="/projects" aria-label="New project">
            <Plus className="h-4 w-4" />
            {!collapsed && "New Project"}
          </Link>
        </Button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = iconMap[item.icon];
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-200",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] hover:translate-x-0.5"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-gradient-hero"
                      />
                    )}
                    <Icon className={cn("h-4 w-4 shrink-0", active && "drop-shadow-[0_0_8px_rgba(13,102,208,0.5)]")} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {"badge" in item && item.badge && (
                          <Badge variant="purple" className="text-[9px] px-1.5 py-0">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: credits + upgrade */}
      {!collapsed ? (
        <div className="border-t border-[var(--border-subtle)] p-4 space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-[var(--text-secondary)]">Credits</span>
              <span className="font-mono text-[var(--text-muted)]">
                {formatNumber(credits)}/{formatNumber(creditsLimit)}
              </span>
            </div>
            <Progress value={(credits / creditsLimit) * 100} className="h-1.5" />
          </div>
          <Button asChild variant="secondary" className="w-full border-[var(--brand-gold)]/40 text-[var(--brand-gold)] hover:bg-[var(--brand-gold)]/5">
            <Link href="/upgrade">
              <ArrowUp className="h-4 w-4" />
              Upgrade Plan
            </Link>
          </Button>
          <div className="flex items-center gap-2 px-1">
            <div className="h-7 w-7 rounded-full bg-gradient-hero text-white text-xs font-bold flex items-center justify-center shrink-0">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Ava Romero</p>
              <p className="text-[10px] text-[var(--text-muted)] truncate capitalize">{plan} Plan</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-[var(--border-subtle)] p-2 flex flex-col items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-hero text-white text-xs font-bold flex items-center justify-center">
            AR
          </div>
        </div>
      )}
    </aside>
  );
}
