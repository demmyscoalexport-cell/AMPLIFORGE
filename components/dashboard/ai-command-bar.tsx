"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Link as LinkIcon, ArrowRight, Upload, Settings2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProcessingStore } from "@/store/project-store";
import { toast } from "sonner";

const PLACEHOLDERS = [
  "Paste a YouTube link…",
  "Drop a podcast URL…",
  "Add a webinar replay…",
  "Try: youtube.com/watch?v=…",
];

export function AiCommandBar() {
  const [value, setValue] = React.useState("");
  const [phIndex, setPhIndex] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const begin = useProcessingStore((s) => s.begin);
  const isProcessing = useProcessingStore((s) => s.isProcessing);

  React.useEffect(() => {
    const id = setInterval(() => setPhIndex((i) => (i + 1) % PLACEHOLDERS.length), 2800);
    return () => clearInterval(id);
  }, []);

  const submit = async () => {
    const url = value.trim();
    if (!url) {
      toast.error("Add a URL first", { description: "Paste a YouTube, podcast, or webinar link to begin." });
      return;
    }
    if (isProcessing || submitting) {
      toast.warning("Already processing", { description: "Wait for the current job to finish." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceUrl: url }),
      });

      const data = (await res.json()) as {
        id?: string;
        title?: string;
        error?: string;
        credits?: number;
        required?: number;
      };

      if (!res.ok) {
        if (res.status === 402) {
          toast.error("Not enough credits", {
            description: `You have ${data.credits ?? 0} credits. This job needs ${data.required ?? 500}.`,
          });
        } else {
          toast.error("Could not start processing", { description: data.error ?? "Try again." });
        }
        return;
      }

      if (!data.id) {
        toast.error("Could not start processing", { description: "Missing project id." });
        return;
      }

      begin(data.id, url, data.title);
      setValue("");
      toast.success("Processing started", { description: "Deepgram is transcribing your source." });
    } catch {
      toast.error("Network error", { description: "Check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-hero opacity-20 blur-2xl rounded-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl border border-[var(--border)] bg-[var(--elevated)] p-6 shadow-card-lg overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-blue)]/60 to-transparent" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow-blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 12l10 10 10-10L12 2z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight">AmpliForge AI</h2>
              <p className="text-[11px] text-[var(--text-muted)]">Powered by Deepgram</p>
            </div>
          </div>
          <Button size="sm" variant="ghost">
            <Settings2 className="h-3.5 w-3.5" />
            Options
          </Button>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 focus-within:border-[var(--brand-blue)] focus-within:ring-4 focus-within:ring-[var(--brand-blue)]/10 transition-all">
            <LinkIcon className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
            <input
              type="url"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void submit()}
              placeholder={PLACEHOLDERS[phIndex]}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
              autoComplete="off"
              disabled={isProcessing || submitting}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Button onClick={() => void submit()} disabled={isProcessing || submitting} className="shadow-glow-blue">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Starting…
              </>
            ) : (
              <>
                Analyze Content
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          <span className="text-xs text-[var(--text-muted)]">or drop a file</span>
          <Button variant="secondary" size="md" disabled>
            <Upload className="h-3.5 w-3.5" />
            Upload
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Recent</span>
          {[
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://podcasts.example.com/ep-42.mp3",
          ].map((u) => (
            <button
              key={u}
              onClick={() => setValue(u)}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--brand-blue)] truncate max-w-[220px]"
            >
              {u.replace("https://", "")}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
