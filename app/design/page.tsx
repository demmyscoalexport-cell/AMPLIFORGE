import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { primitive } from "@/lib/design/tokens";

export const metadata: Metadata = { title: "Design System" };

const RAMPS = ["blue", "purple", "crimson", "gold", "neutral"] as const;

const SEMANTIC_GROUPS: { title: string; tokens: { label: string; varName: string }[] }[] = [
  {
    title: "Surface",
    tokens: [
      { label: "bg-base", varName: "--surface-bg-base" },
      { label: "bg-secondary", varName: "--surface-bg-secondary" },
      { label: "elevated", varName: "--surface-elevated" },
      { label: "surface", varName: "--surface" },
    ],
  },
  {
    title: "Brand",
    tokens: [
      { label: "primary", varName: "--brand-primary" },
      { label: "secondary", varName: "--brand-secondary" },
      { label: "accent", varName: "--brand-accent" },
      { label: "premium", varName: "--brand-premium" },
    ],
  },
  {
    title: "Status",
    tokens: [
      { label: "success", varName: "--status-success" },
      { label: "warning", varName: "--status-warning" },
      { label: "danger", varName: "--status-danger" },
      { label: "info", varName: "--status-info" },
      { label: "processing", varName: "--status-processing" },
    ],
  },
  {
    title: "Border",
    tokens: [
      { label: "default", varName: "--border" },
      { label: "subtle", varName: "--border-subtle" },
      { label: "strong", varName: "--border-strong" },
    ],
  },
];

const TYPE_SAMPLES = [
  { cls: "text-display", label: "Display / 72" },
  { cls: "text-h1", label: "Heading 1 / 56" },
  { cls: "text-h2", label: "Heading 2 / 40" },
  { cls: "text-h3", label: "Heading 3 / 32" },
  { cls: "text-body-lg", label: "Body large / 18" },
  { cls: "text-caption", label: "Caption / 12" },
];

function Section({ id, title, subtitle, children }: { id: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[var(--border-subtle)] py-12">
      <h2 className="text-h3">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-bg-base)]">
      <header className="sticky top-0 z-10 glass-strong border-b border-[var(--border)]">
        <div className="container-page flex h-[var(--nav-height)] items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <Badge variant="brand">Design System</Badge>
          </div>
          <span className="text-xs text-[var(--text-muted)]">Phase 0 · tokens + primitives</span>
        </div>
      </header>

      <main className="container-page pb-24">
        <div className="py-12">
          <h1 className="text-h1">AmpliForge Design System</h1>
          <p className="mt-3 max-w-2xl text-body-lg text-[var(--text-secondary)]">
            The living reference for the 3-tier token architecture (primitive → semantic → component)
            and the core component library. Dark-first, WCAG-minded, Tailwind v4.
          </p>
        </div>

        {/* PRIMITIVES — color ramps */}
        <Section id="color" title="Color primitives" subtitle="Reference ramps 50–950. Never used directly by components.">
          <div className="space-y-6">
            {RAMPS.map((ramp) => (
              <div key={ramp}>
                <p className="mb-2 text-caption text-[var(--text-muted)]">{ramp}</p>
                <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
                  {Object.entries(primitive.color[ramp]).map(([step, hex]) => (
                    <div key={step} className="space-y-1">
                      <div
                        className="h-12 w-full rounded-lg border border-[var(--border-subtle)]"
                        style={{ background: hex as string }}
                      />
                      <div className="text-[10px] text-[var(--text-muted)]">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* SEMANTIC swatches */}
        <Section id="semantic" title="Semantic tokens" subtitle="Intent-based aliases (theme-aware). Components consume these.">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SEMANTIC_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="mb-3 text-caption text-[var(--text-muted)]">{group.title}</p>
                <div className="space-y-2">
                  {group.tokens.map((t) => (
                    <div key={t.varName} className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 shrink-0 rounded-md border border-[var(--border-subtle)]"
                        style={{ background: `var(${t.varName})` }}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm text-[var(--text-primary)]">{t.label}</div>
                        <div className="truncate font-mono text-[10px] text-[var(--text-muted)]">{t.varName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* TYPOGRAPHY */}
        <Section id="type" title="Typography" subtitle="Fluid scale via clamp(); Geist Sans.">
          <div className="space-y-5">
            {TYPE_SAMPLES.map((t) => (
              <div key={t.cls} className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-baseline sm:justify-between">
                <span className={t.cls}>The quick brown fox</span>
                <span className="font-mono text-xs text-[var(--text-muted)]">.{t.cls}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* RADIUS + ELEVATION */}
        <Section id="radius" title="Radius & elevation" subtitle="Shape and depth scales.">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-wrap gap-4">
              {(["sm", "md", "lg", "xl"] as const).map((r) => (
                <div key={r} className="text-center">
                  <div
                    className="h-20 w-20 border border-[var(--border)] bg-[var(--surface-elevated)]"
                    style={{ borderRadius: `var(--radius-${r})` }}
                  />
                  <div className="mt-2 text-xs text-[var(--text-muted)]">radius-{r}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              {([
                { c: "shadow-card", l: "card (md)" },
                { c: "shadow-card-lg", l: "card-lg" },
                { c: "glow-blue", l: "glow-blue" },
                { c: "glow-gold", l: "glow-gold" },
              ] as const).map((s) => (
                <div key={s.c} className="text-center">
                  <div className={`h-20 w-20 rounded-2xl bg-[var(--surface-elevated)] ${s.c}`} />
                  <div className="mt-2 text-xs text-[var(--text-muted)]">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* COMPONENTS */}
        <Section id="buttons" title="Button" subtitle="Token-driven variants, sizes, and states.">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="gold">Gold</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="link">Link</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra large</Button>
            </div>
          </div>
        </Section>

        <Section id="badges" title="Badge" subtitle="Status and brand variants.">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Default</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="purple">Purple</Badge>
            <Badge variant="gold">Gold</Badge>
            <Badge variant="crimson">Crimson</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="processing">Processing</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="gradient">Gradient</Badge>
          </div>
        </Section>

        <Section id="forms" title="Input & progress">
          <div className="grid max-w-2xl gap-6">
            <div className="space-y-2">
              <Input placeholder="Default input…" />
              <Input placeholder="Disabled input…" disabled />
            </div>
            <div className="space-y-3">
              <Progress value={35} />
              <Progress value={72} />
            </div>
          </div>
        </Section>

        <Section id="tabs" title="Tabs & card">
          <div className="grid gap-6 lg:grid-cols-2">
            <Tabs defaultValue="linkedin">
              <TabsList>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                <TabsTrigger value="thread">Thread</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>
              <TabsContent value="linkedin">
                <p className="text-sm text-[var(--text-secondary)]">LinkedIn authority post preview…</p>
              </TabsContent>
              <TabsContent value="thread">
                <p className="text-sm text-[var(--text-secondary)]">X/Twitter thread preview…</p>
              </TabsContent>
              <TabsContent value="email">
                <p className="text-sm text-[var(--text-secondary)]">Email newsletter preview…</p>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Content set ready</CardTitle>
                <CardDescription>7 formats generated from one video.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant="success">Done</Badge>
                  <Badge variant="brand">1 source</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      </main>
    </div>
  );
}
