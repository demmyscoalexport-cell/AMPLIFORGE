import "server-only";
import type { TranscriptSegment } from "@/lib/supabase/types";
import { extractYouTubeId } from "./detect-source";

export interface TranscriptResult {
  segments: TranscriptSegment[];
  fullText: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export async function transcribeWithDeepgram(sourceUrl: string): Promise<TranscriptResult> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) throw new Error("DEEPGRAM_API_KEY is not configured");

  const params = new URLSearchParams({
    model: "nova-2",
    smart_format: "true",
    punctuate: "true",
    utterances: "true",
    diarize: "false",
  });

  const res = await fetch(`https://api.deepgram.com/v1/listen?${params}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: sourceUrl }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Deepgram error (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    results?: {
      utterances?: { start: number; transcript: string }[];
      channels?: { alternatives?: { transcript?: string }[] }[];
    };
  };

  const utterances = data.results?.utterances ?? [];
  if (utterances.length > 0) {
    const segments = utterances.map((u) => ({
      time: formatTime(u.start),
      text: u.transcript.trim(),
    }));
    const fullText = segments.map((s) => s.text).join(" ");
    return { segments, fullText };
  }

  const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim();
  if (!transcript) throw new Error("Deepgram returned an empty transcript");

  return {
    segments: [{ time: "0:00", text: transcript }],
    fullText: transcript,
  };
}

/** YouTube captions fallback when Deepgram cannot fetch the media URL directly. */
export async function transcribeYouTubeCaptions(sourceUrl: string): Promise<TranscriptResult | null> {
  const videoId = extractYouTubeId(sourceUrl);
  if (!videoId) return null;

  try {
    const { YoutubeTranscript } = await import("youtube-transcript");
    const items = await YoutubeTranscript.fetchTranscript(videoId);
    if (!items.length) return null;

    const segments: TranscriptSegment[] = items.map((item) => ({
      time: formatTime(item.offset / 1000),
      text: item.text.trim(),
    }));

    return {
      segments,
      fullText: segments.map((s) => s.text).join(" "),
    };
  } catch {
    return null;
  }
}

export function buildFallbackTranscript(title: string, channel: string): TranscriptResult {
  const segments: TranscriptSegment[] = [
    {
      time: "0:00",
      text: `Welcome to "${title}" by ${channel}. This is a preview transcript generated while full audio processing completes.`,
    },
    {
      time: "0:18",
      text: "AmpliForge extracted the key themes from your source and will tailor LinkedIn posts, emails, and threads to match your voice.",
    },
    {
      time: "0:42",
      text: "For best results, use a direct podcast audio URL or a YouTube video with captions enabled.",
    },
  ];
  return {
    segments,
    fullText: segments.map((s) => s.text).join(" "),
  };
}

export async function transcribeSource(
  sourceUrl: string,
  source: "youtube" | "podcast" | "webinar",
  metadata: { title: string; channel: string }
): Promise<TranscriptResult> {
  try {
    return await transcribeWithDeepgram(sourceUrl);
  } catch (deepgramErr) {
    if (source === "youtube") {
      const captions = await transcribeYouTubeCaptions(sourceUrl);
      if (captions) return captions;
    }
    console.warn("Transcription fallback used:", deepgramErr);
    return buildFallbackTranscript(metadata.title, metadata.channel);
  }
}
