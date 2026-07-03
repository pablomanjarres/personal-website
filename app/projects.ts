// Portfolio project registry. The index at /portfolio and the case-study pages
// at /portfolio/projects/[slug] are both driven entirely by this file (the
// established authoring pattern here, a typed data module sibling to socials.ts).
//
// Generated from repo-grounded analysis of each project, then curated by hand
// for order + framing. Edit freely: add/remove an entry to add/remove a project.

export type ProjectLinkKind = "live" | "repo" | "demo" | "video" | "docs";
export type ProjectStatus = "live" | "shipped" | "wip" | "prototype" | "archived";

export type ProjectLink = {
  label: string;
  url: string;
  kind: ProjectLinkKind;
};

export type Project = {
  slug: string;
  num: string; // catalog number, e.g. "01"
  title: string;
  tagline: string; // one vivid line
  oneLiner: string; // short line for the grid card
  year: string;
  status: ProjectStatus;
  role: string;
  tags: string[];
  stack: string[];
  summary: string; // the "normal readme" — 1-2 short paragraphs
  problem: string;
  highlights: string[];
  metrics?: string[];
  links: ProjectLink[];
  cover?: string; // /portfolio/covers/<slug>.ext or a remote URL
  featured?: boolean; // flagship — larger card + live-product CTA
  external?: string; // its own live domain, when applicable
  accent?: string; // optional per-project accent hex
};

