"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRICING_TIERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const FAQ = [
  { q: "Can I cancel anytime?", a: "Yes — every plan is month-to-month. Cancel from your dashboard and your access continues through the end of the billing period." },
  { q: "What counts as one video?", a: "A single YouTube, podcast, or webinar URL is one video, regardless of length (we support up to 4 hours per piece)." },
  { q: "Do you preserve my voice?", a: "Yes. On Pro and Agency plans, you can train AmpliForge on your past content and pick from 6 default voice styles." },
  { q: "Can I export to my CMS?", a: "Pro and Agency plans include native exports to Notion, Buffer, ConvertKit, Beehiiv, and Google Docs. The Agency plan adds REST API access." },
  { q: "Is my data private?", a: "Yes. Your content is encrypted at rest, never used to train shared models, and you can delete it at any time. We're SOC2 Type II certified." },
  { q: "What's the refund policy?", a: "14-day money-back guarantee, no questions asked. Email us within 14 days of your first charge for a full refund." },
  { q: "Do you offer team plans?", a: "The Agency plan includes 10 team seats. Additional seats are $19/mo each. Volume discounts available for 25+ seats." },
  { q: "What languages are supported?", a: "English, Spanish, French, German, Portuguese, Italian, Dutch, Polish, and Japanese — with more being added monthly." },
];

export function Pricing() {
  const [yearly, setYearly] = React.useState(false);

  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-caption text-[var(--brand-gold)]">Pricing</span>
          <h2 className="text-h2 mt-2">Simple pricing. Serious leverage.</h2>
          <p className="text-[var(--text-secondary)] mt-5 text-lg">
            Start free. Scale when you&apos;re ready.
          </p>

          <div className="inline-flex items-center gap-1 mt-8 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all",
                !yearly ? "bg-[var(--bg-primary)] shadow-sm text-[var(--text-primary)]" : "text-[var(--text-muted)]"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all inline-flex items-center gap-2",
                yearly ? "bg-[var(--bg-primary)] shadow-sm text-[var(--text-primary)]" : "text-[var(--text-muted)]"
              )}
            >
              Yearly
              <Badge variant="gold" className="-mr-1">Save 40%</Badge>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {PRICING_TIERS.map((tier, i) => {
            const price = yearly ? tier.price.yearly : tier.price.monthly;
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative rounded-3xl border bg-[var(--elevated)] p-8 flex flex-col",
                  tier.highlight
                    ? "border-transparent shadow-glow-purple"
                    : "border-[var(--border)] shadow-card"
                )}
              >
                {tier.highlight && (
                  <>
                    <div
                      className="absolute inset-0 rounded-3xl p-px"
                      style={{
                        background: "linear-gradient(135deg, #0D66D0, #9256D9, #E34850)",
                        WebkitMask:
                          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                      }}
                    />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="gradient" className="px-3 py-1 shadow-lg">
                        <Sparkles className="h-3 w-3" />
                        Most Popular
                      </Badge>
                    </div>
                  </>
                )}

                <div className="relative">
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{tier.description}</p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight">${price}</span>
                    <span className="text-[var(--text-muted)]">/month</span>
                  </div>
                  {yearly && (
                    <p className="text-xs text-[var(--success)] font-medium mt-1">
                      Billed annually · ${price * 12}/yr
                    </p>
                  )}

                  <Button
                    asChild
                    size="lg"
                    variant={tier.highlight ? "primary" : "secondary"}
                    className="w-full mt-6"
                  >
                    <Link href={tier.ctaHref}>{tier.cta}</Link>
                  </Button>

                  <ul className="mt-8 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Check className="h-4 w-4 text-[var(--success)] shrink-0 mt-0.5" />
                        <span className="text-[var(--text-secondary)]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto mt-24">
          <h3 className="text-h3 text-center mb-8">Frequently asked questions</h3>
          <Accordion type="single" collapsible className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] px-6">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
