"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { User, Bell, Shield, CreditCard, Palette, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import type { DbUser } from "@/lib/supabase/types";

interface ClerkUserProps {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  username: string;
}

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing & Plan", icon: CreditCard },
  { id: "appearance", label: "Appearance", icon: Palette },
] as const;

type Tab = (typeof TABS)[number]["id"];

export function SettingsClient({
  clerkUser,
  dbUser,
}: {
  clerkUser: ClerkUserProps;
  dbUser: DbUser | null;
}) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = React.useState<Tab>("profile");
  const [saving, setSaving] = React.useState(false);
  const [firstName, setFirstName] = React.useState(clerkUser.firstName);
  const [lastName, setLastName] = React.useState(clerkUser.lastName);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await user.update({ firstName, lastName });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar nav */}
      <aside className="w-48 shrink-0 hidden md:block">
        <nav className="space-y-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                  activeTab === tab.id
                    ? "bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile tab select */}
      <div className="md:hidden w-full">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full border whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "bg-[var(--brand-blue)]/12 border-[var(--brand-blue)]/30 text-[var(--brand-blue)]"
                  : "border-[var(--border)] text-[var(--text-secondary)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content panel */}
      <div className="flex-1 min-w-0">
        {activeTab === "profile" && (
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-6 space-y-6">
            <h2 className="text-base font-semibold">Profile</h2>

            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={clerkUser.imageUrl} />
                <AvatarFallback className="text-lg font-semibold bg-gradient-hero text-white">
                  {(clerkUser.firstName[0] ?? clerkUser.email[0] ?? "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{clerkUser.firstName} {clerkUser.lastName}</p>
                <p className="text-xs text-[var(--text-muted)]">{clerkUser.email}</p>
                <Badge variant="outline" className="mt-1 text-[10px] capitalize">
                  {dbUser?.plan ?? "starter"} plan
                </Badge>
              </div>
            </div>

            <Separator />

            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={clerkUser.email} disabled className="opacity-60" />
                <p className="text-xs text-[var(--text-muted)]">
                  To change your email, go to{" "}
                  <a href="https://accounts.clerk.dev/user" className="text-[var(--brand-blue)] hover:underline" target="_blank" rel="noreferrer">
                    account settings
                  </a>.
                </p>
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </form>
          </section>
        )}

        {activeTab === "notifications" && (
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-6 space-y-5">
            <h2 className="text-base font-semibold">Notifications</h2>
            {[
              { id: "project_done", label: "Project complete", desc: "Email when a project finishes processing" },
              { id: "low_credits", label: "Low credits warning", desc: "Alert when credits fall below 10%" },
              { id: "weekly_digest", label: "Weekly digest", desc: "Summary of your content output every Monday" },
              { id: "product_updates", label: "Product updates", desc: "New features and improvements" },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.id !== "weekly_digest"} />
              </div>
            ))}
          </section>
        )}

        {activeTab === "security" && (
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-6 space-y-5">
            <h2 className="text-base font-semibold">Security</h2>
            <div className="space-y-3">
              {[
                { label: "Change password", desc: "Update your login password", href: "/forgot-password" },
                { label: "Two-factor authentication", desc: "Add an extra layer of security", href: "#" },
                { label: "Connected accounts", desc: "Google, GitHub, and other sign-in methods", href: "#" },
                { label: "Active sessions", desc: "Manage where you're signed in", href: "#" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] hover:bg-[var(--surface)] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {activeTab === "billing" && (
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-6 space-y-5">
            <h2 className="text-base font-semibold">Billing & Plan</h2>
            <div className="rounded-xl border border-[var(--brand-blue)]/30 bg-[var(--brand-blue)]/5 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold capitalize">{dbUser?.plan ?? "Starter"} Plan</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {dbUser?.credits?.toLocaleString() ?? 0} / {dbUser?.credits_limit?.toLocaleString() ?? "5,000"} credits remaining
                </p>
              </div>
              <Button asChild size="sm">
                <Link href="/upgrade">Upgrade</Link>
              </Button>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Full billing portal and invoice history coming soon via Stripe.
            </p>
          </section>
        )}

        {activeTab === "appearance" && (
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-6 space-y-5">
            <h2 className="text-base font-semibold">Appearance</h2>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Dark mode</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Theme is controlled by your system preference. Manual override coming soon.
                </p>
              </div>
              <Switch disabled defaultChecked />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
