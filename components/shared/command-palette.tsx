"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  Home,
  Folder,
  Library,
  Palette,
  BarChart3,
  Settings,
  Plus,
  CircleHelp,
  Sparkles,
  CreditCard,
  Megaphone,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUIStore } from "@/store/ui-store";

export function CommandPalette() {
  const router = useRouter();
  const open = useUIStore((s) => s.commandOpen);
  const setOpen = useUIStore((s) => s.setCommandOpen);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-2xl gap-0 overflow-hidden">
        <Command label="Command palette" className="bg-transparent">
          <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3.5">
            <Search className="h-4 w-4 text-[var(--text-muted)]" />
            <Command.Input
              placeholder="Search projects, content, or jump anywhere…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
            />
            <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)]">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-[var(--text-muted)]">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--text-muted)]">
              <CmdItem onSelect={() => go("/dashboard")} icon={Home}>Dashboard</CmdItem>
              <CmdItem onSelect={() => go("/projects")} icon={Folder}>Projects</CmdItem>
              <CmdItem onSelect={() => go("/library")} icon={Library}>Library</CmdItem>
              <CmdItem onSelect={() => go("/templates")} icon={Palette}>Templates</CmdItem>
              <CmdItem onSelect={() => go("/analytics")} icon={BarChart3}>Analytics</CmdItem>
              <CmdItem onSelect={() => go("/settings")} icon={Settings}>Settings</CmdItem>
            </Command.Group>

            <Command.Group heading="Actions" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--text-muted)]">
              <CmdItem onSelect={() => go("/dashboard")} icon={Plus}>New project</CmdItem>
              <CmdItem onSelect={() => go("/dashboard")} icon={Sparkles}>Ask AmpliForge AI</CmdItem>
              <CmdItem onSelect={() => go("/upgrade")} icon={CreditCard}>Upgrade plan</CmdItem>
              <CmdItem onSelect={() => go("/changelog")} icon={Megaphone}>What&apos;s new</CmdItem>
              <CmdItem onSelect={() => go("/contact")} icon={CircleHelp}>Contact support</CmdItem>
            </Command.Group>

            <Command.Group heading="Jump to" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--text-muted)]">
              <CmdItem onSelect={() => go("/projects")} icon={Folder}>
                <span className="truncate">All projects</span>
              </CmdItem>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CmdItem({
  children,
  icon: Icon,
  onSelect,
}: {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] data-[selected=true]:bg-[var(--surface)]"
    >
      <Icon className="h-4 w-4 text-[var(--text-muted)]" />
      <span className="flex-1 truncate">{children}</span>
    </Command.Item>
  );
}
