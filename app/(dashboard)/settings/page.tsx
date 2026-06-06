import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { SettingsClient } from "@/components/dashboard/settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [user, dbUser] = await Promise.all([
    currentUser(),
    createSupabaseAdminClient()
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle()
      .then((r) => r.data),
  ]);

  return (
    <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Manage your profile, preferences, and account
        </p>
      </header>
      <SettingsClient
        clerkUser={{
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
          email: user?.emailAddresses[0]?.emailAddress ?? "",
          imageUrl: user?.imageUrl ?? "",
          username: user?.username ?? "",
        }}
        dbUser={dbUser}
      />
    </div>
  );
}
