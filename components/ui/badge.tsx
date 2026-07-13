import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]",
        brand: "bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20",
        purple: "bg-[var(--brand-secondary)]/12 text-[var(--brand-secondary)] border border-[var(--brand-secondary)]/20",
        gold: "bg-[var(--brand-premium)]/15 text-[var(--brand-premium)] border border-[var(--brand-premium)]/30",
        crimson: "bg-[var(--brand-accent)]/12 text-[var(--brand-accent)] border border-[var(--brand-accent)]/20",
        success: "bg-[var(--status-success)]/12 text-[var(--status-success)] border border-[var(--status-success)]/20",
        warning: "bg-[var(--status-warning)]/15 text-[var(--status-warning)] border border-[var(--status-warning)]/30",
        danger: "bg-[var(--status-danger)]/12 text-[var(--status-danger)] border border-[var(--status-danger)]/20",
        processing: "bg-[var(--status-processing)]/12 text-[var(--status-processing)] border border-[var(--status-processing)]/20",
        outline: "border border-[var(--border)] text-[var(--text-secondary)]",
        gradient: "bg-gradient-hero text-[var(--text-on-brand)]",
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
