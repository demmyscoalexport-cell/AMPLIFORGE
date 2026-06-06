import "server-only";
import type { ProcessingStepState } from "@/lib/supabase/types";

export const PROCESSING_STEPS = [
  { id: "fetch", label: "Fetching Video" },
  { id: "transcribe", label: "Transcribing Audio" },
  { id: "insights", label: "Extracting Insights" },
  { id: "generate", label: "Generating Assets" },
  { id: "finalize", label: "Finalizing Output" },
] as const;

export type ProcessingStepId = (typeof PROCESSING_STEPS)[number]["id"];

export function initialProcessingSteps(): ProcessingStepState[] {
  return PROCESSING_STEPS.map((s) => ({
    id: s.id,
    label: s.label,
    status: "queued" as const,
    progress: 0,
  }));
}

export function setStepActive(
  steps: ProcessingStepState[],
  stepId: ProcessingStepId,
  progress = 10
): ProcessingStepState[] {
  const idx = steps.findIndex((s) => s.id === stepId);
  return steps.map((s, i) => {
    if (i < idx) return { ...s, status: "done" as const, progress: 100 };
    if (s.id === stepId) return { ...s, status: "active" as const, progress };
    return { ...s, status: "queued" as const, progress: 0 };
  });
}

export function setStepDone(steps: ProcessingStepState[], stepId: ProcessingStepId): ProcessingStepState[] {
  return steps.map((s) =>
    s.id === stepId ? { ...s, status: "done" as const, progress: 100 } : s
  );
}

export function allStepsDone(steps: ProcessingStepState[]): ProcessingStepState[] {
  return steps.map((s) => ({ ...s, status: "done" as const, progress: 100 }));
}

export const CREDITS_PER_PROJECT = 500;

export const DEFAULT_OUTPUT_TYPES = [
  "linkedin",
  "email",
  "thread",
  "hook",
  "summary",
  "carousel",
  "caption",
] as const;
