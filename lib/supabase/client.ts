"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Browser-side Supabase client. Uses the anon key; all queries are
 * subject to Row Level Security. Use this only for PUBLIC tables
 * (testimonials, blog, etc.) — user-owned data should be fetched
 * server-side via the admin client + Clerk auth check.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
