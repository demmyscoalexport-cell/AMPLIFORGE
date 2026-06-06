"use client";

import { motion } from "framer-motion";
import { MOCK_TRUST_LOGOS } from "@/lib/mock-data";

export function TrustBar() {
  const duplicated = [...MOCK_TRUST_LOGOS, ...MOCK_TRUST_LOGOS];

  return (
    <section className="relative bg-[#0A0A0A] dark:bg-[#050505] text-zinc-400 py-14 overflow-hidden">
      <div className="container-page">
        <p className="text-center text-xs uppercase tracking-widest text-zinc-500 mb-8">
          Trusted by creators at
        </p>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0A0A0A] dark:from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0A0A0A] dark:from-[#050505] to-transparent z-10 pointer-events-none" />

          <div className="flex gap-12 animate-marquee">
            {duplicated.map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="shrink-0 text-zinc-500 hover:text-white transition-colors duration-200 font-semibold tracking-tight whitespace-nowrap"
              >
                {name}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { value: "12,847", label: "Creators" },
            { value: "2.4M", label: "Pieces of Content" },
            { value: "$8.2M", label: "Creator Revenue Attributed" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