export const projects: Project[] = [
  {
    "slug": "noelle",
    "num": "01",
    "title": "Noelle",
    "tagline": "An AI team, org-charted like a real company. The agents do the legwork; nothing ships without your approval.",
    "oneLiner": "Hire AI agents, org-charted like a real company",
    "year": "2026",
    "status": "live",
    "role": "Solo · design + engineering",
    "tags": [
      "AI agents",
      "multi-agent",
      "RAG",
      "human-in-the-loop",
      "social automation",
      "monorepo"
    ],
    "stack": [
      "TypeScript",
      "Next.js 16",
      "React 19",
      "Astro",
      "Hono",
      "Node 22",
      "Cloud SQL Postgres 16",
      "Supabase Auth",
      "Turborepo",
      "pnpm",
      "Zod",
      "Tailwind CSS v4",
      "Apify",
      "Codex / Vertex / Bedrock",
      "GCP",
      "Vercel"
    ],
    "summary": "Noelle is a dashboard where a small team hires AI agents arranged as a company org chart. A CEO sits at the top, leads under it, specialists under them. The specialists actually work. Vega watches X, finds people worth replying to, and writes drafts. Lyra does the same for LinkedIn connections. Orion watches subreddits. Nova tears down Instagram and TikTok videos and scripts new ones. None of them post. Each one queues a draft and waits for a human to approve it.\n\nUnder the hood it is a real backend, not a prompt wrapper. Workers run in stages (discover, profile, classify, draft, send) on a personal VM and write to Postgres. Drafts are grounded in a retrieval layer built from the operator's own writing so they sound like a person, and a verifier pass strips the tells that make text read as AI. A self-host CLI stands the whole system up on your own machine against a local database.",
    "problem": "Growing an audience by replying to the right people works, but it eats hours. The lazy fix is to point an LLM at your mentions, and it produces obvious slop that gets ignored or gets the account flagged. Noelle keeps a human on the approve button while agents handle discovery, research, and the first draft, and it spends most of its effort making those drafts not read like a bot.",
    "highlights": [
      "Four draft-only agents built from one shared pipeline: Vega on X, Lyra on LinkedIn, Orion on Reddit, Nova on Instagram and TikTok. Each runs the same stages (discover, profile, classify, draft) and then waits for human approval. Only the X agent has a send path, and it's gated; the rest never post.",
      "A multi-stage worker pool (discovery, classifier, drafter, profiler, ideation, send) runs as systemd template instances on a single VM and claims work from Postgres with SKIP LOCKED, so the pool can scale out or move to a managed runtime without changing the work-claim contract.",
      "Grounded drafting: a hybrid retrieval layer (BM25 plus dense voyage-context-4 vectors) pulls voice anchors from the operator's own writing, a vision model captions attached images, and a post-draft verifier judges the result and hard-zeros AI tells like em dashes and forced enthusiasm.",
      "One model router fronts six LLM backends. Codex (gpt-5 via ChatGPT OAuth) is primary; Bedrock Claude, Vertex (Claude and Gemini), direct Anthropic, a Gemini-key backend, and a local claude-cli path that bills a Claude subscription instead of per-token are the fallbacks. Every call is spend-capped by a budget bucket.",
      "Split-cloud design: Supabase issues the auth JWT, all product data lives in Cloud SQL Postgres 16 across 88 versioned SQL migrations, and since there is no row-level security, every server path calls assertOrgMember to enforce tenancy in application code.",
      "Reads run through Apify scraper actors with no login cookies, so discovery can't get the operator's account locked. The X write path is isolated behind rate-limited posting cookies and its own account-safety playbook."
    ],
    "metrics": [
      "2,125 commits since May 2026",
      "6 agent types, 4 draft-only agents",
      "88 versioned SQL migrations",
      "6 LLM backends behind one router"
    ],
    "links": [
      {
        "label": "trynoelle.com",
        "url": "https://trynoelle.com",
        "kind": "live"
      },
      {
        "label": "GitHub",
        "url": "https://github.com/nella-labs/noelle",
        "kind": "repo"
      }
    ],
    "cover": "/portfolio/covers/noelle.png",
    "featured": true
  },
  {
    "slug": "nella",
    "num": "02",
    "title": "Nella",
    "tagline": "The grounding and memory layer that stops AI coding agents from making things up.",
    "oneLiner": "Codebase intelligence for AI coding agents.",
    "year": "2026",
    "status": "live",
    "role": "Solo · design + engineering",
    "tags": [
      "MCP",
      "AI coding agents",
      "RAG",
      "code intelligence",
      "dev tool",
      "multi-agent"
    ],
    "stack": [
      "TypeScript",
      "Node.js",
      "pnpm workspaces",
      "Model Context Protocol (MCP)",
      "Express",
      "usearch (vector index)",
      "BM25 via natural",
      "@typescript-eslint/typescript-estree (AST)",
      "Voyage AI voyage-code-3 embeddings",
      "PostgreSQL / Cloud SQL",
      "Supabase Auth",
      "Redis + BullMQ",
      "GCP Cloud Run + Cloud Storage",
      "Zod"
    ],
    "summary": "Nella sits between an AI coding agent and your repo. Instead of letting the model guess from training data, it indexes the real codebase: AST-chunked, with a semantic vector index and a BM25 lexical index built from a single chunk pass. The agent searches actual code and gets back file paths, line ranges, and confidence scores. On top of retrieval, Nella keeps a persistent memory: typed assumptions that auto-invalidate when the file they depend on changes, a change ledger, and dependency-drift detection, all surviving across sessions in a local `.nella/` directory.\n\nIt ships as three surfaces over one core: an MCP server, a CLI, and an embeddable library. That means it plugs into Claude Code, Cursor, or any MCP-compatible agent without lock-in. Parallel agents can register, claim tasks, and record decisions against shared state, with a challenge-response heartbeat keeping the trust chain intact. A companion benchmark package red-teams agents on capability and safety, including multi-turn prompt-injection scenarios. The hosted MCP runs on GCP Cloud Run behind mcp.getnella.dev.",
    "problem": "LLM coding agents don't have a memory problem so much as a grounding problem: they invent imports, forget decisions they made five turns ago, and act on stale assumptions about a schema that changed an hour ago. Bigger context windows just let them hallucinate more confidently.",
    "highlights": [
      "AST-chunked hybrid index. A semantic vector index (Voyage voyage-code-3) and a BM25 lexical index build from one chunk pass, with hybrid, semantic, and lexical query modes plus per-result confidence scores. The agent searches the real repo instead of guessing from training data.",
      "Persistent memory across sessions: a typed assumption ledger that auto-invalidates when a watched file changes, a change ledger, and dependency-drift snapshots over package.json and the lockfile. Catches contradictions before broken code ships.",
      "Multi-agent coordination over MCP. Parallel agents register, claim tasks, record decisions, and get conflict checks against shared state. A challenge-response heartbeat verifies session continuity between tool calls.",
      "Prompt-injection backstop. An injection scorer rates each indexed chunk for risk and flags suspicious repo content, so hidden instructions in code or comments can't quietly hijack the agent.",
      "Companion benchmark suite grades agents (Claude Sonnet, Opus, GPT-4o) on capability and safety: build and test pass, constraint violations, scope creep, and cost. It retries failed tasks with error feedback and renders an HTML comparison dashboard.",
      "Three surfaces over one core: an MCP server, a CLI, and the embeddable @usenella/core library. Agent-agnostic, deployed on GCP Cloud Run and Cloud SQL, with a hosted MCP at mcp.getnella.dev."
    ],
    "metrics": [
      "@getnella/mcp v0.2.7 published to npm",
      "4-package pnpm workspaces monorepo (core, MCP/CLI, REST API, benchmark)",
      "225 TypeScript source files, 57 test files",
      "Rate limiting: 2 algorithms (sliding-window, token-bucket) x 3 backends (memory, Redis, SQLite)"
    ],
    "links": [
      {
        "label": "getnella.dev",
        "url": "https://getnella.dev",
        "kind": "live"
      },
      {
        "label": "GitHub",
        "url": "https://github.com/nella-labs/nella",
        "kind": "repo"
      },
      {
        "label": "Docs",
        "url": "https://docs.getnella.dev",
        "kind": "docs"
      }
    ],
    "cover": "/portfolio/covers/nella.png",
    "featured": true
  },
  {
    "slug": "cortex",
    "num": "03",
    "title": "Cortex",
    "tagline": "A private, encrypted desktop app for auditing your days as a founder, student, and human. Claude can read and write all of it.",
    "oneLiner": "Local-first personal dashboard with a 51-tool MCP",
    "year": "2026",
    "status": "shipped",
    "role": "Solo · design + engineering",
    "tags": [
      "desktop app",
      "MCP",
      "local-first",
      "personal dashboard",
      "encryption",
      "automation"
    ],
    "stack": [
      "React 19",
      "TypeScript 5.9",
      "Electron 41",
      "Vite 8",
      "Tailwind CSS v4",
      "shadcn/ui",
      "Recharts",
      "Zustand",
      "Model Context Protocol SDK",
      "Node.js",
      "launchd",
      "Supabase"
    ],
    "summary": "Cortex is a macOS desktop app that pulls a founder's whole life into one private dashboard: habits, sprints, reading, CRM, calendar, coursework, finances, go-to-market state, and live founder metrics (GitHub commits, Lemon Squeezy MRR, Vercel deploys, Supabase signups). Everything is stored locally and encrypted at rest with AES-256-GCM, with the master key held in the macOS Keychain. A built-in web server on port 3456 makes the same dashboard reachable from a phone over Tailscale as a PWA.\n\nThe interesting part is the seam to AI. Cortex ships a Model Context Protocol server with 51 tools across 18 groups that proxies the app's local API, so Claude can read and write habits, journal entries, contacts, calendar events, and founder metrics directly. On top of that sits Opportunity Radar, a scheduled, prompt-injection-safe pipeline that scrapes social feeds on a VM, has a tool-less LLM classify and score them against an editable profile, then ingests the survivors into the dashboard with identity-level dedup. It is a personal tool built to production standards, not a demo.",
    "problem": "Founders and students juggle habits, revenue, deploys, coursework, contacts, and a firehose of opportunities across a dozen disconnected tools, with no single private place to see and audit it all. Cortex is a local-first, encrypted desktop dashboard that unifies those signals and exposes them to an AI agent.",
    "highlights": [
      "Encrypts every data file at rest with AES-256-GCM in a custom binary container (4-byte magic, 2-byte version, per-write 12-byte IV, 16-byte GCM auth tag). The 32-byte master key is sealed with Electron safeStorage (Keychain-backed on macOS), and a one-time migration rewrites any plaintext JSON to ciphertext behind a sentinel guard.",
      "Ships a 51-tool Model Context Protocol server (18 groups: habits, books, CRM, calendar, GTM, finance, Obsidian vault, founder metrics) that proxies the app's localhost:3456 API, so Claude can read and write real data. Runs over stdio by default, with an optional --http transport for Tailscale access.",
      "Three-tier persistence hook: Electron IPC to encrypted JSON, then the HTTP web API, then localStorage, with size-adaptive debounce (150/500/1000ms) and batched queueMicrotask writes. The web server socket is IP-gated to localhost and the Tailscale CGNAT range (100.64.0.0/10).",
      "Opportunity Radar: a launchd-scheduled pipeline that scrapes feeds on a Lima VM, then classifies and scores them with a tool-less `claude -p` call. Untrusted scraped text is fenced as data and the model can run no tools, so a prompt-injected post can't escalate. Survivors are deduped by normalized apply-URL, title, and host across X, Reddit, and Devpost.",
      "A KeepAlive watcher daemon turns a 'Run radar' button press into a full pipeline run by polling a runStatus flag over the HTTP API every 5 seconds. It is decoupled from Electron and self-heals stale runs after 45 minutes, so it needs zero app-code changes.",
      "Bridges founder integrations (GitHub commits, Lemon Squeezy MRR, Vercel deploys, Supabase signups) and an Obsidian journal vault into a weekly-audit rollup, surfaced in both the UI and over MCP."
    ],
    "metrics": [
      "51 MCP tools across 18 groups",
      "20 feature modules",
      "~21,000 lines of TypeScript",
      "126 commits, solo, over ~3.5 months"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/pablomanjarres/cortex",
        "kind": "repo"
      }
    ]
  },
  {
    "slug": "band-of-agents",
    "num": "04",
    "title": "Band of Agents",
    "tagline": "One campaign, every market's rulebook, cleared by a room of agents that argue the conflicts out.",
    "oneLiner": "Multi-agent marketing-compliance board for global campaigns",
    "year": "2026",
    "status": "shipped",
    "role": "Solo · design + engineering",
    "tags": [
      "multi-agent",
      "AI agents",
      "compliance",
      "band.ai",
      "multimodal",
      "LLM orchestration"
    ],
    "stack": [
      "TypeScript 5.7",
      "Node 22 (ESM)",
      "Hono 4",
      "band.ai SDK",
      "React + Tailwind",
      "Vite",
      "Vitest",
      "Zod",
      "OpenAI SDK (AIML gateway)",
      "Google GenAI / Vertex",
      "AWS Bedrock",
      "Featherless"
    ],
    "summary": "Band Review Board is a compliance war-room staffed by AI agents. A brand drops a whole marketing campaign (a hero video, its cutdown posts, banners, images) into a shared band.ai room, and a cast of specialist agents clears every material against the advertising and regulatory rules of each market it will run in: US FTC, EU health-claim and GDPR rules, LATAM. The agents do not run a checklist in a line. They hold competing mandates and argue. When a claim is legal in the US but a banned health claim in the EU, the region reviewers debate it on the record, holding or conceding their block, and only a genuine deadlock reaches the human. Every verdict traces back to a specific rule and the agent that raised it.\n\nBuilt solo for the Band of Agents hackathon, it ships two orchestration shapes: a pods cast of up to 17 agents on a deterministic decision spine (a compact 10-agent subset connects to the live band.ai room to fit its agent cap), and a lighter classic coordinator/reconcile cast. A multi-model routing layer runs each agent on the model that fits its job, and a multimodal pre-pass watches the video and reads the audio before any reviewer sees the asset. A Hono + SSE backend streams the whole negotiation into a React console.",
    "problem": "A single asset sold into several markets carries stacked, parallel legal liability, because each jurisdiction sets its own rules, ceilings, and required disclosures. Miss one cross-border conflict and the downside is real: GDPR fines reach 20M euro or 4% of global turnover, the UK's DMCC Act up to 10%, US FTC penalties per violation. Band Review Board surfaces the exact conflict a lone legal team misses and proves every call with an audit trail.",
    "highlights": [
      "Real agent-to-agent debate, not a merged checklist: when two region reviewers split on a claim (one blocks the span, another clears it), the Reg Lead runs a one-round rebuttal where each blocking region holds or concedes on the record. A conceded block drops to a warning; a held block is logged as a conflict (hold/concede stance schema in pod-region-reviewer.ts, wired through pod-lead.ts).",
      "Two orchestration topologies coexist: a pods cast (Claims / Regulatory / Brand pods on a deterministic decision spine, 17 agents at full size) and a lighter classic cast (coordinator to region/brand reviewers to reconcile). The live band.ai room runs a compact 10-agent variant of the pods cast to fit the room's agent cap, keeping the Regulatory pod's full US/EU/LATAM debate.",
      "The orchestration spine is deterministic on purpose: the Conductor, pod leads, and Risk Adjudicator call no model, so routing and the terminal verdict (published / spiked / escalated) are auditable rather than left to an LLM.",
      "Multi-model by design: MODEL_MODE (aiml | dev | vertex) swaps the whole fleet behind one ModelClient. Each agent runs the family that fits its job (GPT-5, Gemini 2.5 Pro, an open Llama, Claude Haiku/Sonnet/Opus, DeepSeek, and Nano Banana for localized image regen), and MODEL_MODE=vertex runs the entire fleet on one GCP credential.",
      "Multimodal perception pre-pass: one vision model sees each video and image (ffmpeg-sampled keyframes), one Whisper-class model hears the audio, and the resulting text artifacts (description, on-screen text, detected claims, transcript) cascade to every reviewer, even the text-only ones.",
      "Runs end-to-end with zero API keys on an in-process fake band.ai transport, covered by 53 Vitest files. A Hono + SSE backend streams the negotiation into a React/Tailwind console with a live material x region verdict matrix."
    ],
    "metrics": [
      "17-agent full pods cast (+ 1 human)",
      "10-agent compact cast for the live band.ai room",
      "53 Vitest test files",
      "3 model-routing modes (aiml / dev / vertex)",
      "3 regional rulebooks (US / EU / LATAM)",
      "3 input modalities (text, image, audio)"
    ],
    "links": [
      {
        "label": "GitHub repo",
        "url": "https://github.com/pablomanjarres/Band-Of-Agents",
        "kind": "repo"
      },
      {
        "label": "Hosted demo",
        "url": "https://artifact-viewer-one.vercel.app",
        "kind": "live"
      }
    ]
  },
  {
    "slug": "content-pipeline",
    "num": "05",
    "title": "Content Pipeline",
    "tagline": "Every platform, every draft, every lead — one local-first desktop app that never phones home.",
    "oneLiner": "Local-first content and outreach command center for a founder",
    "year": "2026",
    "status": "shipped",
    "role": "Solo · design + engineering",
    "tags": [
      "local-first",
      "desktop app",
      "content ops",
      "agent memory",
      "outreach engine",
      "RAG"
    ],
    "stack": [
      "React 19",
      "Electron 41",
      "Express 5",
      "TypeScript 5.9",
      "Tailwind CSS 4",
      "Vite 8",
      "Framer Motion",
      "Supabase",
      "Algolia",
      "Tailscale"
    ],
    "summary": "Content Pipeline is the private command center I run my entire content operation from. It tracks short-form video and text posts through their full lifecycle across seven platforms, runs outbound on X, and stages a shipped feature as platform-native posts plus a video, all grounded in my writing voice from an Obsidian vault and a per-lead memory of everyone I've talked to. It ships as a macOS menu-bar app with an Express server running in-process, and every byte of pipeline data is JSON on my disk.\n\nThe drafting itself is done by my own agents (Claude Code skills and a worker VM) that read this app's memory and write candidates back into it. Content Pipeline is the system of record around them: the memory store, the grading and per-platform rate caps, the approval queue, the two-way vault sync, and the Ops page where I start and stop the VM. Off-the-shelf tools are cloud silos that flatten your voice and want your data on their servers. This one is the opposite: local-first, voice-anchored, and wired into the tools I already use.",
    "problem": "A solo founder ships daily and has to turn that work into content across seven platforms while running outbound on X. The SaaS tools for it are cloud silos that flatten your voice into slop and don't know your codebase, your writing, or the people you've already messaged. Content Pipeline keeps all of it on one machine, grounded in a real writing voice and a memory of every lead.",
    "highlights": [
      "Outbound pipeline for X: reply, DM, and repost candidates arrive in three angles (empathetic, technical, contrarian), ranked by quality score and tier (T1-T3), with a per-platform active-queue cap that returns 429 and fires a Pushover alert when a bucket fills.",
      "Per-lead memory store: a markdown CRM vault (leads, entities, insights, self-context) that round-trips my manual edits and serves /api/memory/context to the drafter, so every reply remembers who I've already talked to.",
      "Voice-post fan-out: a feature description resolves to voice anchors from my Obsidian vault, then a run captures platform-native posts, a Forge video task, and a short-video script.",
      "Two-way Obsidian sync writes posts, videos, and runs back to the Mars vault and captures my manual edits into voice-anchors/edits.md, so the drafter learns my corrections over time.",
      "Viral intelligence parses a tracked-creator watchlist, syncs it to Supabase, and pulls scored recent viral posts to shape script structure, never the wording.",
      "Local-first by default: all state is JSON on disk (atomic .tmp + rename), the server answers only localhost and Tailscale (403 to everything else), and it ships as an in-process Electron menu-bar app with live tray stats."
    ],
    "metrics": [
      "7 content platforms across video and text",
      "19 dashboard views in one React SPA",
      "29 REST route-group namespaces",
      "~6,700 lines of server-side TypeScript"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/pablomanjarres/content-pipeline",
        "kind": "repo"
      }
    ]
  },
  {
    "slug": "forge",
    "num": "06",
    "title": "Forge",
    "tagline": "A menu-bar control room for AI media, coding agents, and Remotion renders.",
    "oneLiner": "AI media and agent orchestration in a macOS menu bar",
    "year": "2026",
    "status": "shipped",
    "role": "Solo · design + engineering",
    "tags": [
      "AI orchestration",
      "desktop app",
      "MCP",
      "media generation",
      "Remotion",
      "Electron"
    ],
    "stack": [
      "TypeScript 5.9",
      "React 19",
      "Electron 41",
      "Vite 8",
      "Express 5",
      "Remotion",
      "Google Gemini (@google/genai)",
      "Tailwind 4",
      "WebSocket (ws)",
      "shadcn / base-ui",
      "simple-git"
    ],
    "summary": "Forge is a native macOS desktop app Pablo built as a personal AI orchestration center: one surface for generating media, running coding agents, and rendering demo videos. Instead of tab-hopping between provider dashboards and CLIs, everything runs through an Electron shell that spawns a local Express backend and streams progress to a React UI over WebSocket. It lives in the menu-bar tray and auto-launches hidden at login.\n\nThe centerpiece is the AI-to-Remotion pipeline. Describe a video in plain English and Forge asks Gemini for a schema-constrained component, writes a self-contained .tsx with an isolated entry that registers only that one composition, runs `remotion render`, and streams the log back to the UI without ever touching the source project's Root.tsx. Forge also mirrors its powers as an MCP server, so Claude or any agent can generate images, video, and voice, read repos, and manage templates headlessly. API keys never hit disk in plaintext: they are encrypted at rest with Electron safeStorage, with env fallbacks for headless dev.",
    "problem": "Producing AI media and demo videos means juggling provider dashboards, CLI tools, and one-off render scripts. Forge collapses that into a single macOS app: generate images, voice, and video, drive coding agents, and render Remotion demos from one window. Agents can reach the same media and repo tools over MCP.",
    "highlights": [
      "AI-to-Remotion pipeline: a plain-English prompt becomes a JSON-schema-constrained Gemini component, written to a self-contained .tsx plus an isolated entry that registers only that one composition, then rendered with `npx remotion render` and streamed to the UI. The source project's Root.tsx is never mutated.",
      "Built-in MCP server (JSON-RPC over stdio) exposing 11 tools so Claude or any agent can drive Forge headlessly: generate image, video, and voice, list and read managed repos, and list, create, and browse templates and media. (Image edit, upscale, and template-run are declared but still stubbed on the MCP surface.)",
      "Four provider backends behind one surface: Gemini for image/video/speech/chat, ElevenLabs for voice, RunPod serverless GPU for Qwen-Edit / RealESRGAN / Qwen3-TTS, and the OpenAI Codex CLI run as a subprocess agent (`codex exec --json`).",
      "Per-purpose Gemini key routing: a pool of named API keys where image, video, audio, chat, and agentTasks each pin to their own key and model, resolved at call time.",
      "Live task and render streaming over WebSocket: agent output and Remotion render logs are pushed as they happen, each message tagged with its taskId so the UI can follow a specific run.",
      "Native macOS shell: a menu-bar tray app that spawns the Express backend as a child process via ELECTRON_RUN_AS_NODE and encrypts every API key at rest with Electron safeStorage instead of writing secrets to config."
    ],
    "metrics": [
      "11 MCP tools (JSON-RPC over stdio)",
      "4 provider backends (Gemini, ElevenLabs, RunPod GPU, Codex CLI)",
      "60+ REST endpoints",
      "12-section desktop UI"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/pablomanjarres/forge",
        "kind": "repo"
      }
    ]
  },
  {
    "slug": "archgraph",
    "num": "07",
    "title": "Archgraph",
    "tagline": "Point an AI agent at a repo, get a C4 architecture diagram that's actually true.",
    "oneLiner": "AI-generated C4 architecture diagrams from any codebase",
    "year": "2026",
    "status": "shipped",
    "role": "Solo · design + engineering",
    "tags": [
      "dev tool",
      "AI agents",
      "C4 model",
      "code visualization",
      "Claude Code skill",
      "architecture-as-code"
    ],
    "stack": [
      "React 19",
      "TypeScript 5.7",
      "ReactFlow 12 (@xyflow/react)",
      "ELK.js",
      "Zustand 5",
      "Tailwind CSS v4",
      "Vite 6",
      "React Router 7",
      "Node CLI"
    ],
    "summary": "Archgraph turns a codebase into an architecture diagram you don't have to draw. Run the `/graph` skill in Claude Code and it reads the repo: package manifests, external service integrations, data flows, and who-calls-whom. It writes a structured C4 model of the actors, systems, apps, data stores, and the connections between them. A dark-mode web viewer renders that model as an interactive graph with ELK auto-layout, two C4 levels (Context and Container), and a detail panel for every node.\n\nIt's an open-source take on IcePanel with one difference: nobody draws the diagram. The model is generated from the code and regenerated whenever the code changes, so the picture stays honest instead of rotting. It ships as a web app and a small `archgraph serve` CLI, and has already mapped real projects. Running it on Nella produced 20 objects and 35 connections.",
    "problem": "Architecture diagrams rot. You draw one in Lucidchart or IcePanel, the code moves on, and six months later the picture is a lie nobody trusts. Archgraph makes the diagram something you regenerate from the actual code with an AI agent, instead of a document you keep patching by hand.",
    "highlights": [
      "The `/graph` Claude Code skill fans out 4 parallel research agents (systems, external services and stores, data flows, actors and user flows) and synthesizes one schema-conforming C4 model JSON, validating that every connection and diagram references a real object ID",
      "Renders the model on an interactive ReactFlow canvas with ELK layered auto-layout: hierarchical group nesting via INCLUDE_CHILDREN, animated edges for async and event connections, and a selector that switches between C4 Context (L1) and Container (L2) diagrams",
      "Ships as a web viewer plus an `archgraph serve` CLI that boots a Vite dev server against any project's `.archgraph/model.json`, with `--model` for a custom path (e.g. Nella's `.nella/graph/model.json`) and `--port`",
      "Live-reloads in dev: a 2s poll of the model file diffs its JSON and redraws the graph, so regenerating the model updates the diagram with no manual refresh",
      "Typed C4 data model (actor, system, app, store, component, plus connections, groups, technologies, and ordered flows) validated on load; the detail panel shows each object's scope, status, tech, links, and both directions of its connections",
      "Multi-project index: drop a model under `public/models/<id>/`, register it in `projects.json`, and it appears on the project picker at its own `/<id>` route"
    ],
    "metrics": [
      "5 C4 object types: actor, system, app, store, component",
      "4 parallel research agents per /graph run",
      "Nella mapped to 20 objects and 35 connections (5 groups, 4 flows)",
      "2s model-file poll for live reload in dev"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/pablomanjarresneg/archgraph",
        "kind": "repo"
      }
    ]
  },
  {
    "slug": "omegahack",
    "num": "08",
    "title": "OmegaHack · CAROL",
    "tagline": "CAROL: a pipeline of agents that receives, de-identifies, classifies, and legally clocks a city hall's citizen complaints.",
    "oneLiner": "Multi-agent PQRSD platform for Colombian city halls",
    "year": "2026",
    "status": "prototype",
    "role": "Lead · design + engineering (2-person hackathon team)",
    "tags": [
      "multi-agent",
      "govtech",
      "LLM classification",
      "RAG",
      "legal-compliance",
      "monorepo"
    ],
    "stack": [
      "TypeScript",
      "Turborepo",
      "Next.js 14",
      "React 19 / 18",
      "Vite + TanStack Router",
      "Supabase (Postgres + pgvector + RLS)",
      "Deno edge functions",
      "Claude (Anthropic)",
      "Tailwind CSS",
      "Leaflet",
      "Recharts",
      "Vitest + fast-check"
    ],
    "summary": "In Colombia, any citizen can file a PQRSD (a petition, complaint, claim, suggestion, or report) and the government has a fixed number of business days to answer. City halls receive thousands of these across email, web forms, and spreadsheets, misroute them, and blow the legal deadlines, which turns into lawsuits. CAROL is the system that catches each complaint the moment it arrives, strips out personal data, works out what it is and who should handle it, and starts the legal clock.\n\nIt was built as a hackathon submission for the 2026 Alcaldía de Medellín challenge, but the engineering is real: a Turborepo monorepo with a public citizen portal, an internal legal-review queue, a per-secretaría dashboard, and a public transparency site, all sitting on one multi-tenant Postgres with row-level security. The hard part is the law. A dependency-free deadline engine encodes Colombian business days, movable holidays, and the extension rules of Ley 1755/2015, and it ships with 407 tests at 100% line coverage.",
    "problem": "Colombian public entities must answer every citizen PQRSD within strict business-day deadlines (Ley 1755/2015) while protecting personal data (Ley 1581/2012). City halls receive these complaints as unstructured text across many channels, misroute them, and miss deadlines, which exposes them to tutela lawsuits.",
    "highlights": [
      "Dependency-free legal deadline engine: Colombian business days, Ley Emiliani movable holidays, Easter-derived dates, per-tenant suspensions, and the Ley 1755/2015 'extension cannot exceed 2x the original term' rule. 407 tests at 100% line coverage, including a 10,000-iteration property test via fast-check.",
      "Eight-stage intake agent per complaint: schema validation, a SHA-256 source_hash for idempotent dedup, Claude classification, format-preserving PII redaction into raw/display/llm text, a validity check with municipal-competence gates, then auto-summary, tagging, and problem-group clustering. The run emits a structured intake event; a Postgres trigger mirrors every pqr_events row into an append-only audit log.",
      "Claude classifier turns free text into one of 6 PQRSD types, 26 official secretaria codes, a comuna (1-16) or corregimiento, namespaced tags, and auxiliary signals like a 0-1 tutela-risk score.",
      "PII handled by law: every field is classified into four Ley 1581/2012 sensitivity levels (public / semiprivate / private / sensitive) and only the scrubbed llm_text is ever sent to a model.",
      "Public transparency dashboards enforce k-anonymity (k>=5): comuna density maps (Leaflet) and secretaria SLA rankings (Recharts) suppress any bucket with fewer than 5 complaints before it leaves the server.",
      "Tenant isolation lives in the database: every business table carries tenant_id under RLS, and three role-scoped Postgres clients (app_operational / app_qa_reader / service-role) issue SET ROLE on connect."
    ],
    "metrics": [
      "407 tests / 100% line coverage in the deadline engine",
      "10,000-iteration property test (fast-check)",
      "26 official secretaría codes; comunas 1-16 + corregimientos",
      "18 Postgres migrations",
      "k-anonymity k>=5 on public transparency data",
      "4 apps · 11 shared packages · 4 edge functions"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/pablomanjarresneg/omegahack",
        "kind": "repo"
      },
      {
        "label": "Live (CAROL citizen portal)",
        "url": "https://omega-landing-zeta.vercel.app",
        "kind": "live"
      }
    ]
  },
  {
    "slug": "localhost-mirror",
    "num": "09",
    "title": "Localhost Mirror",
    "tagline": "Like ngrok, except the tunnel never leaves your tailnet.",
    "oneLiner": "Expose localhost over Tailscale, from your menu bar",
    "year": "2026",
    "status": "shipped",
    "role": "Solo · design + engineering",
    "tags": [
      "dev tool",
      "networking",
      "Tailscale",
      "reverse proxy",
      "macOS app",
      "CLI"
    ],
    "stack": [
      "TypeScript 5.8",
      "Node.js",
      "Express 5",
      "http-proxy",
      "Commander",
      "Swift 5.9",
      "SwiftUI",
      "Tailscale"
    ],
    "summary": "Localhost Mirror exposes a port running on your machine to your other devices, and only your other devices. It rides on Tailscale, so a dev server on your laptop becomes reachable from your phone, tablet, or another Mac, but never from the public internet. Run `lm expose 3000` and you get a private URL the rest of your tailnet can open.\n\nIt ships as two halves that share one background daemon: a terminal CLI for people who live in the shell, and a native macOS menu-bar app that scans every port your machine is listening on, recognizes what is running there (Next.js, Vite, Postgres, Ollama, and dozens more), names the owning project, and exposes any of them from the menu bar. A single-file dashboard, optional per-tunnel tokens, health checks, and a daemon that puts itself to sleep round it out.",
    "problem": "Sharing a local dev server usually means a public tunnel that hands a URL to the entire internet and often wants an account. Localhost Mirror keeps the one-command convenience but scopes access to devices you already own, so the QR-code-on-your-phone workflow never exposes a half-built app to strangers.",
    "highlights": [
      "Tailnet-only by construction: every HTTP request and WebSocket upgrade is CIDR-checked against Tailscale's 100.64.0.0/10 range plus loopback before it reaches a local port, so there is no public listener to discover.",
      "One daemon multiplexes every tunnel on a single port via an lm_tunnel cookie; hitting /<name> or ?tunnel=<port> sets it and proxies you to the right localhost port, WebSockets included.",
      "Native SwiftUI menu-bar app scans listeners with lsof and labels them from 87 known dev ports plus 28 process-name heuristics, then walks up the filesystem for package.json / Cargo.toml / go.mod / .git to name the owning project.",
      "Optional per-tunnel token auth: `lm expose 3000 --token` mints a nanoid that the tunnel URL then requires as ?token=; without it the daemon returns 401.",
      "Live health and resource monitoring: HEAD-pings each target every 10s to flip active/target-down, and the menu bar raises alerts for CPU over 80%, RAM over 500MB, or zombie processes.",
      "Self-managing daemon: auto-starts on the first expose, persists atomic JSON state (temp-file then rename) to ~/.localhost-mirror, and shuts itself down 60s after the last tunnel closes unless run with --persistent."
    ],
    "metrics": [
      "87 dev ports auto-identified",
      "28 runtime process heuristics",
      "10s health checks, 60s idle auto-shutdown",
      "~2,300 LOC across CLI, daemon, and macOS app"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/pablomanjarres/localhost-mirror",
        "kind": "repo"
      }
    ]
  },
  {
    "slug": "lumen-frontier",
    "num": "10",
    "title": "Lumen Frontier",
    "tagline": "Two ways to explore what you know: a drag-and-drop widget OS, and a galaxy of subjects you fly through as an astronaut.",
    "oneLiner": "A widget OS and a 3D universe for learning.",
    "year": "2025",
    "status": "prototype",
    "role": "Solo · design + engineering",
    "tags": [
      "EdTech",
      "3D / WebGL",
      "Widget dashboard",
      "Astro islands",
      "Three.js",
      "Frontend"
    ],
    "stack": [
      "Astro 4",
      "React 18",
      "TypeScript 5",
      "Three.js r180",
      "Tailwind CSS 3",
      "nanostores",
      "Vite",
      "FastAPI (scaffold)",
      "npm workspaces",
      "Vercel"
    ],
    "summary": "Lumen Frontier is the experimental front-end of the Lumen learning project: an attempt to make studying feel like a place instead of a form. One landing page splits into two very different interfaces. **LumenOS** is a desktop-style dashboard where every study tool is a widget you drag, resize, and arrange on an open canvas, with the whole layout saved locally so it comes back exactly how you left it. **Lumenverse** is a first-person 3D space, hand-built in Three.js, where each academic subject is a glowing planet you fly toward as a tethered astronaut, mouse-look and WASD included.\n\nUnder the hood it is an Astro islands app: static HTML by default, React only where things need to be interactive, and nanostores as the shared brain between islands. The widget system is registry-driven and code-split, so each of the thirteen widgets loads as its own chunk on demand. A FastAPI backend is scaffolded for future auth and cross-device sync, but today the app runs entirely in the browser and persists to localStorage.",
    "problem": "Most study apps are a login wrapped around a feature list, and they all feel the same. Lumen Frontier treats the interface itself as the product: knowledge you can lay out like a workspace, or fly through like a solar system, so the act of studying feels less like filling out a form and more like moving through a space you own.",
    "highlights": [
      "One landing page, two full front-ends: a draggable widget \"OS\" (LumenOS) and a first-person 3D knowledge explorer (Lumenverse), each with its own layout and interaction model.",
      "Registry-driven widget system with 13 working widgets (notes, tasks, pomodoro, goals, journal, music, ambience, stats, flashcards, and more), each lazy-loaded into its own chunk via React.lazy + Suspense.",
      "Custom useDrag and useResize hooks give every widget header-drag and corner-resize with per-widget min/max constraints, and the full canvas persists to localStorage with a migration shim that upgrades older saved layouts.",
      "A 985-line hand-written Three.js scene: astronaut POV (gloves, visor, HUD lines), a tethered spaceship, 18 subject planets with layered atmospheric glow, pointer-lock mouse-look, WASD flight, fullscreen immersive mode, and a rocket fly-to animation.",
      "Performance-tuned WebGL: capped device pixel ratio, simplified sphere geometry, shadows disabled, a trimmed 1,000-star field, and Vite manual chunks that split three from the react vendor bundle.",
      "Astro islands architecture with nanostores as the cross-island state bus, an 'Old Money' Tailwind theme (brass, burgundy, cognac, forest, ivory), glassmorphism panels via Tailwind backdrop-blur, and GitHub Actions CI that builds the frontend and lints, types, and tests the backend."
    ],
    "metrics": [
      "13 interactive widgets",
      "18 explorable subject planets",
      "985-line hand-written Three.js scene",
      "~9,200 lines of frontend TS/TSX/Astro"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/pablomanjarres/Lumen-Frontier",
        "kind": "repo"
      }
    ]
  }
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
