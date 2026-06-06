export const APP_NAME = "AmpliForge";
export const APP_TAGLINE = "Turn One Video Into A Week Of Content.";
export const APP_DESCRIPTION =
  "AmpliForge uses AI to repurpose YouTube videos, podcasts, and webinars into LinkedIn posts, email sequences, Twitter threads, and more — in seconds.";

export const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Changelog", href: "/changelog" },
];

export const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Templates", href: "/templates" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/changelog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Docs", href: "#" },
    { label: "API", href: "/settings/api" },
    { label: "Status", href: "#" },
    { label: "Community", href: "#" },
    { label: "Affiliates", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
    { label: "GDPR", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

export const DASHBOARD_NAV = {
  main: [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "Projects", href: "/projects", icon: "folder" },
    { label: "Library", href: "/library", icon: "library" },
    { label: "Templates", href: "/templates", icon: "palette" },
  ],
  tools: [
    { label: "Analytics", href: "/analytics", icon: "bar-chart" },
    {
      label: "AI Assistant",
      href: "/dashboard",
      icon: "sparkles",
      badge: "Beta",
    },
  ],
  account: [
    { label: "Settings", href: "/settings", icon: "settings" },
    { label: "Profile", href: "/settings/profile", icon: "user" },
  ],
} as const;
