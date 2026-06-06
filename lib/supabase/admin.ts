import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * SERVICE-ROLE Supabase client. BYPASSES RLS.
 * Use ONLY in Server Components, Route Handlers, and webhooks where
 * we've already verified the caller's identity via Clerk.
 */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
