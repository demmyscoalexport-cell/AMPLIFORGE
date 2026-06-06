"use client";

import * as React from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const { signIn, isLoaded } = useSignIn();
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded) return;
    setError(null);
    setLoading(true);

    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors: { message: string }[] }).errors[0]?.message
          : "Something went wrong. Please try again.";
      setError(msg ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-[var(--border)] bg-[var(--elevated)]/95 backdrop-blur-xl p-8 shadow-card-lg"
    >
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div key="form" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-5"
            >
              <ArrowLeft className="h-3 w-3" /> Back to sign in
            </Link>
            <div className="text-center mb-6">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-hero flex items-center justify-center mb-4 shadow-glow-blue">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
              <p className="text-sm text-[var(--text-muted)] mt-1.5">
                Enter your email and we&apos;ll send a reset code.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@studio.com" required />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading || !isLoaded}>
                {loading ? "Sending…" : "Send reset code"}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="mx-auto h-16 w-16 rounded-full bg-[var(--success)]/15 flex items-center justify-center mb-5"
            >
              <CheckCircle2 className="h-8 w-8 text-[var(--success)]" />
            </motion.div>
            <h1 className="text-2xl font-semibold tracking-tight">Check your inbox</h1>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              We sent a reset code to your email. Enter it on the next screen.
            </p>
            <Button asChild variant="secondary" className="mt-6">
              <Link href="/sign-in">Back to sign in</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
