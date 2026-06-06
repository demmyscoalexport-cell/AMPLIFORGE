"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Copy, RotateCw, Sparkles, Download, FileText, Mail, MessageCircle, Hash, Quote, ChevronDown,
} from "lucide-react";
import { LinkedinIcon as Linkedin } from "@/components/shared/brand-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DbContentItem, ContentType } from "@/lib/supabase/types";

function downloadTxt(projectId: string, itemId: string, type: string) {
  const url = `/api/v1/projects/${projectId}/export?type=${type}&format=txt`;
  const a = document.createElement("a");
  a.href = url;
  a.download = "";
  a.click();
}

async function regenerateItem(
  projectId: string,
  contentId: string
): Promise<DbContentItem | null> {
  const res = await fetch(
    `/api/v1/projects/${projectId}/content/${contentId}/regenerate`,
    { method: "POST" }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { item?: DbContentItem };
  return data.item ?? null;
}

const TABS: { value: ContentType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "email", label: "Emails", icon: Mail },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "thread", label: "Threads", icon: MessageCircle },
  { value: "caption", label: "Captions", icon: Hash },
  { value: "hook", label: "Hooks", icon: Quote },
  { value: "summary", label: "Summary", icon: FileText },
];

export function OutputTabs({
  content: initialContent,
  projectId,
}: {
  content: DbContentItem[];
  projectId: string;
}) {
  const [items, setItems] = React.useState<DbContentItem[]>(initialContent);
  const [regenLoading, setRegenLoading] = React.useState<string | null>(null);
  const firstAvailable = TABS.find((t) => items.some((c) => c.type === t.value))?.value ?? "email";

  const onCopy = (body: string) => {
    if (typeof navigator !== "undefined") navigator.clipboard?.writeText(body);
    toast.success("Copied to clipboard", { description: "Ready to paste into your editor." });
  };

  const onRegenerate = async (itemId: string) => {
    setRegenLoading(itemId);
    const toastId = toast.loading("Regenerating…", {
      description: "AmpliForge is rewriting with a fresh angle.",
    });
    const updated = await regenerateItem(projectId, itemId);
    setRegenLoading(null);
    if (updated) {
      setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
      toast.success("Done!", { id: toastId, description: "Content regenerated successfully." });
    } else {
      toast.error("Regeneration failed", {
        id: toastId,
        description: "Could not regenerate. Try again in a moment.",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-12 text-center">
        <Sparkles className="h-8 w-8 mx-auto text-[var(--brand-purple)] mb-3" />
        <h3 className="text-base font-semibold">No outputs yet</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Outputs will appear here once processing finishes.
        </p>
      </div>
    );
  }

  return (
    <Tabs defaultValue={firstAvailable} className="flex flex-col h-full">
      <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 flex-wrap">
        {TABS.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {TABS.map((tab) => {
        const item = items.find((c) => c.type === tab.value);
        const isRegenerating = item ? regenLoading === item.id : false;
        return (
          <TabsContent key={tab.value} value={tab.value} className="flex-1">
            {!item ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-8 text-center text-sm text-[var(--text-muted)]">
                No {tab.label.toLowerCase()} generated for this project yet.
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[var(--border)] flex-wrap">
                  <div className="flex items-center gap-2 text-sm">
                    <tab.icon className="h-4 w-4 text-[var(--text-muted)]" />
                    <span className="font-medium">{tab.label}</span>
                    <Badge variant="outline">{item.word_count} words</Badge>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" variant="secondary" onClick={() => onCopy(item.body)}>
                      <Copy className="h-3 w-3" /> Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isRegenerating}
                      onClick={() => onRegenerate(item.id)}
                    >
                      <RotateCw className={`h-3 w-3 ${isRegenerating ? "animate-spin" : ""}`} />
                      {isRegenerating ? "Regenerating…" : "Regenerate"}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="secondary" disabled={isRegenerating}>
                          <Sparkles className="h-3 w-3" /> AI Improve <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onRegenerate(item.id)}>Make shorter</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onRegenerate(item.id)}>Make more engaging</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onRegenerate(item.id)}>Add emojis</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onRegenerate(item.id)}>More professional</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm">
                          <Download className="h-3 w-3" /> Export <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onCopy(item.body)}>Copy to clipboard</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => downloadTxt(projectId, item.id, item.type)}>Download .txt</DropdownMenuItem>
                        <DropdownMenuItem>Download .docx</DropdownMenuItem>
                        <DropdownMenuItem>Send to Notion</DropdownMenuItem>
                        <DropdownMenuItem>Send to Buffer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="p-5">
                  {tab.value === "linkedin" ? (
                    <LinkedInPreview body={item.body} />
                  ) : tab.value === "email" ? (
                    <EmailPreview body={item.body} />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--text-primary)]">
                      {item.body}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

function LinkedInPreview({ body }: { body: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4 max-w-[560px]">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-10 w-10 rounded-full bg-gradient-hero text-white text-xs font-bold flex items-center justify-center">
          AR
        </div>
        <div>
          <p className="text-sm font-semibold">You</p>
          <p className="text-xs text-[var(--text-muted)]">Founder · 1st</p>
        </div>
      </div>
      <p className="text-sm whitespace-pre-wrap leading-relaxed text-[var(--text-primary)]">{body}</p>
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
        <span>👍 234 reactions</span>
        <span>· 41 comments</span>
        <span>· 12 reposts</span>
      </div>
    </div>
  );
}

function EmailPreview({ body }: { body: string }) {
  const [subjectLine, ...rest] = body.split("\n");
  const isSubject = subjectLine.toLowerCase().startsWith("subject:");
  const subject = isSubject ? subjectLine.replace(/^subject:\s*/i, "") : "Your AmpliForge digest";
  const bodyText = isSubject ? rest.join("\n").trim() : body;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] overflow-hidden max-w-[560px]">
      <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-muted)] flex justify-between">
        <span>From: you@studio.com</span>
        <span>To: subscriber@inbox.com</span>
      </div>
      <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{subject}</p>
      </div>
      <div className="px-4 py-4">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--text-primary)]">
          {bodyText}
        </pre>
      </div>
    </div>
  );
}
