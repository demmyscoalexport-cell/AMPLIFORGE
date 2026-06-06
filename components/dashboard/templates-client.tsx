"use client";

import * as React from "react";
import {
  Search,
  Star,
  Users,
  Sparkles,
  Linkedin,
  Mail,
  Twitter,
  Zap,
  AlignLeft,
  Images,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { DbTemplate, ContentType } from "@/lib/supabase/types";

const TYPE_META: Record<ContentType, { label: string; icon: React.ElementType; color: string }> = {
  linkedin: { label: "LinkedIn", icon: Linkedin, color: "text-blue-500" },
  email: { label: "Email", icon: Mail, color: "text-amber-500" },
  thread: { label: "Thread", icon: Twitter, color: "text-sky-500" },
  hook: { label: "Hook", icon: Zap, color: "text-purple-500" },
  summary: { label: "Summary", icon: AlignLeft, color: "text-green-500" },
  carousel: { label: "Carousel", icon: Images, color: "text-pink-500" },
  caption: { label: "Caption", icon: MessageSquare, color: "text-orange-500" },
};

const CATEGORIES: { value: ContentType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "email", label: "Email" },
  { value: "thread", label: "Thread" },
  { value: "hook", label: "Hook" },
  { value: "summary", label: "Summary" },
  { value: "carousel", label: "Carousel" },
  { value: "caption", label: "Caption" },
];

function TemplateCard({ template }: { template: DbTemplate }) {
  const meta = TYPE_META[template.category];
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-5 flex flex-col gap-4 hover:shadow-card transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <div className={cn("h-9 w-9 rounded-xl bg-[var(--surface)] flex items-center justify-center", meta.color)}>
          <meta.icon className="h-4.5 w-4.5" />
        </div>
        {template.featured && (
          <Badge variant="purple" className="text-[10px] px-1.5 py-0 gap-1">
            <Sparkles className="h-2.5 w-2.5" /> Featured
          </Badge>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-sm leading-snug">{template.name}</h3>
        <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
          {template.description}
        </p>
      </div>

      {template.preview && (
        <div className="rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] p-3">
          <p className="text-xs text-[var(--text-secondary)] line-clamp-3 font-mono leading-relaxed">
            {template.preview}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={template.author_avatar} />
            <AvatarFallback className="text-[9px]">{template.author_name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-[var(--text-muted)]">{template.author_name}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
          <span className="flex items-center gap-0.5">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            {template.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-0.5">
            <Users className="h-3 w-3" />
            {template.usage_count.toLocaleString()}
          </span>
        </div>
      </div>

      <Button size="sm" className="w-full" variant="secondary">
        Use template
      </Button>
    </div>
  );
}

export function TemplatesClient({
  featured,
  all,
}: {
  featured: DbTemplate[];
  all: DbTemplate[];
}) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<ContentType | "all">("all");

  const filtered = all.filter((t) => {
    if (category !== "all" && t.category !== category) return false;
    if (query && !t.name.toLowerCase().includes(query.toLowerCase()) && !t.description.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Featured */}
      {featured.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--brand-blue)]" />
            Featured Templates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </section>
      )}

      {/* Browse all */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Templates</h2>
          <span className="text-xs text-[var(--text-muted)]">{filtered.length} templates</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates…"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full border transition-colors",
                  category === c.value
                    ? "bg-[var(--brand-blue)]/12 border-[var(--brand-blue)]/30 text-[var(--brand-blue)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface)]"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-12 text-center">
            <p className="text-sm text-[var(--text-muted)]">No templates match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
