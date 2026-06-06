"use client";

import { motion } from "framer-motion";
import { Star, Mic } from "lucide-react";
import {
  LinkedinIcon as Linkedin,
  YoutubeIcon as Youtube,
  TwitterIcon as Twitter,
} from "@/components/shared/brand-icons";
import { cn } from "@/lib/utils";
import type { DbTestimonial } from "@/lib/supabase/types";

const platformIcon = {
  linkedin: Linkedin,
  youtube: Youtube,
  podcast: Mic,
  x: Twitter,
} as const;

export function TestimonialsClient({ items }: { items: DbTestimonial[] }) {
  return (
    <section className="relative py-24 lg:py-32 bg-[var(--bg-secondary)]">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-caption text-[var(--brand-crimson)]">Loved by creators</span>
          <h2 className="text-h2 mt-2">What creators are saying</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {items.map((t, i) => {
            const Icon = platformIcon[t.platform];
            return (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "group relative rounded-3xl border border-[var(--border)] bg-[var(--elevated)] p-6 shadow-card",
                  "hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1",
                  i % 5 === 0 && "md:col-span-2 lg:col-span-1"
                )}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[var(--brand-gold)] text-[var(--brand-gold)]" />
                  ))}
                </div>
                <blockquote className="text-[var(--text-primary)] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-hero text-white text-sm font-semibold flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">{t.name}</span>
                      <Icon className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    </div>
                    <p className="text-xs text-[var(--text-muted)] truncate">{t.handle}</p>
                  </div>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
