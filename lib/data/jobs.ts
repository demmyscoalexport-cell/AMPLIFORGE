import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getOpenJobs() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_open", true)
    .order("department", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
