import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { DbAnalyticsDaily } from "@/lib/supabase/types";

export async function getAnalyticsSeries(days: 7 | 30 | 90): Promise<DbAnalyticsDaily[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  const supabase = createSupabaseAdminClient();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data, error } = await supabase
    .from("analytics_daily")
    .select("*")
    .eq("user_id", userId)
    .gte("date", since.toISOString().slice(0, 10))
    .order("date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
