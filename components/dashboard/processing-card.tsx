"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, X, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProcessingStore } from "@/store/project-store";
import { cn } from "@/lib/utils";

export function ProcessingCard() {
  const { isProcessing, currentTitle, steps, etaSeconds, reset, projectId, error } =
    useProcessingStore();

  return (
    <AnimatePresence>
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.35 }}
          className="relative rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-6 shadow-card overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[2px] overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-[var(--brand-blue)] to-transparent"
            />
          </div>

          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[var(--brand-blue)]/15 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-[var(--brand-blue)]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Processing</p>
                <h3 className="text-base font-semibold">{currentTitle}</h3>
              </div>
            </div>
            <button
              onClick={reset}
              aria-label="Dismiss"
              className="h-7 w-7 inline-flex items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <p className="text-sm text-[var(--danger)] mb-4 rounded-lg border border-[var(--danger)]/20 bg-[var(--danger)]/5 px-3 py-2">
              {error}
            </p>
          )}

          <div className="space-y-3.5">
            {steps.map((step) => (
              <StepRow key={step.id} step={step} />
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)]">
              <Clock className="h-3 w-3" />
              <span className="font-mono">{etaSeconds}s remaining</span>
            </span>
            <div className="flex items-center gap-3">
              {projectId && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/projects/${projectId}`}>
                    <ExternalLink className="h-3.5 w-3.5" />
                    View
                  </Link>
                </Button>
              )}
              <span className="inline-flex items-center gap-1.5 text-[var(--brand-blue)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-blue)] animate-pulse" />
                Deepgram + AmpliForge AI
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StepRow({
  step,
}: {
  step: { id: string; label: string; status: "queued" | "active" | "done"; progress: number };
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-all",
          step.status === "done" && "bg-[var(--success)] text-white scale-100",
          step.status === "active" && "bg-[var(--brand-blue)] text-white animate-pulse",
          step.status === "queued" && "border border-dashed border-[var(--border)] text-[var(--text-muted)]"
        )}
      >
        {step.status === "done" ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </motion.div>
        ) : step.status === "active" ? (
          <span className="text-[10px] font-bold">{step.progress}</span>
        ) : (
          <span className="text-[10px]">—</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1.5">
          <span
            className={cn(
              "text-sm",
              step.status === "queued" ? "text-[var(--text-muted)]" : "text-[var(--text-primary)] font-medium"
            )}
          >
            {step.label}
          </span>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {step.status === "done" ? "Done" : step.status === "active" ? `${step.progress}%` : "Queued"}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--surface)] overflow-hidden">
          <motion.div
            animate={{ width: `${step.progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              step.status === "done" ? "bg-[var(--success)]" : "bg-gradient-hero"
            )}
          />
        </div>
      </div>
    </div>
  );
}
