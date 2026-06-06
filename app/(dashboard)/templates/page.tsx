import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getPublicTemplates, getFeaturedTemplates } from "@/lib/data/templates";
import { TemplatesClient } from "@/components/dashboard/templates-client";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [featured, all] = await Promise.all([
    getFeaturedTemplates().catch(() => []),
    getPublicTemplates().catch(() => []),
  ]);

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Community-built prompts to shape how your content is generated
        </p>
      </header>
      <TemplatesClient featured={featured} all={all} />
    </div>
  );
}
