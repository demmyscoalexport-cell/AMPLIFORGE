import "server-only";
import type { SourceType } from "@/lib/supabase/types";

const YOUTUBE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)/i;
const PODCAST =
  /(?:spotify\.com\/episode|podcasts\.apple\.com|anchor\.fm|podcast|\.mp3|\.m4a|\.wav|megaphone\.fm|buzzsprout\.com|transistor\.fm)/i;

export function detectSourceType(url: string): SourceType {
  if (YOUTUBE.test(url)) return "youtube";
  if (PODCAST.test(url)) return "podcast";
  return "webinar";
}

export function isDirectMediaUrl(url: string): boolean {
  return /\.(mp3|m4a|wav|ogg|webm|mp4)(\?|$)/i.test(url);
}

export function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    if (parsed.searchParams.has("v")) {
      return parsed.searchParams.get("v");
    }
    const parts = parsed.pathname.split("/");
    const shortsIdx = parts.indexOf("shorts");
    if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
    const embedIdx = parts.indexOf("embed");
    if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
  } catch {
    return null;
  }
  return null;
}
