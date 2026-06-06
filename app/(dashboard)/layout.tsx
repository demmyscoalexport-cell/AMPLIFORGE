"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { MobileBottomNav } from "@/components/dashboard/mobile-nav";
import { CommandPalette } from "@/components/shared/command-palette";
import { UpgradeModal } from "@/components/shared/upgrade-modal";
import { AiStatusIndicator } from "@/components/shared/ai-status-indicator";
import { useUIStore } from "@/store/ui-store";
import { useAiProcessing } from "@/hooks/use-ai-processing";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  useAiProcessing();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <AiStatusIndicator />
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300",
          "lg:pl-[280px]",
          collapsed && "lg:pl-[76px]"
        )}
      >
        <TopNavbar />
        <main className="pb-20 lg:pb-12">{children}</main>
      </div>
      <MobileBottomNav />
      <CommandPalette />
      <UpgradeModal />
    </div>
  );
}
