import "server-only";
import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (resend) return resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  resend = new Resend(key);
  return resend;
}

const FROM = "AmpliForge <noreply@ampliforge.io>";

interface SendResult {
  ok: boolean;
  id?: string;
  error?: string;
}

async function send(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendResult> {
  const client = getResend();
  if (!client) {
    // Graceful degradation — log and continue without failing
    console.warn("[email] RESEND_API_KEY not set, skipping email to", opts.to);
    return { ok: false, error: "Email service not configured" };
  }
  try {
    const { data, error } = await client.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { ok: false, error: String(err) };
  }
}

// ── Template helpers ──────────────────────────────────────────────────────────

function layout(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AmpliForge</title>
<style>
  body { margin: 0; padding: 0; background: #0d0d12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  .wrap { max-width: 560px; margin: 0 auto; padding: 40px 20px; }
  .logo { font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 32px; }
  .logo span { background: linear-gradient(135deg, #6c63ff, #4f9eff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .card { background: #16161f; border: 1px solid #2a2a3a; border-radius: 16px; padding: 32px; }
  h1 { margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #ffffff; }
  p { margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #a0a0b8; }
  .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #6c63ff, #4f9eff); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; margin-top: 8px; }
  .footer { margin-top: 24px; font-size: 12px; color: #4a4a6a; text-align: center; }
  .highlight { color: #ffffff; font-weight: 600; }
</style>
</head>
<body>
<div class="wrap">
  <div class="logo">Ampli<span>Forge</span></div>
  <div class="card">${body}</div>
  <div class="footer">AmpliForge · Repurpose content at scale · <a href="https://ampliforge.io" style="color:#6c63ff">ampliforge.io</a></div>
</div>
</body>
</html>`;
}

// ── Public email senders ──────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, firstName: string): Promise<SendResult> {
  return send({
    to,
    subject: "Welcome to AmpliForge 🎬",
    html: layout(`
      <h1>Welcome, ${firstName}!</h1>
      <p>You're in. AmpliForge turns your YouTube videos into a full week of polished content — LinkedIn posts, email newsletters, threads, hooks, carousels, and more.</p>
      <p>Paste a YouTube URL, hit process, and you're done in seconds.</p>
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Open your dashboard →</a>
      <p style="margin-top:24px;">If you have any questions, just reply to this email — we read every one.</p>
    `),
  });
}

export async function sendProjectCompleteEmail(
  to: string,
  firstName: string,
  projectTitle: string,
  projectId: string
): Promise<SendResult> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/projects/${projectId}`;
  return send({
    to,
    subject: `Your content is ready: "${projectTitle}"`,
    html: layout(`
      <h1>Your content is ready 🚀</h1>
      <p>Hey ${firstName}, AmpliForge has finished processing <span class="highlight">"${projectTitle}"</span>.</p>
      <p>You now have 7 content formats ready to publish — LinkedIn post, email, thread, hook, summary, carousel, and caption.</p>
      <a class="btn" href="${url}">View your content →</a>
    `),
  });
}

export async function sendLowCreditsEmail(
  to: string,
  firstName: string,
  remaining: number
): Promise<SendResult> {
  const upgradeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`;
  return send({
    to,
    subject: "You're running low on AmpliForge credits",
    html: layout(`
      <h1>Credits running low</h1>
      <p>Hey ${firstName}, you have <span class="highlight">${remaining} credits</span> remaining on your current plan.</p>
      <p>Upgrade now to keep repurposing content without interruption. Pro gives you 50,000 credits per month — enough for hundreds of videos.</p>
      <a class="btn" href="${upgradeUrl}">Upgrade your plan →</a>
      <p style="margin-top:16px;">Your existing projects and content are always safe regardless of credit balance.</p>
    `),
  });
}
