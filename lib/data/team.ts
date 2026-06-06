import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getTeam() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
