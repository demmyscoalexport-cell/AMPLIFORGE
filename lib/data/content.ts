import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ContentType } from "@/lib/supabase/types";

export async function getLibraryItems(filters?: { type?: ContentType }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  const supabase = createSupabaseAdminClient();
  let q = supabase
    .from("content_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (filters?.type) q = q.eq("type", filters.type);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}
