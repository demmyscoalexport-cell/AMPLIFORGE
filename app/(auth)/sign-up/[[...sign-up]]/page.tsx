"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-[var(--border)] bg-[var(--elevated)]/95 backdrop-blur-xl p-8 shadow-card-lg"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Start creating for free</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1.5">
          14-day Pro trial. No credit card required.
        </p>
      </div>

      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
      />

      <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-[var(--text-muted)]">
        {["No credit card", "Cancel anytime", "SOC2 compliant"].map((item) => (
          <span key={item} className="inline-flex items-center gap-1">
            <Check className="h-3 w-3 text-[var(--success)]" />
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
