import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { detectSourceType } from "./detect-source";
import { fetchSourceMetadata } from "./fetch-metadata";
import { transcribeSource } from "./transcribe";
import { generateContent } from "./generate-content";
import {
  completeProcessingStep,
  failProcessingJob,
  finishProcessingJob,
  updateProcessingJob,
} from "./job-state";

interface ProcessProjectInput {
  projectId: string;
  userId: string;
}

export async function processProject({ projectId, userId }: ProcessProjectInput) {
  const supabase = createSupabaseAdminClient();

  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (projectErr || !project) {
    throw new Error("Project not found");
  }

  const sourceUrl = project.source_url;
  if (!sourceUrl) {
    await failProcessingJob(projectId, "Missing source URL");
    return;
  }

  try {
    await updateProcessingJob(projectId, "fetch", 20, 75);
    const metadata = await fetchSourceMetadata(sourceUrl, project.source);

    await supabase
      .from("projects")
      .update({
        title: metadata.title,
        channel: metadata.channel,
        thumbnail: metadata.thumbnail,
        duration: metadata.duration,
        status: "processing",
      })
      .eq("id", projectId);

    await completeProcessingStep(projectId, "fetch");

    await updateProcessingJob(projectId, "transcribe", 30, 60);
    const transcript = await transcribeSource(sourceUrl, project.source, {
      title: metadata.title,
      channel: metadata.channel,
    });

    await supabase.from("project_transcripts").upsert(
      [
        {
          project_id: projectId,
          segments: transcript.segments,
          full_text: transcript.fullText,
        },
      ],
      { onConflict: "project_id" }
    );

    await completeProcessingStep(projectId, "transcribe");

    await updateProcessingJob(projectId, "insights", 55, 40);
    await completeProcessingStep(projectId, "insights");

    await updateProcessingJob(projectId, "generate", 70, 25);
    const outputs = await generateContent(
      metadata.title,
      metadata.channel,
      transcript.fullText
    );

    await supabase.from("content_items").delete().eq("project_id", projectId);

    if (outputs.length) {
      await supabase.from("content_items").insert(
        outputs.map((item) => ({
          user_id: userId,
          project_id: projectId,
          type: item.type,
          title: item.title,
          body: item.body,
          word_count: item.wordCount,
        }))
      );
    }

    await completeProcessingStep(projectId, "generate");

    await updateProcessingJob(projectId, "finalize", 90, 5);
    await supabase.from("projects").update({ status: "done" }).eq("id", projectId);

    const today = new Date().toISOString().slice(0, 10);
    const { data: existingAnalytics } = await supabase
      .from("analytics_daily")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    const linkedin = outputs.filter((o) => o.type === "linkedin").length;
    const email = outputs.filter((o) => o.type === "email").length;
    const threads = outputs.filter((o) => o.type === "thread").length;

    await supabase.from("analytics_daily").upsert(
      [
        {
          user_id: userId,
          date: today,
          total: (existingAnalytics?.total ?? 0) + outputs.length,
          linkedin: (existingAnalytics?.linkedin ?? 0) + linkedin,
          email: (existingAnalytics?.email ?? 0) + email,
          threads: (existingAnalytics?.threads ?? 0) + threads,
        },
      ],
      { onConflict: "user_id,date" }
    );

    await finishProcessingJob(projectId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Processing failed";
    console.error(`processProject(${projectId}) failed:`, err);
    await failProcessingJob(projectId, message);
  }
}

export function enqueueProjectProcessing(projectId: string, userId: string) {
  const secret = process.env.INTERNAL_JOB_SECRET;
  const isDev = process.env.NODE_ENV === "development";
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  if (secret && !isDev) {
    fetch(`${baseUrl}/api/internal/process-project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": secret,
      },
      body: JSON.stringify({ projectId, userId }),
    }).catch((err) => console.error("Failed to enqueue processing:", err));
    return;
  }

  void processProject({ projectId, userId }).catch((err) =>
    console.error("Inline processing failed:", err)
  );
}
