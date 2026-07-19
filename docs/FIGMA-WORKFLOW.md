# Figma ↔ Cursor Desktop Workflow

This repo is set up so **Cursor Desktop** always has the Ampliforge Figma prompt pack and build plan.

## What to open in Cursor Desktop

1. Clone/open the **AMPLIFORGE** repo
2. Pull latest (`main` or PR branch `cursor/platform-build-docs-7b2d`)
3. Ensure these files exist (agents read them automatically via `AGENTS.md`):

| File | Purpose |
|------|---------|
| `AGENTS.md` | Points agents at docs + Figma workflow |
| `DEVELOPER.md` | Architecture / coding truth |
| `docs/README.md` | Build docs index |
| `docs/FIGMA-DESIGN-AGENT-PROMPTS.md` | **All Figma prompts (S0→12)** |
| `docs/ROADMAP.md` | Implementation phases |
| `docs/ENTERPRISE-UI.md` | Design system track |
| `.cursor/rules/figma-design.mdc` | Cursor rule: serve prompts from the pack |

## Split of work

| You | Cursor |
|-----|--------|
| Figma + Untitled UI + Design Agent | Writes paste-ready prompts |
| Approve frames | Implements approved UI in Next.js |
| Share Figma link | Maps frames → `app/` + `components/` |

## Commands to say in Cursor Desktop chat

- `Next` → paste next Figma prompt from `docs/FIGMA-DESIGN-AGENT-PROMPTS.md`
- `Prompt for [screen]` → custom long prompt
- `Start implementation from handoff` + Figma URL → begin coding

## Figma file expectations

Working file name: **AMPLIFORGE DESIGN** (duplicate of Untitled UI PRO).  
Pages: `00`–`06` + `99 Archive` as listed in the prompt pack.
