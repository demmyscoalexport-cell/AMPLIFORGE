"use client";

import { motion } from "framer-motion";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-[var(--border)] bg-[var(--elevated)]/95 backdrop-blur-xl p-8 shadow-card-lg"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1.5">
          Sign in to continue creating.
        </p>
      </div>

      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />
    </motion.div>
  );
}
