import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Server-side Supabase client using the anon key. Subject to RLS.
 * Good for SSR rendering of PUBLIC tables (testimonials, blog, jobs,
 * team, changelog, public templates). For user-owned tables, use
 * the admin client + a Clerk-derived userId WHERE clause instead.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component context can't set cookies — safe to ignore.
          }
        },
      },
    }
  );
}
