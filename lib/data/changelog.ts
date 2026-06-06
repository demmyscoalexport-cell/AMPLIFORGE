import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getChangelog() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("changelog_entries")
    .select("*")
    .order("release_date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
