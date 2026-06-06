import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const DEMO_TRANSCRIPT = [
  { time: "0:00", text: "So I want to start with a question that nobody is asking, which is: why do most agencies fail in the first 90 days?" },
  { time: "0:14", text: "And I think the answer is uncomfortable. It's not because the work is hard. It's because the founder is afraid to charge what the work is worth." },
  { time: "0:42", text: "I'll give you a concrete example. When I started my first agency, I was charging $1,500 a month for what I now charge $9,000 a month for. Same deliverables. Same team. Same outcomes." },
  { time: "1:18", text: "The only thing that changed was my willingness to walk away from clients who wouldn't pay the new number." },
  { time: "1:46", text: "There's a framework I use now called the 'three-yes test.' Before I send a proposal, I ask myself three questions: Do I want this client? Do I believe I can over-deliver? And — this is the important one — am I genuinely indifferent to whether they say yes?" },
];

const DEMO_PROJECTS = [
  {
    title: "How to Build a $10k/mo Agency in 90 Days",
    source: "youtube" as const,
    source_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "linear-gradient(135deg, #0D66D0, #9256D9)",
    duration: "32:14",
    channel: "Agency Blueprint",
    status: "done" as const,
    tags: ["agency", "pricing", "linkedin"],
    content: [
      {
        type: "hook" as const,
        title: "Scroll-stopping hook",
        body: "I made $1M last year. Here's exactly what I'd do differently if I started my agency today…",
      },
      {
        type: "linkedin" as const,
        title: "LinkedIn authority post",
        body: "After 8 years in B2B marketing, here's what nobody tells you about pricing:\n\nMost agencies fail in the first 90 days — not because the work is hard, but because founders undercharge.\n\nI went from $1,500/mo to $9,000/mo for the same deliverables.\n\nThe only thing that changed? I was willing to walk away.",
      },
      {
        type: "thread" as const,
        title: "Twitter/X thread",
        body: "10 lessons from building a $10k/mo agency 🧵\n\n1/ Charge for outcomes, not hours\n2/ Use the three-yes test before every proposal\n3/ Pick a niche that scares you\n4/ Fire clients who drain you\n5/ Repurpose one video into a week of content",
      },
      {
        type: "email" as const,
        title: "Newsletter snippet",
        body: "Subject: The pricing mistake that kills new agencies\n\nHey {{firstName}},\n\nQuick story from this week's episode:\n\nI used to charge $1,500/month for work I now charge $9,000 for. Same output.\n\nThe difference wasn't skill — it was willingness to walk away.\n\nTry the three-yes test on your next proposal.",
      },
      {
        type: "summary" as const,
        title: "Episode summary",
        body: "## How to Build a $10k/mo Agency in 90 Days\n\n**Key themes:** pricing confidence, client selection, niche positioning.\n\n- Most agencies fail from undercharging, not bad work\n- The three-yes test filters bad-fit clients\n- Charge for outcomes; pick a niche that stretches you",
      },
    ],
  },
  {
    title: "The Repurposing Funnel — One Video, 14 Touchpoints",
    source: "podcast" as const,
    source_url: "https://example.com/podcast/repurposing-funnel",
    thumbnail: "linear-gradient(135deg, #9256D9, #E34850)",
    duration: "48:02",
    channel: "Creator Ops",
    status: "done" as const,
    tags: ["repurposing", "strategy"],
    content: [
      {
        type: "summary" as const,
        title: "Show notes",
        body: "A breakdown of turning one 30-minute interview into 14 distribution touchpoints across LinkedIn, email, and short-form social.",
      },
      {
        type: "linkedin" as const,
        title: "LinkedIn post",
        body: "One video. Fourteen touchpoints. Zero extra filming.\n\nThat's the repurposing funnel we break down in this episode — and it's how top creators publish daily without burning out.",
      },
    ],
  },
];

export async function seedDemoProjectsForUser(userId: string): Promise<{ created: number; skipped: boolean }> {
  const supabase = createSupabaseAdminClient();

  const { count } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if ((count ?? 0) > 0) {
    return { created: 0, skipped: true };
  }

  let created = 0;

  for (const demo of DEMO_PROJECTS) {
    const { data: project, error: projectErr } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        title: demo.title,
        source: demo.source,
        source_url: demo.source_url,
        thumbnail: demo.thumbnail,
        duration: demo.duration,
        channel: demo.channel,
        status: demo.status,
        tags: demo.tags,
      })
      .select("id")
      .single();

    if (projectErr || !project) continue;

    await supabase.from("project_transcripts").insert({
      project_id: project.id,
      segments: DEMO_TRANSCRIPT,
      full_text: DEMO_TRANSCRIPT.map((s) => s.text).join(" "),
    });

    await supabase.from("content_items").insert(
      demo.content.map((item) => ({
        user_id: userId,
        project_id: project.id,
        type: item.type,
        title: item.title,
        body: item.body,
        word_count: item.body.trim().split(/\s+/).filter(Boolean).length,
      }))
    );

    created += 1;
  }

  return { created, skipped: false };
}
