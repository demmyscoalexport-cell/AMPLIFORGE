import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { DbProjectTranscript } from "@/lib/supabase/types";

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

    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: transcript, error } = await supabase
      .from("project_transcripts")
      .select("segments, full_text")
      .eq("project_id", id)
      .maybeSingle();

    if (error) throw error;
    if (!transcript) {
      return NextResponse.json({ segments: [], fullText: "" });
    }

    const row = transcript as Pick<DbProjectTranscript, "segments" | "full_text">;

    return NextResponse.json({
      segments: row.segments,
      fullText: row.full_text,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    const status = message === "Unauthenticated" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
