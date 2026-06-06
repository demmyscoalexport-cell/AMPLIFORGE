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
          colorPrimary: "#0D66D0",
          colorText: "#fafafa",
          colorBackground: "#181818",
          colorInputBackground: "#0a0a0a",
          colorInputText: "#fafafa",
          colorTextSecondary: "#cacaca",
          borderRadius: "12px",
          fontFamily: "var(--font-geist-sans)",
        },
        elements: {
          card: "bg-transparent shadow-none border-0",
          rootBox: "w-full",
          formButtonPrimary:
            "bg-gradient-to-r from-[#0D66D0] to-[#9256D9] hover:opacity-95 normal-case font-medium",
          socialButtonsBlockButton:
            "border border-[var(--border)] bg-[var(--bg-primary)] hover:bg-[var(--surface)] text-[var(--text-primary)] normal-case",
          formFieldInput:
            "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)] rounded-xl h-11",
          formFieldLabel: "text-[var(--text-primary)] font-medium",
          footerActionLink: "text-[var(--brand-blue)] hover:underline",
          headerTitle: "hidden",
          headerSubtitle: "hidden",
          dividerLine: "bg-[var(--border)]",
          dividerText: "text-[var(--text-muted)] uppercase text-[10px] tracking-widest",
        },
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <QueryClientProvider client={client}>
          <TooltipProvider delayDuration={150} skipDelayDuration={50}>
            {children}
            <Toaster
              position="bottom-right"
              theme="system"
              toastOptions={{
                classNames: {
                  toast:
                    "!bg-[var(--elevated)] !border !border-[var(--border)] !text-[var(--text-primary)] !shadow-card-lg !rounded-2xl",
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
