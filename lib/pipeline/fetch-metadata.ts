import "server-only";
import type { SourceType } from "@/lib/supabase/types";
import { extractYouTubeId } from "./detect-source";

export interface SourceMetadata {
  title: string;
  channel: string;
  thumbnail: string;
  duration: string | null;
}

const DEFAULT: SourceMetadata = {
  title: "Untitled Project",
  channel: "Unknown",
  thumbnail: "linear-gradient(135deg, #0D66D0, #9256D9)",
  duration: null,
};

export async function fetchSourceMetadata(
  sourceUrl: string,
  source: SourceType
): Promise<SourceMetadata> {
  if (source === "youtube") {
    return fetchYouTubeMetadata(sourceUrl);
  }

  try {
    const parsed = new URL(sourceUrl);
    return {
      title: parsed.hostname.replace(/^www\./, ""),
      channel: parsed.hostname.replace(/^www\./, ""),
      thumbnail: DEFAULT.thumbnail,
      duration: null,
    };
  } catch {
    return DEFAULT;
  }
}

async function fetchYouTubeMetadata(sourceUrl: string): Promise<SourceMetadata> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(sourceUrl)}&format=json`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return fallbackYouTubeTitle(sourceUrl);

    const data = (await res.json()) as {
      title?: string;
      author_name?: string;
      thumbnail_url?: string;
    };

    const videoId = extractYouTubeId(sourceUrl);
    const thumb =
      data.thumbnail_url ??
      (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : DEFAULT.thumbnail);

    return {
      title: data.title ?? DEFAULT.title,
      channel: data.author_name ?? "YouTube",
      thumbnail: thumb.startsWith("http") ? thumb : DEFAULT.thumbnail,
      duration: null,
    };
  } catch {
    return fallbackYouTubeTitle(sourceUrl);
  }
}

function fallbackYouTubeTitle(sourceUrl: string): SourceMetadata {
  const videoId = extractYouTubeId(sourceUrl);
  return {
    title: videoId ? `YouTube Video ${videoId}` : DEFAULT.title,
    channel: "YouTube",
    thumbnail: videoId
      ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      : DEFAULT.thumbnail,
    duration: null,
  };
}
