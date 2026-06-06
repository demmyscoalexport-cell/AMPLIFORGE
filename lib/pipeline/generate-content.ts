import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { ContentType } from "@/lib/supabase/types";
import { DEFAULT_OUTPUT_TYPES } from "./constants";

export interface GeneratedContent {
  type: ContentType;
  title: string;
  body: string;
  wordCount: number;
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function excerpt(text: string, maxWords = 40): string {
  const words = text.split(/\s+/).filter(Boolean);
  return words.slice(0, maxWords).join(" ") + (words.length > maxWords ? "…" : "");
}

function templateOutputs(title: string, channel: string, transcript: string): GeneratedContent[] {
  const hook = excerpt(transcript, 25);
  const insight = excerpt(transcript, 35);

  const outputs: { type: ContentType; title: string; body: string }[] = [
    {
      type: "hook",
      title: "Scroll-stopping hook",
      body: `I rewatched "${title}" so you don't have to.\n\nHere's the one idea ${channel} keeps coming back to:\n\n${hook}`,
    },
    {
      type: "linkedin",
      title: "LinkedIn authority post",
      body: `After studying "${title}", three patterns stood out:\n\n1. ${insight}\n2. Most creators skip the setup — that's where trust is built.\n3. Repurposing isn't copying; it's translating the same insight for a new audience.\n\nWhat's one video you'd turn into a week of content?`,
    },
    {
      type: "thread",
      title: "Twitter/X thread",
      body: `🧵 ${title} — distilled into 5 posts\n\n1/ The core idea in one line:\n${hook}\n\n2/ Why it matters now\n\n3/ The mistake most people make\n\n4/ A practical next step you can take today\n\n5/ If this helped, repost the first tweet for others.`,
    },
    {
      type: "email",
      title: "Newsletter snippet",
      body: `Subject: The idea from "${title}" I'm still thinking about\n\nHey {{firstName}},\n\nQuick win from ${channel} this week:\n\n${insight}\n\nTry this: pick one long-form piece you published and run it through AmpliForge — you'll walk away with posts, emails, and hooks in minutes.\n\n— Your name`,
    },
    {
      type: "summary",
      title: "Episode summary",
      body: `# ${title}\n\n**Source:** ${channel}\n\n## Key takeaway\n${hook}\n\n## Highlights\n- Core narrative and supporting points extracted from the transcript\n- Best suited for LinkedIn, email, and short-form social\n\n## Suggested CTAs\n- Save the hook for your next post\n- Turn the summary into a carousel or newsletter`,
    },
    {
      type: "carousel",
      title: "Instagram carousel",
      body: `Slide 1 — Cover\n🎯 ${title}\n\nSlide 2 — The problem\nMost creators waste hours repurposing content manually.\n\nSlide 3 — The insight\n${insight}\n\nSlide 4 — The framework\n1. Record once\n2. Transcribe automatically\n3. Repurpose into 7 formats\n\nSlide 5 — The result\nA full week of content from a single video.\n\nSlide 6 — CTA\nSave this post. Try it on your next video.\nFollow for more creator frameworks.`,
    },
    {
      type: "caption",
      title: "Social caption",
      body: `${hook}\n\n${channel} breaks it down so clearly 👇\n\nSave this if you create content. The idea of repurposing isn't new — but doing it in 2 minutes is.\n\n#ContentCreator #CreatorEconomy #VideoMarketing #Repurposing #${title.split(" ").slice(0, 2).join("")}`,
    },
  ];

  return outputs.map((o) => ({
    ...o,
    wordCount: wordCount(o.body),
  }));
}

const AI_SYSTEM_PROMPT = (types: string) =>
  `You are AmpliForge, a content repurposing assistant. Return JSON only — no markdown fences: { "items": [{ "type": string, "title": string, "body": string }] }. Generate exactly these content types: ${types}. For "carousel" output slide-by-slide text (Slide 1, Slide 2, etc.). For "caption" write a short punchy social media caption with relevant hashtags. Keep the creator's voice natural and concise.`;

function parseAiResponse(raw: string): GeneratedContent[] | null {
  try {
    const cleaned = raw.replace(/```(?:json)?\n?/g, "").trim();
    const parsed = JSON.parse(cleaned) as {
      items?: { type: ContentType; title: string; body: string }[];
    };
    if (!parsed.items?.length) return null;

    const results = parsed.items
      .filter((item) => DEFAULT_OUTPUT_TYPES.includes(item.type as (typeof DEFAULT_OUTPUT_TYPES)[number]))
      .map((item) => ({
        type: item.type,
        title: item.title,
        body: item.body,
        wordCount: wordCount(item.body),
      }));

    return results.length ? results : null;
  } catch {
    return null;
  }
}

async function claudeOutputs(
  title: string,
  channel: string,
  transcript: string
): Promise<GeneratedContent[] | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const trimmed = transcript.slice(0, 15_000);
  const types = DEFAULT_OUTPUT_TYPES.join(", ");

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      system: AI_SYSTEM_PROMPT(types),
      messages: [
        {
          role: "user",
          content: `Title: ${title}\nChannel: ${channel}\n\nTranscript:\n${trimmed}`,
        },
      ],
    });

    const block = message.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") return null;

    return parseAiResponse(block.text);
  } catch (err) {
    console.warn("Claude generation failed:", err);
    return null;
  }
}

async function openAiOutputs(
  title: string,
  channel: string,
  transcript: string
): Promise<GeneratedContent[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const trimmed = transcript.slice(0, 12_000);
  const types = DEFAULT_OUTPUT_TYPES.join(", ");

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: AI_SYSTEM_PROMPT(types) },
          {
            role: "user",
            content: `Title: ${title}\nChannel: ${channel}\n\nTranscript:\n${trimmed}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.warn("OpenAI generation failed:", await res.text());
      return null;
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;

    return parseAiResponse(raw);
  } catch (err) {
    console.warn("OpenAI generation failed:", err);
    return null;
  }
}

export async function generateContent(
  title: string,
  channel: string,
  transcript: string
): Promise<GeneratedContent[]> {
  // Primary: Claude (claude-opus-4-8)
  const claude = await claudeOutputs(title, channel, transcript);
  if (claude?.length) return claude;

  // Fallback: OpenAI (gpt-4o-mini)
  const openai = await openAiOutputs(title, channel, transcript);
  if (openai?.length) return openai;

  // Last resort: deterministic templates
  return templateOutputs(title, channel, transcript);
}
