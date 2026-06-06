import { create } from "zustand";
import type { ProcessingStepState } from "@/lib/supabase/types";

export interface ProjectStatusPayload {
  id: string;
  title: string;
  status: "done" | "processing" | "draft" | "failed";
  steps: ProcessingStepState[];
  etaSeconds: number;
  error: string | null;
}

interface ProcessingState {
  isProcessing: boolean;
  projectId: string | null;
  currentUrl: string | null;
  currentTitle: string | null;
  steps: ProcessingStepState[];
  etaSeconds: number;
  error: string | null;
  begin: (projectId: string, url: string, title?: string) => void;
  syncStatus: (payload: ProjectStatusPayload) => void;
  reset: () => void;
}

const emptySteps = (): ProcessingStepState[] => [
  { id: "fetch", label: "Fetching Video", status: "queued", progress: 0 },
  { id: "transcribe", label: "Transcribing Audio", status: "queued", progress: 0 },
  { id: "insights", label: "Extracting Insights", status: "queued", progress: 0 },
  { id: "generate", label: "Generating Assets", status: "queued", progress: 0 },
  { id: "finalize", label: "Finalizing Output", status: "queued", progress: 0 },
];

export const useProcessingStore = create<ProcessingState>((set) => ({
  isProcessing: false,
  projectId: null,
  currentUrl: null,
  currentTitle: null,
  steps: emptySteps(),
  etaSeconds: 0,
  error: null,
  begin: (projectId, url, title) =>
    set({
      isProcessing: true,
      projectId,
      currentUrl: url,
      currentTitle: title ?? "Processing…",
      steps: emptySteps().map((s, i) =>
        i === 0 ? { ...s, status: "active" as const, progress: 5 } : s
      ),
      etaSeconds: 90,
      error: null,
    }),
  syncStatus: (payload) =>
    set({
      projectId: payload.id,
      currentTitle: payload.title,
      steps: payload.steps.length ? payload.steps : emptySteps(),
      etaSeconds: payload.etaSeconds,
      error: payload.error,
      isProcessing: payload.status === "processing",
    }),
  reset: () =>
    set({
      isProcessing: false,
      projectId: null,
      currentUrl: null,
      currentTitle: null,
      steps: emptySteps(),
      etaSeconds: 0,
      error: null,
    }),
}));
