"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#5B63D3",
          colorText: "#EBEBEB",
          colorBackground: "#1A1A1A",
          colorInputBackground: "#212121",
          colorInputText: "#EBEBEB",
          colorTextSecondary: "#BBBBBB",
          borderRadius: "10px",
          fontFamily: "var(--font-inter)",
        },
        elements: {
          card: "bg-transparent shadow-none border-0",
          rootBox: "w-full",
          formButtonPrimary:
            "bg-brand-500 hover:bg-brand-600 normal-case font-medium rounded-[10px]",
          socialButtonsBlockButton:
            "border border-[var(--border)] bg-[var(--bg-primary)] hover:bg-[var(--surface)] text-[var(--text-primary)] normal-case rounded-[10px]",
          formFieldInput:
            "bg-[var(--input)] border-[var(--border)] text-[var(--text-primary)] rounded-[10px] h-11",
          formFieldLabel: "text-[var(--text-primary)] font-medium",
          footerActionLink: "text-brand-500 hover:underline",
          headerTitle: "hidden",
          headerSubtitle: "hidden",
          dividerLine: "bg-[var(--border)]",
          dividerText: "text-[var(--text-muted)] uppercase text-[10px] tracking-widest",
        },
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <QueryClientProvider client={client}>
          <TooltipProvider delayDuration={150} skipDelayDuration={50}>
            {children}
            <Toaster
              position="top-right"
              theme="system"
              duration={5000}
              toastOptions={{
                classNames: {
                  toast:
                    "!bg-[var(--elevated)] !border !border-[var(--border)] !text-[var(--text-primary)] !shadow-[var(--shadow-xl)] !rounded-[var(--radius-2xl)]",
                  title: "!text-sm !font-medium",
                  description: "!text-xs !text-[var(--text-muted)]",
                },
              }}
            />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
