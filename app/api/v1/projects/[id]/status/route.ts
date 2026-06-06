import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { DbProject, DbProcessingJob } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await context.params;
    const supabase = createSupabaseAdminClient();

    const { data: project, error: projectErr } = await supabase
      .from("projects")
      .select("id, title, status")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (projectErr) throw projectErr;
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const row = project as Pick<DbProject, "id" | "title" | "status">;

    const { data: job } = await supabase
      .from("processing_jobs")
      .select("current_step, steps, eta_seconds, error_message")
      .eq("project_id", id)
      .maybeSingle();

    const jobRow = job as Pick<
      DbProcessingJob,
      "current_step" | "steps" | "eta_seconds" | "error_message"
    > | null;

    return NextResponse.json({
      id: row.id,
      title: row.title,
      status: row.status,
      currentStep: jobRow?.current_step ?? null,
      steps: jobRow?.steps ?? [],
      etaSeconds: jobRow?.eta_seconds ?? 0,
      error: jobRow?.error_message ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    const status = message === "Unauthenticated" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
