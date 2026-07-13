"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Link as LinkIcon,
  Loader2,
  Sparkles,
  Wand2,
  PlayCircle,
  Megaphone,
  Mail,
  MessageSquare,
  Zap,
  FileText,
  Images,
  AtSign,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/design/tokens";
import { useProcessingStore } from "@/store/project-store";

const OUTPUT_FORMATS = [
  { key: "linkedin", label: "LinkedIn post", Icon: Megaphone },
  { key: "thread", label: "X / Twitter thread", Icon: MessageSquare },
  { key: "email", label: "Email newsletter", Icon: Mail },
  { key: "hook", label: "Scroll-stopping hook", Icon: Zap },
  { key: "summary", label: "Episode summary", Icon: FileText },
  { key: "carousel", label: "Instagram carousel", Icon: Images },
  { key: "caption", label: "Social caption", Icon: AtSign },
] as const;

const STEPS = ["Welcome", "How it works", "Your first video"] as const;

const SAMPLE_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const stepVariants = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

export function OnboardingFlow({ greetingName }: { greetingName: string }) {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [url, setUrl] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const begin = useProcessingStore((s) => s.begin);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const startWithUrl = async () => {
    const sourceUrl = url.trim();
    if (!sourceUrl) {
      toast.error("Add a URL first", {
        description: "Paste a YouTube, podcast, or webinar link to begin.",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceUrl }),
      });
      const data = (await res.json()) as { id?: string; title?: string; error?: string };
      if (!res.ok || !data.id) {
        toast.error("Could not start", { description: data.error ?? "Try again." });
        return;
      }
      begin(data.id, sourceUrl, data.title);
      toast.success("Processing started", { description: "We're turning your video into a week of content." });
      router.push("/dashboard");
    } catch {
      toast.error("Network error", { description: "Check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const loadSample = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/seed-demo", { method: "POST" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error("Could not load sample", { description: data.error ?? "Try again." });
        return;
      }
      toast.success("Sample workspace ready");
      router.push("/dashboard");
    } catch {
      toast.error("Network error", { description: "Check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-mesh animate-gradient-shift pointer-events-none" />
      <div className="absolute inset-0 bg-[var(--surface-bg-base)]/60 pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-8">
        {/* Header: logo + progress */}
        <header className="flex items-center justify-between">
          <Logo size="md" asLink={false} />
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            Skip for now
          </button>
        </header>

        {/* Stepper */}
        <div className="mt-8 flex items-center gap-2" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-200",
                  i < step && "border-transparent bg-[var(--brand-primary)] text-[var(--text-on-brand)]",
                  i === step && "border-[var(--brand-primary)] text-[var(--brand-primary)]",
                  i > step && "border-[var(--border)] text-[var(--text-muted)]"
                )}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-[var(--border)]">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[var(--brand-primary)]"
                  initial={false}
                  animate={{ width: i < step ? "100%" : "0%" }}
                  transition={transitions.base}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="flex flex-1 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitions.base}
              className="w-full"
            >
              {step === 0 && (
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--brand-premium)]" />
                    Welcome to AmpliForge
                  </span>
                  <h1 className="text-h1 mt-6">
                    Hi {greetingName}, let&apos;s turn one video into{" "}
                    <span className="text-gradient-brand">a week of content</span>.
                  </h1>
                  <p className="mx-auto mt-4 max-w-xl text-body-lg text-[var(--text-secondary)]">
                    Paste a YouTube, podcast, or webinar link and AmpliForge repurposes it into 7
                    platform-ready formats in minutes — no manual editing required.
                  </p>
                  <div className="mt-8 flex justify-center">
                    <Button size="lg" onClick={next}>
                      Get started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="text-h2 text-center">Here&apos;s how it works</h2>
                  <p className="mx-auto mt-3 max-w-lg text-center text-[var(--text-secondary)]">
                    Three steps. One source in, a full content set out.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {[
                      { n: 1, t: "Paste a link", d: "Drop any YouTube, podcast, or webinar URL." },
                      { n: 2, t: "AI does the work", d: "We transcribe, extract insights, and write." },
                      { n: 3, t: "Publish everywhere", d: "Edit, export, and ship across platforms." },
                    ].map((s) => (
                      <div
                        key={s.n}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-card"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero text-sm font-semibold text-[var(--text-on-brand)] shadow-[var(--shadow-button-primary)]">
                          {s.n}
                        </div>
                        <h3 className="mt-4 text-sm font-semibold">{s.t}</h3>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">{s.d}</p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-8 text-caption text-center text-[var(--text-muted)]">
                    Every video becomes these 7 formats
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {OUTPUT_FORMATS.map(({ key, label, Icon }) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-secondary)]"
                      >
                        <Icon className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-3">
                    <Button variant="ghost" size="lg" onClick={back}>
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button size="lg" onClick={next}>
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="mx-auto max-w-xl">
                  <h2 className="text-h2 text-center">Create your first content set</h2>
                  <p className="mx-auto mt-3 max-w-md text-center text-[var(--text-secondary)]">
                    Paste a video link to start, or explore with sample content.
                  </p>

                  <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-card-lg">
                    <label htmlFor="onboarding-url" className="text-caption text-[var(--text-muted)]">
                      Video URL
                    </label>
                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-bg-base)] px-4 py-3 transition-all focus-within:border-[var(--input-border-focus,var(--brand-primary))] focus-within:ring-4 focus-within:ring-[var(--brand-primary)]/10">
                      <LinkIcon className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                      <input
                        id="onboarding-url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !submitting && void startWithUrl()}
                        placeholder="https://www.youtube.com/watch?v=…"
                        className="flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                        autoComplete="off"
                        disabled={submitting}
                      />
                    </div>

                    <button
                      onClick={() => setUrl(SAMPLE_URL)}
                      className="mt-3 text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--brand-primary)]"
                    >
                      Use an example link
                    </button>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Button size="lg" className="flex-1" onClick={() => void startWithUrl()} disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Starting…
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4" />
                            Generate my content
                          </>
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="flex-1"
                        onClick={() => void loadSample()}
                        disabled={submitting}
                      >
                        <PlayCircle className="h-4 w-4" />
                        Explore a sample
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button variant="ghost" size="md" onClick={back} disabled={submitting}>
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
