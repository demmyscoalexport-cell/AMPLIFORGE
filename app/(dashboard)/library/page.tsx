import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getLibraryItems } from "@/lib/data/content";
import { LibraryClient } from "@/components/dashboard/library-client";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const items = await getLibraryItems().catch(() => []);

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Content Library</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          All generated content across your projects — {items.length} items
        </p>
      </header>
      <LibraryClient items={items} />
    </div>
  );
}
