import { NextResponse } from "next/server";
import { ensureUser, requireUserId } from "@/lib/api/auth";
import { seedDemoProjectsForUser } from "@/lib/seed/demo-projects";

export const runtime = "nodejs";

export async function POST() {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const result = await seedDemoProjectsForUser(userId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    const status = message === "Unauthenticated" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
