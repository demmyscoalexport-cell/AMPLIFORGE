import Link from "next/link";
import { Heart, Shield } from "lucide-react";
import {
  TwitterIcon as Twitter,
  LinkedinIcon as Linkedin,
  YoutubeIcon as Youtube,
  InstagramIcon as Instagram,
} from "@/components/shared/brand-icons";
import { Logo } from "@/components/shared/logo";
import { FOOTER_LINKS } from "@/lib/constants";

export function LandingFooter() {
  return (
    <footer className="bg-[#0A0A0A] text-zinc-300 dark:bg-[#050505] relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(13,102,208,0.5), transparent)" }}
      />
      <div className="container-page py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Logo />
            <p className="text-sm text-zinc-400 mt-4 leading-relaxed max-w-xs">
              The AI Content Intelligence Platform built for the creator economy.
            </p>
            <div className="flex gap-3 mt-5">
              {[Twitter, Linkedin, Youtube, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-zinc-300 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">© 2026 AmpliForge, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-[var(--brand-crimson)] fill-[var(--brand-crimson)]" /> for Creators
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1">
              <Shield className="h-3 w-3" /> SOC2
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1">
              GDPR
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
