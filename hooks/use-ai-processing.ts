"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProcessingStore, type ProjectStatusPayload } from "@/store/project-store";

export function useAiProcessing() {
  const router = useRouter();
  const projectId = useProcessingStore((s) => s.projectId);
  const isProcessing = useProcessingStore((s) => s.isProcessing);
  const syncStatus = useProcessingStore((s) => s.syncStatus);
  const reset = useProcessingStore((s) => s.reset);

  React.useEffect(() => {
    if (!projectId || !isProcessing) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch(`/api/v1/projects/${projectId}/status`);
        if (!res.ok) return;
        const data = (await res.json()) as ProjectStatusPayload;
        if (cancelled) return;

        syncStatus(data);

        if (data.status === "done") {
          toast.success("Content ready", {
            description: "Your repurposed assets are ready to review.",
            action: {
              label: "Open project",
              onClick: () => router.push(`/projects/${projectId}`),
            },
          });
          router.refresh();
        }

        if (data.status === "failed") {
          toast.error("Processing failed", {
            description: data.error ?? "Something went wrong. Try again.",
          });
          reset();
        }
      } catch {
        // keep polling
      }
    };

    void poll();
    const id = setInterval(poll, 2000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [projectId, isProcessing, syncStatus, reset, router]);
}
