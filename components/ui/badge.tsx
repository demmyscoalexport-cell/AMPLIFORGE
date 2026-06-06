import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]",
        brand: "bg-[var(--brand-blue)]/12 text-[var(--brand-blue)] border border-[var(--brand-blue)]/20",
        purple: "bg-[var(--brand-purple)]/12 text-[var(--brand-purple)] border border-[var(--brand-purple)]/20",
        gold: "bg-[var(--brand-gold)]/15 text-[var(--brand-gold)] border border-[var(--brand-gold)]/30",
        crimson: "bg-[var(--brand-crimson)]/12 text-[var(--brand-crimson)] border border-[var(--brand-crimson)]/20",
        success: "bg-[var(--success)]/12 text-[var(--success)] border border-[var(--success)]/20",
        warning: "bg-[var(--warning)]/15 text-[var(--warning)] border border-[var(--warning)]/30",
        danger: "bg-[var(--danger)]/12 text-[var(--danger)] border border-[var(--danger)]/20",
        outline: "border border-[var(--border)] text-[var(--text-secondary)]",
        gradient: "bg-gradient-hero text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { badgeVariants };
