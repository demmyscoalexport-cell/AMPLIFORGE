import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ampliforge.app"),
  title: {
    default: "AmpliForge — Turn One Video Into A Week Of Content",
    template: "%s · AmpliForge",
  },
  description:
    "AmpliForge uses AI to repurpose YouTube videos, podcasts, and webinars into LinkedIn posts, email sequences, X threads, and more — in seconds.",
  keywords: [
    "AI content",
    "video repurposing",
    "creator tools",
    "LinkedIn AI",
    "podcast to text",
    "content automation",
  ],
  authors: [{ name: "AmpliForge" }],
  openGraph: {
    title: "AmpliForge — AI Content Intelligence Platform",
    description: "Turn one video into a week of content.",
    url: "https://ampliforge.app",
    siteName: "AmpliForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AmpliForge — Turn One Video Into A Week Of Content",
    description: "AI-powered content repurposing for creators.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
