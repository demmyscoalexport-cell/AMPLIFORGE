import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ProcessingStepId } from "./constants";
import {
  initialProcessingSteps,
  setStepActive,
  setStepDone,
  allStepsDone,
} from "./constants";
import type { ProcessingStepState } from "@/lib/supabase/types";

export async function initProcessingJob(projectId: string) {
  const supabase = createSupabaseAdminClient();
  const steps = initialProcessingSteps();
  steps[0] = { ...steps[0], status: "active", progress: 5 };

  const { error } = await supabase.from("processing_jobs").upsert(
    [
      {
        project_id: projectId,
        current_step: "fetch",
        steps,
        error_message: null,
        eta_seconds: 90,
      },
    ],
    { onConflict: "project_id" }
  );

  if (error) throw new Error(error.message);
}

export async function updateProcessingJob(
  projectId: string,
  stepId: ProcessingStepId,
  progress: number,
  etaSeconds?: number
) {
  const supabase = createSupabaseAdminClient();
  const { data: job } = await supabase
    .from("processing_jobs")
    .select("steps")
    .eq("project_id", projectId)
    .maybeSingle();

  const steps = setStepActive(
    (job?.steps as ProcessingStepState[] | undefined) ?? initialProcessingSteps(),
    stepId,
    progress
  );

  await supabase
    .from("processing_jobs")
    .update({
      current_step: stepId,
      steps,
      ...(etaSeconds !== undefined ? { eta_seconds: etaSeconds } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("project_id", projectId);
}

export async function completeProcessingStep(projectId: string, stepId: ProcessingStepId) {
  const supabase = createSupabaseAdminClient();
  const { data: job } = await supabase
    .from("processing_jobs")
    .select("steps")
    .eq("project_id", projectId)
    .maybeSingle();

  const steps = setStepDone(
    (job?.steps as ProcessingStepState[] | undefined) ?? initialProcessingSteps(),
    stepId
  );

  await supabase
    .from("processing_jobs")
    .update({
      steps,
      updated_at: new Date().toISOString(),
    })
    .eq("project_id", projectId);
}

export async function finishProcessingJob(projectId: string) {
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("processing_jobs")
    .update({
      current_step: "finalize",
      steps: allStepsDone(initialProcessingSteps()),
      eta_seconds: 0,
      error_message: null,
      updated_at: new Date().toISOString(),
    })
    .eq("project_id", projectId);
}

export async function failProcessingJob(projectId: string, message: string) {
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("processing_jobs")
    .update({
      error_message: message,
      eta_seconds: 0,
      updated_at: new Date().toISOString(),
    })
    .eq("project_id", projectId);

  await supabase.from("projects").update({ status: "failed" }).eq("id", projectId);
}

export async function deleteProcessingJob(projectId: string) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("processing_jobs").delete().eq("project_id", projectId);
}
