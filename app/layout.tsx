import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ampliforge.app"),
  title: {
    default: "Ampliforge — Enterprise AI Content Repurposing",
    template: "%s · Ampliforge",
  },
  description:
    "Paste a YouTube URL. Ampliforge transcribes, extracts insights, and generates LinkedIn posts, threads, carousels, emails, and more — in under 2 minutes.",
  keywords: [
    "AI content",
    "video repurposing",
    "enterprise content",
    "LinkedIn AI",
    "YouTube to LinkedIn",
    "content automation",
  ],
  authors: [{ name: "Ampliforge" }],
  openGraph: {
    title: "Ampliforge — Enterprise AI Content Repurposing",
    description: "Turn one video into a complete multi-platform content package.",
    url: "https://ampliforge.app",
    siteName: "Ampliforge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ampliforge — Enterprise AI Content Repurposing",
    description: "AI-powered content repurposing for modern teams.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D0D" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${jetbrains.variable} h-full dark`}
    >
      <body className="min-h-full bg-background font-sans text-[var(--text-body)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
