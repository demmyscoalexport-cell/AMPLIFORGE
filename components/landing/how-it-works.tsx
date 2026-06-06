"use client";

import { motion } from "framer-motion";
import { Link as LinkIcon, Bot, Sparkles, Rocket } from "lucide-react";

const STEPS = [
  { icon: LinkIcon, title: "Paste Link", desc: "Drop any YouTube, podcast, or webinar URL." },
  { icon: Bot, title: "AI Analyzes", desc: "Transcribes and extracts the key insights, hooks, and arcs." },
  { icon: Sparkles, title: "Content Generated", desc: "10+ platform-native formats created in seconds." },
  { icon: Rocket, title: "Export Everywhere", desc: "One-click publish to all your platforms." },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 lg:py-32 bg-[var(--bg-secondary)] overflow-hidden">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center mb-20">
          <span className="text-caption text-[var(--brand-purple)]">Workflow</span>
          <h2 className="text-h2 mt-2">From raw video to published content in 4 steps</h2>
          <p className="text-[var(--text-secondary)] mt-5 text-lg">
            No editor required. No prompt engineering. Just the work, done.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line — desktop */}
          <div className="hidden md:block absolute top-[36px] left-[10%] right-[10%] h-px pointer-events-none">
            <svg width="100%" height="2" preserveAspectRatio="none" className="overflow-visible">
              <motion.line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="url(#step-gradient)"
                strokeWidth="2"
                strokeDasharray="4 6"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="step-gradient" x1="0" x2="100%" y1="0" y2="0">
                  <stop stopColor="#0D66D0" />
                  <stop offset="0.5" stopColor="#9256D9" />
                  <stop offset="1" stopColor="#E34850" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-hero blur-2xl opacity-30 rounded-full" />
                  <div className="relative h-[72px] w-[72px] rounded-full bg-gradient-hero shadow-glow-blue flex items-center justify-center text-white">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-[220px] leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
