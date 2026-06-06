import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateContent } from "@/lib/pipeline/generate-content";
import type { ContentType } from "@/lib/supabase/types";

interface Params {
  id: string;
  contentId: string;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  const userId = await requireUserId();
  const { id: projectId, contentId } = await params;

  const supabase = createSupabaseAdminClient();

  // Verify project ownership
  const { data: project, error: projErr } = await supabase
    .from("projects")
    .select("id, title, channel, transcript")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (projErr || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Fetch existing content item to know which type to regenerate
  const { data: item, error: itemErr } = await supabase
    .from("content_items")
    .select("id, type")
    .eq("id", contentId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (itemErr || !item) {
    return NextResponse.json({ error: "Content item not found" }, { status: 404 });
  }

  if (!project.transcript) {
    return NextResponse.json({ error: "No transcript available for regeneration" }, { status: 422 });
  }

  // Re-run the AI pipeline
  const allContent = await generateContent(
    project.title ?? "Untitled",
    project.channel ?? "Unknown",
    project.transcript
  );

  const regenerated = allContent.find((c) => c.type === (item.type as ContentType));

  if (!regenerated) {
    return NextResponse.json({ error: "Could not regenerate this content type" }, { status: 500 });
  }

  // Update in DB
  const { data: updated, error: updateErr } = await supabase
    .from("content_items")
    .update({
      title: regenerated.title,
      body: regenerated.body,
      word_count: regenerated.wordCount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", contentId)
    .select("id, type, title, body, word_count, updated_at")
    .maybeSingle();

  if (updateErr || !updated) {
    return NextResponse.json({ error: "Failed to save regenerated content" }, { status: 500 });
  }

  return NextResponse.json({ item: updated });
}
