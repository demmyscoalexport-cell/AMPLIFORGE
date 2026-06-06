"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-blue)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-hero text-white shadow-[0_4px_14px_rgba(13,102,208,0.35)] hover:shadow-[0_8px_24px_rgba(13,102,208,0.45)] hover:-translate-y-px active:translate-y-0",
        secondary:
          "bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--elevated)] hover:border-[var(--text-muted)]/30",
        ghost:
          "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface)]",
        gold:
          "bg-gradient-gold text-zinc-900 shadow-[0_4px_14px_rgba(212,175,55,0.35)] hover:shadow-[0_8px_24px_rgba(212,175,55,0.45)] hover:-translate-y-px",
        danger:
          "bg-[var(--danger)] text-white hover:opacity-90",
        link: "text-[var(--brand-blue)] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-5",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-8 text-base font-semibold",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
