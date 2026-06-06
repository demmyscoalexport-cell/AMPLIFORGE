import { NextResponse } from "next/server";
import { ensureUser, requireUserId } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { CREDITS_PER_PROJECT } from "@/lib/pipeline/constants";
import { detectSourceType } from "@/lib/pipeline/detect-source";
import { initProcessingJob } from "@/lib/pipeline/job-state";
import { enqueueProjectProcessing } from "@/lib/pipeline/process-project";
import type { DbProject, DbUser } from "@/lib/supabase/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const body = (await req.json()) as { sourceUrl?: string };
    const sourceUrl = body.sourceUrl?.trim();

    if (!sourceUrl) {
      return NextResponse.json({ error: "sourceUrl is required" }, { status: 400 });
    }

    try {
      new URL(sourceUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single();

    if (userErr || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const account = user as Pick<DbUser, "credits">;

    if (account.credits < CREDITS_PER_PROJECT) {
      return NextResponse.json(
        { error: "Insufficient credits", credits: account.credits, required: CREDITS_PER_PROJECT },
        { status: 402 }
      );
    }

    const source = detectSourceType(sourceUrl);

    const { data: project, error: projectErr } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        title: "Processing…",
        source,
        source_url: sourceUrl,
        thumbnail: "linear-gradient(135deg, #0D66D0, #9256D9)",
        status: "processing",
        tags: [],
      })
      .select("id, title, status, source, source_url, created_at")
      .single();

    if (projectErr || !project) {
      const hint = projectErr?.message?.includes("schema cache")
        ? "Database not set up. Run supabase/setup-all.sql in the Supabase SQL Editor."
        : undefined;
      return NextResponse.json(
        {
          error: "Failed to create project",
          details: projectErr?.message ?? "Unknown database error",
          hint,
        },
        { status: 500 }
      );
    }

    await supabase
      .from("users")
      .update({ credits: account.credits - CREDITS_PER_PROJECT })
      .eq("id", userId);

    try {
      await initProcessingJob(project.id);
    } catch (jobErr) {
      await supabase.from("projects").delete().eq("id", project.id);
      await supabase
        .from("users")
        .update({ credits: account.credits })
        .eq("id", userId);

      const message = jobErr instanceof Error ? jobErr.message : "Failed to start processing job";
      const hint = message.includes("schema cache")
        ? "Run supabase/setup-all.sql in the Supabase SQL Editor."
        : undefined;
      return NextResponse.json({ error: message, hint }, { status: 500 });
    }
    enqueueProjectProcessing(project.id, userId);

    const created = project as Pick<
      DbProject,
      "id" | "title" | "status" | "source" | "source_url" | "created_at"
    >;

    return NextResponse.json(
      {
        id: created.id,
        title: created.title,
        status: created.status,
        source: created.source,
        sourceUrl: created.source_url,
        createdAt: created.created_at,
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    const status = message === "Unauthenticated" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
