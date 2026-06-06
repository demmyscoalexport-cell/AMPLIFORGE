"use client";

import Link from "next/link";
import { MessageCircle, Mail, Palette } from "lucide-react";
import { LinkedinIcon as Linkedin } from "@/components/shared/brand-icons";

const ACTIONS = [
  { label: "New LinkedIn Post", icon: Linkedin, href: "/templates?type=linkedin", color: "from-[#0D66D0] to-[#0EA5E9]" },
  { label: "New Thread", icon: MessageCircle, href: "/templates?type=thread", color: "from-[#E34850] to-[#FF6B6B]" },
  { label: "New Email", icon: Mail, href: "/templates?type=email", color: "from-[#9256D9] to-[#0D66D0]" },
  { label: "Browse Templates", icon: Palette, href: "/templates", color: "from-[#D4AF37] to-[#FFD700]" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {ACTIONS.map((a) => (
        <Link
          key={a.label}
          href={a.href}
          className="group relative flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-4 hover:shadow-card transition-all hover:-translate-y-0.5 overflow-hidden"
        >
          <div className={`absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br opacity-10 blur-2xl ${a.color}`} />
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br shrink-0 ${a.color}`}>
            <a.icon className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--brand-blue)] transition-colors">
            {a.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
