import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  return userId;
}

/** Ensures a Supabase users row exists (webhook fallback). */
export async function ensureUser(userId: string) {
  const supabase = createSupabaseAdminClient();
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) return;

  const user = await currentUser();
  const email =
    user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    "";

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || null;

  const { error } = await supabase.from("users").upsert(
    [
      {
        id: userId,
        email,
        full_name: fullName,
        username: user?.username ?? null,
        avatar_url: user?.imageUrl ?? null,
      },
    ],
    { onConflict: "id" }
  );

  if (error) throw error;
}
