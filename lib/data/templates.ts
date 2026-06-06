import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getPublicTemplates() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("is_public", true)
    .order("usage_count", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedTemplates() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("featured", true)
    .order("usage_count", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
