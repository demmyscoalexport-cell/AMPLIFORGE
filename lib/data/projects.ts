import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { DbProject, DbContentItem } from "@/lib/supabase/types";

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  return userId;
}

export async function getProjects(limit?: number) {
  const userId = await requireUserId();
  const supabase = createSupabaseAdminClient();
  let q = supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getProjectById(id: string): Promise<{
  project: DbProject;
  content: DbContentItem[];
} | null> {
  const userId = await requireUserId();
  const supabase = createSupabaseAdminClient();

  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (projectErr) throw projectErr;
  if (!project) return null;

  const { data: content, error: contentErr } = await supabase
    .from("content_items")
    .select("*")
    .eq("user_id", userId)
    .eq("project_id", id)
    .order("created_at", { ascending: true });
  if (contentErr) throw contentErr;

  return { project, content: content ?? [] };
}

export interface DashboardStats {
  videosProcessed: number;
  contentGenerated: number;
  timeSavedHours: number;
  engagementGrowth: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const userId = await requireUserId();
  const supabase = createSupabaseAdminClient();

  const [{ count: projectCount }, { count: contentCount }] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("content_items").select("*", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  // Rough heuristic: ~2 hours saved per video, +5% engagement per 10 content pieces.
  const videos = projectCount ?? 0;
  const items = contentCount ?? 0;
  return {
    videosProcessed: videos,
    contentGenerated: items,
    timeSavedHours: videos * 2,
    engagementGrowth: Math.min(999, items * 5),
  };
}
