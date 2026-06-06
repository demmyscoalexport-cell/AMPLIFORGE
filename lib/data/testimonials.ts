import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getTestimonials() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
