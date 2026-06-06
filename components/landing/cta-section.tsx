"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#0A0A0A] dark:bg-[#050505] text-white overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #0D66D0, transparent 60%)" }}
        />
        <div
          className="absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #9256D9, transparent 60%)" }}
        />
      </div>

      <div className="relative container-page text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Sparkles className="h-8 w-8 mx-auto text-[var(--brand-gold)] mb-6" />
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            Ready to 10x your
            <br />
            <span className="text-gradient-brand">content output?</span>
          </h2>
          <p className="text-lg text-zinc-400 mt-6 max-w-xl mx-auto">
            Join 12,000+ creators using AmpliForge to publish a week of content in under 10 minutes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="xl" className="animate-pulse-glow">
              <Link href="/sign-up">
                Start Free Trial — No Card Required
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="text-xs text-zinc-500 mt-6">14-day free trial · Cancel anytime · SOC2 compliant</p>
        </motion.div>
      </div>
    </section>
  );
}
