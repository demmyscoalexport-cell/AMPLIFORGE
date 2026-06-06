import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-mesh animate-gradient-shift pointer-events-none" />
      <div className="absolute inset-0 bg-[var(--bg-primary)]/40 pointer-events-none" />

      {/* Floating panels for ambient feel */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[var(--brand-blue)]/20 blur-3xl animate-float pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[var(--brand-purple)]/20 blur-3xl animate-float pointer-events-none" style={{ animationDelay: "2s" }} />

      <header className="absolute top-0 inset-x-0 z-10 container-page flex items-center justify-between py-6">
        <Logo />
        <ThemeToggle />
      </header>

      <div className="relative z-10 w-full max-w-md px-6 py-24">{children}</div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-[var(--text-muted)]">
        © 2026 AmpliForge ·{" "}
        <Link href="#" className="hover:text-[var(--text-primary)]">Terms</Link> ·{" "}
        <Link href="#" className="hover:text-[var(--text-primary)]">Privacy</Link>
      </p>
    </div>
  );
}
