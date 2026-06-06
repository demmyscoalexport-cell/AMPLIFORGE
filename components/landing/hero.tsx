"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, ChevronDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function LandingHero() {
  return (
    <section className="relative min-h-[100dvh] pt-32 pb-24 overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-subtle pointer-events-none" />

      {/* Floating dots */}
      <FloatingDots />

      <div className="relative container-page">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur px-3.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[var(--brand-gold)]" />
              Trusted by 12,000+ Creators
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-display mt-6">
            Turn One Video
            <br />
            Into{" "}
            <span className="relative inline-block text-gradient-brand">
              A Week Of Content.
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                aria-hidden
              >
                <motion.path
                  d="M3 9C72 3 195 3 297 9"
                  stroke="url(#hero-underline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="hero-underline" x1="0" x2="300" y1="0" y2="0">
                    <stop stopColor="#0D66D0" />
                    <stop offset="1" stopColor="#9256D9" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl"
          >
            AmpliForge uses AI to repurpose your YouTube videos, podcasts, and webinars into LinkedIn posts,
            email sequences, X threads, and more — in seconds.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-3">
            <Button asChild size="xl">
              <Link href="/sign-up">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="secondary">
              <Link href="#demo">
                <Play className="h-4 w-4" />
                Watch Demo
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--text-muted)]"
          >
            {["No credit card required", "Cancel anytime", "SOC2 compliant"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)]" />
                {item}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-16 w-full max-w-4xl">
            <HeroMockup />
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#features"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        aria-label="Scroll to features"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-float" />
      </a>
    </section>
  );
}

function FloatingDots() {
  const dots = [
    { x: "10%", y: "20%", size: 4, delay: 0 },
    { x: "85%", y: "15%", size: 6, delay: 0.6 },
    { x: "75%", y: "60%", size: 4, delay: 1.2 },
    { x: "15%", y: "70%", size: 5, delay: 0.3 },
    { x: "50%", y: "10%", size: 3, delay: 0.9 },
    { x: "92%", y: "45%", size: 4, delay: 1.5 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none">
      {dots.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.2, 0.7, 0.2],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: d.delay,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-gradient-hero"
          style={{ left: d.x, top: d.y, width: d.size, height: d.size }}
        />
      ))}
    </div>
  );
}

function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="absolute -inset-20 bg-gradient-hero opacity-20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--elevated)] shadow-card-lg overflow-hidden">
        {/* Mock chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <div className="ml-auto text-[11px] text-[var(--text-muted)] font-mono">app.ampliforge.com/dashboard</div>
        </div>

        <div className="grid lg:grid-cols-[200px_1fr] gap-0">
          {/* Mock sidebar */}
          <div className="hidden lg:block border-r border-[var(--border)] p-4 space-y-1">
            {["Dashboard", "Projects", "Library", "Templates", "Analytics"].map((item, i) => (
              <div
                key={item}
                className={`h-7 rounded-md flex items-center px-2 text-xs ${
                  i === 0 ? "bg-[var(--brand-blue)]/15 text-[var(--brand-blue)] font-medium" : "text-[var(--text-muted)]"
                }`}
              >
                <div className="h-3 w-3 rounded-sm bg-current opacity-60 mr-2" />
                {item}
              </div>
            ))}
          </div>

          {/* Mock processing card */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-[var(--brand-purple)]" />
              <span className="text-sm font-semibold">Processing: &ldquo;How to Build a $10k/mo Agency&rdquo;</span>
            </div>

            <div className="space-y-3">
              {[
                { label: "Fetching Video", state: "done", value: 100 },
                { label: "Transcribing Audio", state: "done", value: 100 },
                { label: "Extracting Insights", state: "active", value: 74 },
                { label: "Generating Assets", state: "queued", value: 0 },
              ].map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step.state === "done"
                        ? "bg-[var(--success)] text-white"
                        : step.state === "active"
                        ? "bg-[var(--brand-blue)] text-white animate-pulse"
                        : "border border-[var(--border)] text-[var(--text-muted)]"
                    }`}
                  >
                    {step.state === "done" ? "✓" : ""}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs">
                      <span className={step.state === "queued" ? "text-[var(--text-muted)]" : "text-[var(--text-primary)] font-medium"}>{step.label}</span>
                      <span className="text-[var(--text-muted)] font-mono">
                        {step.state === "queued" ? "Queued" : `${step.value}%`}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--surface)] mt-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${step.value}%` }}
                        transition={{ duration: 1.2, delay: 1.2 + i * 0.15 }}
                        className="h-full bg-gradient-hero"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span className="font-mono">23s remaining</span>
              <span className="inline-flex items-center gap-1 text-[var(--brand-blue)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-blue)] animate-pulse" />
                AmpliForge is thinking…
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
