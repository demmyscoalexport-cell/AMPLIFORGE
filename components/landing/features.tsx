"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Repeat, FileText, Workflow } from "lucide-react";
import { LinkedinIcon as Linkedin } from "@/components/shared/brand-icons";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Mail,
    title: "AI Email Sequences",
    desc: "Generate full 5-day welcome flows, nurture sequences, and re-engagement campaigns from a single video transcript.",
    span: "lg:col-span-2",
    accent: "from-[#0D66D0] to-[#9256D9]",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Posts",
    desc: "Professional, hook-first posts optimized for the LinkedIn algorithm.",
    span: "",
    accent: "from-[#0D66D0] to-[#0EA5E9]",
  },
  {
    icon: MessageCircle,
    title: "Twitter/X Threads",
    desc: "Multi-tweet threads with hooks, structure, and cliffhangers built in.",
    span: "",
    accent: "from-[#E34850] to-[#FF6B6B]",
  },
  {
    icon: Repeat,
    title: "Content Repurposing Engine",
    desc: "Transform any source into 10+ platform-native formats. Choose the tone, length, and voice — AmpliForge does the rest.",
    span: "lg:col-span-2",
    accent: "from-[#9256D9] to-[#0D66D0]",
  },
  {
    icon: FileText,
    title: "AI Summaries",
    desc: "Crisp recaps that double as show notes, blog intros, or sales briefs.",
    span: "",
    accent: "from-[#D4AF37] to-[#FFD700]",
  },
  {
    icon: Workflow,
    title: "Creator Automation",
    desc: "Chain outputs into full publishing workflows. Schedule, queue, export.",
    span: "",
    accent: "from-[#10B981] to-[#0D66D0]",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-caption text-[var(--brand-blue)]"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-h2 mt-2"
          >
            Everything a creator needs,
            <br />
            <span className="text-gradient-brand">powered by AI</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[var(--text-secondary)] mt-5 text-lg"
          >
            A complete content operating system, not another generator.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className={cn(
                "group relative rounded-3xl border border-[var(--border)] bg-[var(--elevated)] p-8 overflow-hidden",
                "shadow-sm hover:shadow-card-lg transition-shadow duration-300",
                f.span
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500",
                  f.accent
                )}
              />
              <div
                className={cn(
                  "absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-br opacity-10 blur-3xl pointer-events-none",
                  f.accent
                )}
              />

              <div className="relative">
                <div className={cn("inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg", f.accent)}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
