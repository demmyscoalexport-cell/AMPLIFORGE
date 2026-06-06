import { NextResponse } from "next/server";
import { processProject } from "@/lib/pipeline/process-project";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const secret = req.headers.get("x-internal-secret");
  if (!secret || secret !== process.env.INTERNAL_JOB_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { projectId?: string; userId?: string };
  if (!body.projectId || !body.userId) {
    return NextResponse.json({ error: "projectId and userId are required" }, { status: 400 });
  }

  await processProject({ projectId: body.projectId, userId: body.userId });
  return NextResponse.json({ ok: true });
}
