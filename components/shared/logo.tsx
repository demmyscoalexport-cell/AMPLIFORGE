import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
}

export function Logo({ className, size = "md", asLink = true }: LogoProps) {
  const sizeMap = {
    sm: { text: "text-base", icon: 22 },
    md: { text: "text-lg", icon: 26 },
    lg: { text: "text-2xl", icon: 32 },
  } as const;

  const inner = (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", sizeMap[size].text, className)}>
      <svg width={sizeMap[size].icon} height={sizeMap[size].icon} viewBox="0 0 32 32" fill="none" aria-hidden>
        <defs>
          <linearGradient id="af-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0D66D0" />
            <stop offset="1" stopColor="#9256D9" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#af-logo-grad)" />
        <path
          d="M9.5 22.5L16 9.5l6.5 13M12.5 19h7"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        <span className="text-gradient-brand">Ampli</span>
        <span className="text-[var(--text-primary)]">Forge</span>
      </span>
    </span>
  );

  return asLink ? <Link href="/">{inner}</Link> : inner;
}
