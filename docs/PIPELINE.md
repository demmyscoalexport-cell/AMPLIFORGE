# AI Processing Pipeline Plan

Extends `lib/pipeline/process-project.ts` without breaking status polling UX.

---

## Current steps (live)

1. `fetch` — oEmbed / fallback  
2. `transcribe` — Deepgram → captions → template fallback  
3. `insights` — **STUB**  
4. `generate` — Claude → OpenAI → templates (7 types)  
5. `finalize` — done + analytics + email  

Client: `GET /api/v1/projects/[id]/status` every 2s.

---

## Target steps

| Step | Behavior | Phase |
|------|----------|-------|
| fetch | + YouTube Data API (duration, channel) | P0 |
| transcribe | unchanged cascade; optional Whisper only if SLO fails | — |
| insights | real extraction → `project_insights` | P1 |
| generate | kit v1 agents; prompts use insights + brand voice | P2 |
| visualize | Satori render → Storage → `visual_assets` | P3 |
| finalize | + calendar suggestions optional | P6 |

Add `visualize` as step 5 and shift finalize to 6 — update `PROCESSING_STEPS` + processing UI together.

---

## Insights phases (inside step)

1. Structure topics/sections  
2. Extract quotes, stats, frameworks, contrarian angles  
3. Score shareability / platform fit / visual potential  
4. Generate ranked hooks  

Persist JSON matching DATA-MODEL. Retry once if empty.

---

## Generation

- Keep single orchestrator file; split agents into `lib/pipeline/agents/*`
- Parallelize independent types with `Promise.all` where rate limits allow
- Regenerate: whole piece (live) → contextual patch (P4)
- Quality gate: lightweight rubric; regenerate once under threshold (optional P2)

---

## Providers

| Role | Primary | Fallback | Deferred |
|------|---------|----------|----------|
| LLM | Claude Opus | OpenAI mini | Gemini/Llama |
| STT | Deepgram | Captions | Whisper/Assembly |
| Vision | — | OpenAI vision P1 optional | — |
| Images | Satori templates | — | Stability/DALL·E |

---

## Guardrails

- Never skip credit deduction on create  
- Always update `processing_jobs` per step  
- Fail → `projects.status = failed` + clear error  
- No new deps in pipeline during E0–E2 UI-only work  
