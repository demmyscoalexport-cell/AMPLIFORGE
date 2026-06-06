import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

interface Params {
  id: string;
}

// GET /api/v1/projects/:id/export
// Returns a JSON bundle of all content items for client-side download.
// Query param `type` filters to a single content type.
// Query param `format` = "txt" returns a plain-text response (single type only).
export async function GET(req: Request, { params }: { params: Promise<Params> }) {
  const userId = await requireUserId();
  const { id: projectId } = await params;
  const { searchParams } = new URL(req.url);
  const typeFilter = searchParams.get("type");
  const format = searchParams.get("format"); // "txt" | "json" (default)

  const supabase = createSupabaseAdminClient();

  const { data: project, error: projErr } = await supabase
    .from("projects")
    .select("id, title, channel")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (projErr || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  let query = supabase
    .from("content_items")
    .select("id, type, title, body, word_count, created_at")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (typeFilter) {
    query = query.eq("type", typeFilter);
  }

  const { data: items, error: itemsErr } = await query;

  if (itemsErr) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }

  if (!items?.length) {
    return NextResponse.json({ error: "No content found" }, { status: 404 });
  }

  // Plain-text export (single item)
  if (format === "txt" && items.length === 1) {
    const item = items[0];
    const filename = `${project.title ?? "ampliforge"} — ${item.type}.txt`
      .replace(/[^\w\s—.]/g, "")
      .trim();
    return new Response(
      `${item.title}\n${"=".repeat(item.title.length)}\n\n${item.body}`,
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      }
    );
  }

  // JSON bundle
  return NextResponse.json({
    project: { id: project.id, title: project.title, channel: project.channel },
    items,
    exportedAt: new Date().toISOString(),
  });
}
