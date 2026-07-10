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
  summary: string; // the "normal readme", 1-2 short paragraphs
  problem: string;
  highlights: string[];
  metrics?: string[];
  links: ProjectLink[];
  cover?: string; // preview screenshot: /portfolio/previews/<slug>.ext or a remote URL
  video?: string; // preview video (mp4/webm) shown in place of the cover
  embedUrl?: string; // if the live site allows framing, embed it as an interactive demo
  demoLabel?: string; // URL/text shown in the preview's browser bar (e.g. "trynoelle.com")
  previewKind?: "web" | "app";
  subProjects?: { name: string; kind: string; oneLiner: string }[]; // "app" = desktop screenshot shown in a plain window, not a browser bar
  featured?: boolean; // flagship, larger card + live-product CTA
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
      "Four draft-only agents: Vega on X, Lyra on LinkedIn, Orion on Reddit, Nova on Instagram and TikTok. Vega, Lyra, and Orion run the same stages: discover, profile, classify, and draft a reply. Nova runs a different pipeline, it studies the creators you pick, breaks down why their videos work, and drafts short-form ideas and scripts, not replies. All four queue a draft and wait for a human to approve it. Only the X agent has a send path, and it's gated; the rest never post.",
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
      },
      {
        "label": "Landing page",
        "url": "https://pablomanjarres.com/oss/noelle",
        "kind": "demo"
      }
    ],
    "cover": "/portfolio/previews/noelle.png",
    "featured": true,
    "subProjects": [
      {
        "name": "@noelle/app",
        "kind": "app",
        "oneLiner": "The Next.js dashboard at app.trynoelle.com where you hire agents as an org chart, watch each intern work, and approve every draft before it ships."
      },
      {
        "name": "@noelle/agents",
        "kind": "library",
        "oneLiner": "The agent type registry: YAML manifests plus TS classes that define the CEO, the marketing lead, and the four growth interns, and wire each into the reports-to hierarchy."
      },
      {
        "name": "@noelle/x-intern",
        "kind": "worker",
        "oneLiner": "Vega, the X Growth Intern: a worker pool (discovery, classifier, drafter, send) that finds leads, grades them, and queues on-brand X reply drafts for your approval."
      },
      {
        "name": "@noelle/linkedin-intern",
        "kind": "worker",
        "oneLiner": "Lyra, the draft-only LinkedIn intern that watches your connections' posts, profiles each author, and drafts replies and DMs you send by hand."
      },
      {
        "name": "@noelle/reddit-intern",
        "kind": "worker",
        "oneLiner": "Orion, the draft-only Reddit intern that watches a list of subreddits and drafts on-brand replies to in-ICP threads for your approval."
      },
      {
        "name": "@noelle/video-intern",
        "kind": "worker",
        "oneLiner": "Nova, the draft-only intern that studies the IG and TikTok creators you pick, breaks down why their videos work, and drafts short-form ideas and scripts."
      },
      {
        "name": "@noelle/linkedin-actuator",
        "kind": "extension",
        "oneLiner": "Lyra's hands: a Chrome MV3 extension that carries out approved LinkedIn likes, comments, and DMs through the browser session you already own."
      },
      {
        "name": "@noelle/cli",
        "kind": "cli",
        "oneLiner": "The noelle command that stands up a fully self-hosted Noelle on your own VM, with local Postgres, a single-operator identity, and the dashboard, API, and workers."
      },
      {
        "name": "@noelle/api-vm",
        "kind": "service",
        "oneLiner": "The Hono backend at api.trynoelle.com behind a Cloudflare tunnel that takes shape-validated writes from the interns' drafters into the noelle schema."
      }
    ]
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
      },
      {
        "label": "Landing page",
        "url": "https://pablomanjarres.com/oss/nella",
        "kind": "demo"
      }
    ],
    "cover": "/portfolio/previews/nella.png",
    "video": "/portfolio/videos/nella-demo.mp4",
    "demoLabel": "nella · product walkthrough",
    "featured": true,
    "subProjects": [
      {
        "name": "@getnella/mcp",
        "kind": "mcp+cli",
        "oneLiner": "The published package (v0.2.7): an MCP server plus the `nella` CLI that indexes a repo, then hands grounded search, code context, and multi-agent coordination tools to Claude Code, Cursor, and VS Code."
      },
      {
        "name": "@usenella/core",
        "kind": "library",
        "oneLiner": "The engine behind everything else: AST-based chunking, hybrid semantic and BM25 search, a dependency graph, and persistent context that tracks assumptions, a change ledger, and dependency drift."
      },
      {
        "name": "@usenella/api",
        "kind": "service",
        "oneLiner": "The Express REST service exposing workspace, search, validation, context, and auth endpoints, backed by a BullMQ job queue and WebSocket progress updates."
      },
      {
        "name": "@usenella/benchmark",
        "kind": "library",
        "oneLiner": "A suite that runs coding agents (Claude Sonnet/Opus, GPT-4o) against tasks and scores pass rate, constraint violations, scope creep, and cost, plus a prompt-injection detection test across eight attack categories."
      }
    ]
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
    "summary": "Cortex is a macOS desktop app that pulls a founder's whole life into one private dashboard: habits, sprints, reading, CRM, calendar, coursework, finances, go-to-market state, and live founder metrics (GitHub commits, Lemon Squeezy MRR, Vercel deploys, Supabase signups). Everything is stored locally and encrypted at rest with AES-256-GCM, with the master key held in the macOS Keychain. A built-in web server on port 3456 makes the same dashboard reachable from a phone over Tailscale as a PWA.\n\nThe interesting part is the seam to AI. Cortex ships a Model Context Protocol server with 51 tools across 18 groups that proxies the app's local API, so Claude can read and write habits, journal entries, contacts, calendar events, and founder metrics directly. On top of that sits Opportunity Radar, a scheduled, prompt-injection-safe pipeline that scrapes social feeds on a VM, has a tool-less LLM classify and score them against an editable profile, then ingests the survivors into the dashboard with identity-level dedup. You steer it in plain language with hunt orders, and a sibling tracker watches fast-growing GitHub projects with stars and forks charts. It is a personal tool built to production standards, not a demo.",
    "problem": "Founders and students juggle habits, revenue, deploys, coursework, contacts, and a firehose of opportunities across a dozen disconnected tools, with no single private place to see and audit it all. Cortex is a local-first, encrypted desktop dashboard that unifies those signals and exposes them to an AI agent.",
    "highlights": [
      "Encrypts every data file at rest with AES-256-GCM in a custom binary container (4-byte magic, 2-byte version, per-write 12-byte IV, 16-byte GCM auth tag). The 32-byte master key is sealed with Electron safeStorage (Keychain-backed on macOS), and a one-time migration rewrites any plaintext JSON to ciphertext behind a sentinel guard.",
      "Ships a 51-tool Model Context Protocol server (18 groups: habits, books, CRM, calendar, GTM, finance, Obsidian vault, founder metrics) that proxies the app's localhost:3456 API, so Claude can read and write real data. Runs over stdio by default, with an optional --http transport for Tailscale access.",
      "Three-tier persistence hook: Electron IPC to encrypted JSON, then the HTTP web API, then localStorage, with size-adaptive debounce (150/500/1000ms) and batched queueMicrotask writes. The web server socket is IP-gated to localhost and the Tailscale CGNAT range (100.64.0.0/10).",
      "Opportunity Radar: a launchd-scheduled pipeline that scrapes feeds on a Lima VM, then classifies and scores them with a tool-less `claude -p` call against an editable profile. Untrusted scraped text is fenced as data and the model can run no tools, so a prompt-injected post can't escalate. You steer it in plain language with hunt orders, survivors are deduped by normalized apply-URL, title, and host across X, Reddit, and Devpost, and a sibling tracker charts fast-growing GitHub projects by stars and forks.",
      "A KeepAlive watcher daemon turns a 'Run radar' button press into a full pipeline run by polling a runStatus flag over the HTTP API every 5 seconds. It is decoupled from Electron and self-heals stale runs after 45 minutes, so it needs zero app-code changes.",
      "Bridges founder integrations (GitHub commits, Lemon Squeezy MRR, Vercel deploys, Supabase signups) and an Obsidian journal vault into a weekly-audit rollup, surfaced in both the UI and over MCP."
    ],
    "metrics": [
      "51 MCP tools across 18 groups",
      "20 feature modules",
      "~22,000 lines of TypeScript",
      "140 commits, solo, over ~3.5 months"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/pablomanjarres/cortex",
        "kind": "repo"
      },
      {
        "label": "Landing page",
        "url": "https://pablomanjarres.com/oss/cortex",
        "kind": "demo"
      }
    ],
    "cover": "/portfolio/previews/cortex.png",
    "embedUrl": "/demos/cortex/index.html",
    "demoLabel": "cortex · founder dashboard",
    "subProjects": [
      {
        "name": "cortex",
        "kind": "app",
        "oneLiner": "The Electron 41 + React 19 macOS desktop app: around 20 feature modules (daily, habits, founder, CRM, finances, courses, GTM) on an OLED-black Tailwind v4 UI, persisted through Electron IPC, then the HTTP API, then localStorage."
      },
      {
        "name": "cortex-mcp-server",
        "kind": "mcp",
        "oneLiner": "A 51-tool MCP server across 18 groups that proxies the app's localhost:3456 API, so Claude can read and write habits, journal, contacts, calendar, GTM, and founder metrics over stdio or an optional --http transport."
      },
      {
        "name": "opportunity-radar",
        "kind": "worker",
        "oneLiner": "A launchd-scheduled pipeline that scrapes feeds on a Lima VM, has a tool-less claude -p call score them against an editable profile, then validates and dedupes survivors by apply-URL, title, and host before POSTing them back to the app."
      },
      {
        "name": "electron main (:3456 web server)",
        "kind": "service",
        "oneLiner": "The Electron main process owns the encrypted data directory, the tray, and context-isolated preload IPC, and runs a Tailscale-gated HTTP server on port 3456 that serves the same dashboard as a PWA to the phone."
      },
      {
        "name": "crypto container (electron/crypto.ts)",
        "kind": "library",
        "oneLiner": "Encrypts every data file with AES-256-GCM in a custom binary format (CTX1 magic, version byte, 12-byte per-write IV, 16-byte auth tag), keyed by a 32-byte master key held behind Electron safeStorage and the macOS Keychain."
      },
      {
        "name": "integrations (electron/integrations)",
        "kind": "library",
        "oneLiner": "Founder-metric clients for GitHub, Lemon Squeezy (MRR), Vercel, Supabase, the Mars Obsidian journal vault, and Paperclip, feeding the weekly-audit rollup shown in the UI and over MCP."
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
      },
      {
        "label": "Landing page",
        "url": "https://pablomanjarres.com/oss/band-of-agents",
        "kind": "demo"
      }
    ],
    "cover": "/portfolio/previews/band-of-agents.png",
    "embedUrl": "https://artifact-viewer-one.vercel.app",
    "demoLabel": "artifact-viewer-one.vercel.app",
    "subProjects": [
      {
        "name": "band-review-board-web",
        "kind": "app",
        "oneLiner": "React, Tailwind, and React Router console (web/) that streams a live review over SSE: the campaign board, the material by region verdict matrix, the analyzing panel, and the rulebook editor."
      },
      {
        "name": "server",
        "kind": "service",
        "oneLiner": "Hono HTTP and SSE backend (src/server) that starts a review locally or against a live Band room and relays every board event to the web console."
      },
      {
        "name": "agents",
        "kind": "library",
        "oneLiner": "The full cast in src/agents: Conductor, Scout, Claim and Evidence, Precedent, Disclosure, the US, EU, and LATAM reviewers, the brand reviewers, the Mediator, the Risk Adjudicator, and Remediation, plus the lighter classic Coordinator and Reconcile board."
      },
      {
        "name": "board",
        "kind": "library",
        "oneLiner": "The orchestration engine in src/board: board, campaign, and pod sessions, the pod hub, and the event model that carries findings and verdicts through a deterministic decision sequence."
      },
      {
        "name": "band",
        "kind": "library",
        "oneLiner": "The Band.ai coordination seam in src/band: a real @band-ai/sdk transport and an in-process fake for tests, shared-context rehydration, and cross-framework wiring."
      },
      {
        "name": "models",
        "kind": "library",
        "oneLiner": "A provider-agnostic ModelClient in src/models whose MODEL_MODE routing fans each agent across AIML, Vertex/Gemini, Bedrock/Claude, and Featherless, with per-call spend tracking and retry."
      },
      {
        "name": "perception",
        "kind": "worker",
        "oneLiner": "The multimodal pre-pass in src/perception that samples video keyframes, runs vision, and transcribes audio so every text reviewer can see and hear the asset before it grades."
      },
      {
        "name": "domain",
        "kind": "library",
        "oneLiner": "Campaign, asset, rulebook, and finding Zod types in src/domain, plus rulebook smart-import from .md or .json and curated per-market presets (US FTC, EU health claims, LATAM)."
      }
    ]
  },
  {
    "slug": "content-pipeline",
    "num": "05",
    "title": "Content Pipeline",
    "tagline": "Every platform, every draft, every lead, one local-first desktop app that never phones home.",
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
      },
      {
        "label": "Landing page",
        "url": "https://pablomanjarres.com/oss/content-pipeline",
        "kind": "demo"
      }
    ],
    "cover": "/portfolio/previews/content-pipeline.png",
    "embedUrl": "/demos/cp/index.html",
    "demoLabel": "content pipeline · content studio",
    "subProjects": [
      {
        "name": "Content Pipeline (Electron desktop app)",
        "kind": "app",
        "oneLiner": "macOS menu-bar shell (Electron 41, appId com.contentpipeline.app) that runs the Express server in-process, shows live pipeline counts in a tray it rebuilds every 30 seconds, and exports selected clips out of the Photos app over an AppleScript IPC handler."
      },
      {
        "name": "server",
        "kind": "service",
        "oneLiner": "Express 5 API in server/index.ts (about 3,100 lines) that stores every video, post, idea, and lead as plain JSON files under data/projects/, writes them atomically through a tmp-and-rename helper, and answers only requests from localhost or the Tailscale CGNAT range."
      },
      {
        "name": "React dashboard (src/)",
        "kind": "app",
        "oneLiner": "React 19 and Framer Motion hash-routed single-page UI with no router library, holding the Overview, Media, Shorts, Ideas, Outbound, Watchlist, Sent, and Ops tabs of the command center."
      },
      {
        "name": "obsidian-sync",
        "kind": "worker",
        "oneLiner": "Writes posts, videos, DMs, and replies out to the Mars Obsidian vault as dated markdown (keeping Pablo's hand edits intact on round-trip) and reads voice-anchor edits back into the pipeline."
      },
      {
        "name": "memory",
        "kind": "library",
        "oneLiner": "Read and write API over the openclaw-memory markdown vault (one file per lead, plus entities, insights, and pablo self-context) that backs the /api/rag/search and /api/memory/context lookups and the Algolia lead index."
      },
      {
        "name": "viral-sync + watchlist",
        "kind": "worker",
        "oneLiner": "Parses the creator list in viral-watchlist.md, syncs those handles to Supabase, and pulls recent viral-intel rows that the script-pack skill uses to shape hook and format choices."
      },
      {
        "name": "openclaw-admin",
        "kind": "service",
        "oneLiner": "Authenticated proxy behind the Ops page that starts, stops, and restarts the classifier and drafter worker pools (plus the gateway and cortex-relay services) on the remote OpenClaw outreach VM over Tailscale."
      },
      {
        "name": "script-pack",
        "kind": "skill",
        "oneLiner": "Claude Code slash-command that drafts 1 to 7 short-form video scripts in Pablo's voice, anchored on the Mars vault and shaped by scraped viral patterns, then writes them into the pipeline as scripted videos once he approves the dry run."
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
      },
      {
        "label": "Landing page",
        "url": "https://pablomanjarres.com/oss/forge",
        "kind": "demo"
      }
    ],
    "cover": "/portfolio/previews/forge.png",
    "embedUrl": "/demos/forge/index.html",
    "demoLabel": "forge · media + agent studio",
    "subProjects": [
      {
        "name": "electron/main.ts",
        "kind": "app",
        "oneLiner": "macOS menu-bar shell that spawns the Express backend as a child process, holds the tray menu (show window, MCP status, copy LAN IP), and stores provider keys in the Keychain."
      },
      {
        "name": "server/index.ts",
        "kind": "service",
        "oneLiner": "Express 5 API on port 3400 that routes media generation, agent tasks, Remotion templates, git repos, providers, and workspace files, with a WebSocket for live task and render progress."
      },
      {
        "name": "server/mcp-server.ts",
        "kind": "mcp",
        "oneLiner": "Standalone stdio MCP server that hands Claude Code eleven forge_* tools (generate, edit, and upscale media; list repos and media; run and create templates) by calling the Forge API."
      },
      {
        "name": "src (Forge dashboard)",
        "kind": "app",
        "oneLiner": "React 19 and Vite dashboard (templates, images, video, audio, gallery, editor, agents, repos, providers, workspace, settings) that drives every backend route and serves as the localhost:3400 browser view."
      },
      {
        "name": "server/gemini-compose.ts",
        "kind": "library",
        "oneLiner": "Asks Gemini for structured JSON plus relevant SKILL.md context to synthesize a self-contained Remotion component, then writes it under the active project's src/ai-generated/ folder."
      },
      {
        "name": "server/remotion-templates.ts",
        "kind": "library",
        "oneLiner": "Remotion template engine that scans a project's Root.tsx for literal Composition tags, tracks parameterized and standalone templates, and maps rendered videos into the shared media root."
      },
      {
        "name": "server/providers",
        "kind": "library",
        "oneLiner": "Provider adapters for Gemini (Imagen, Veo, TTS), ElevenLabs voice, RunPod serverless GPU (Qwen-Edit, RealESRGAN, Qwen3-TTS), and Codex and Claude CLI subprocess launchers for agent tasks."
      },
      {
        "name": "server/skills.ts",
        "kind": "library",
        "oneLiner": "Skills bridge that indexes SKILL.md files across the Claude, Stitch, and Projects skill roots and loads raw content on demand for Gemini's system prompt."
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
    "status": "live",
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
        "label": "archgraph.vercel.app",
        "url": "https://archgraph.vercel.app",
        "kind": "live"
      },
      {
        "label": "GitHub",
        "url": "https://github.com/pablomanjarresneg/archgraph",
        "kind": "repo"
      },
      {
        "label": "Landing page",
        "url": "https://pablomanjarres.com/oss/archgraph",
        "kind": "demo"
      }
    ],
    "cover": "/portfolio/previews/archgraph.png",
    "embedUrl": "https://archgraph.vercel.app",
    "demoLabel": "archgraph.vercel.app",
    "subProjects": [
      {
        "name": "archgraph serve",
        "kind": "cli",
        "oneLiner": "The archgraph serve [project] command starts a Vite server that feeds a project's .archgraph/model.json into the viewer and reloads on change, with a --model flag for paths like .nella/graph/model.json."
      },
      {
        "name": "graph",
        "kind": "skill",
        "oneLiner": "The /graph Claude Code skill runs four parallel research agents over a codebase (systems, external stores, data flows, actors) and writes the C4 model.json the viewer reads."
      },
      {
        "name": "archgraph viewer",
        "kind": "app",
        "oneLiner": "React 19 and ReactFlow 12 single-page app that renders the C4 model as an interactive canvas with actor, system, app, store, and component nodes plus a detail panel and multi-project list."
      },
      {
        "name": "layout",
        "kind": "library",
        "oneLiner": "ELK.js layered auto-layout that places nodes and nested group containers left to right, then hands the coordinates back to ReactFlow for rendering."
      },
      {
        "name": "model",
        "kind": "library",
        "oneLiner": "The versioned ArchGraphModel schema (objects, connections, groups, technologies, tags, diagrams, flows) that the skill writes and the viewer validates on load."
      },
      {
        "name": "tech-catalog",
        "kind": "library",
        "oneLiner": "A registry of about thirty technologies with brand colors and categories that render as tech pills and icons on each node."
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
      },
      {
        "label": "Landing page",
        "url": "https://pablomanjarres.com/oss/omegahack",
        "kind": "demo"
      }
    ],
    "cover": "/portfolio/previews/omegahack.png",
    "embedUrl": "https://omega-landing-zeta.vercel.app",
    "demoLabel": "omega-landing-zeta.vercel.app",
    "subProjects": [
      {
        "name": "@omega/intake-agent",
        "kind": "library",
        "oneLiner": "Orchestrates the whole PQRSD intake: schema validation, PII redaction, a validity agent, the Article 16 gates of Ley 1755, classification, tags and deadline, writing one pqr row plus an audit event."
      },
      {
        "name": "@omega/classifier",
        "kind": "library",
        "oneLiner": "Sends the PII-free text to Claude and returns a structured verdict: request type, the competent secretaría (one of 26 official codes), comuna, namespaced thematic tags and signals like tutela risk."
      },
      {
        "name": "@omega/deadline-engine",
        "kind": "library",
        "oneLiner": "Computes Colombian legal deadlines in business days on America/Bogota, covering movable holidays, the extension capped at twice the original term (Ley 1755/2015) and per-tenant suspensions, fully offline with 393 tests."
      },
      {
        "name": "@omega/habeas-data",
        "kind": "library",
        "oneLiner": "Classifies and redacts personal data under Ley 1581/2012 (Colombian habeas data) with zero external dependencies, so raw citizen text never reaches a model unredacted."
      },
      {
        "name": "@omega/problem-groups",
        "kind": "library",
        "oneLiner": "Clusters recurring PQRs from the same tenant by cosine similarity, shared tags and matching comuna, and flags a group as hot once its volume and velocity cross tenant thresholds."
      },
      {
        "name": "@omega/rag",
        "kind": "library",
        "oneLiner": "Retrieval utilities for the legal Q&A: header-aware chunking, 1024-dim Azure embeddings, a hybrid vector plus full-text retriever, and a client for the internal Nella API."
      },
      {
        "name": "@omega/workbench",
        "kind": "app",
        "oneLiner": "Internal Next.js console for the legal team: case review and reply drafting, queues filtered by secretaría and status, problem-group navigation and an append-only audit trail (port 3001)."
      },
      {
        "name": "@omega/web",
        "kind": "app",
        "oneLiner": "Public Next.js site for citizens plus the /transparencia dashboard, which serves comuna and secretaría aggregates behind a k-anonymity floor of 5 (port 3000)."
      },
      {
        "name": "@omega/secretaria",
        "kind": "app",
        "oneLiner": "Per-secretaría Next.js console scoped strictly to one department's cases, staff and deadline-compliance KPIs (port 3002)."
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
      },
      {
        "label": "Landing page",
        "url": "https://pablomanjarres.com/oss/localhost-mirror",
        "kind": "demo"
      }
    ],
    "cover": "/portfolio/previews/localhost-mirror.png",
    "embedUrl": "/demos/lm/index.html",
    "demoLabel": "localhost mirror · live tunnels",
    "subProjects": [
      {
        "name": "lm",
        "kind": "cli",
        "oneLiner": "Terminal CLI (the `lm` bin) whose expose, list, stop, status, dashboard, and shutdown commands drive the daemon over its localhost management API on 127.0.0.1:19099."
      },
      {
        "name": "LocalhostMirror",
        "kind": "app",
        "oneLiner": "SwiftUI macOS menu-bar app (a MenuBarExtra, LSUIElement) that lists every listening port and lets you expose, stop, copy the tailnet URL, or kill any of them, polling the daemon every three seconds."
      },
      {
        "name": "daemon",
        "kind": "service",
        "oneLiner": "Background service running a localhost-only management API on :19099 plus a tailnet-facing proxy and dashboard server on :19100, auto-starting on the first expose and shutting itself down 60 seconds after the last tunnel closes unless run with --persistent."
      },
      {
        "name": "api",
        "kind": "library",
        "oneLiner": "Request router that maps an lm_tunnel cookie or a /name path to a per-port http-proxy instance (one cached per target port), forwards WebSocket upgrades, gates optional per-tunnel nanoid tokens, and serves the tunnel CRUD REST API."
      },
      {
        "name": "PortScanner",
        "kind": "library",
        "oneLiner": "Swift scan engine that lists TCP listeners with lsof every three seconds, reads per-process CPU, RAM, and zombie state from ps, finds the owning project by walking up for package.json, Cargo.toml, go.mod, or .git, and raises alerts for CPU over 80 percent, RAM over 500MB, or a process that died."
      },
      {
        "name": "CommonPorts",
        "kind": "library",
        "oneLiner": "Lookup table that labels and colors a detected port from 87 known dev ports (Next.js, Vite, Postgres, Redis, Ollama, and more) plus 28 process-name heuristics."
      },
      {
        "name": "dashboard",
        "kind": "app",
        "oneLiner": "Single-file dark web dashboard (index.html served at /lm/) that the daemon serves over the tailnet to list, expose, and stop tunnels from the browser."
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
    "status": "live",
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
        "label": "lumen-frontier.vercel.app",
        "url": "https://lumen-frontier.vercel.app",
        "kind": "live"
      },
      {
        "label": "GitHub",
        "url": "https://github.com/pablomanjarres/Lumen-Frontier",
        "kind": "repo"
      },
      {
        "label": "Landing page",
        "url": "https://pablomanjarres.com/oss/lumen-frontier",
        "kind": "demo"
      }
    ],
    "cover": "/portfolio/previews/lumen-frontier.png",
    "embedUrl": "https://lumen-frontier.vercel.app",
    "demoLabel": "lumen-frontier.vercel.app",
    "subProjects": [
      {
        "name": "@lumen-frontier/frontend",
        "kind": "app",
        "oneLiner": "The deployed Astro 4 site with React 18 islands, serving three routes (landing, dashboard, and the 3D lumenverse) with TypeScript, Tailwind, and nanostores as the state bus between islands."
      },
      {
        "name": "LumenOS",
        "kind": "app",
        "oneLiner": "A desktop-style study dashboard where every tool is a widget you drag by its header, resize from the corner, add from a categorized marketplace, and arrange on a canvas that saves back to localStorage."
      },
      {
        "name": "Lumenverse",
        "kind": "app",
        "oneLiner": "A 985-line Three.js first-person scene where each subject is a glowing planet you fly to as a tethered astronaut, with helmet visor, gloves, a HUD, pointer-lock mouse-look, WASD flight, and a rocket fly-to animation."
      },
      {
        "name": "widget-system",
        "kind": "library",
        "oneLiner": "The registry-driven engine behind LumenOS: it lazy-loads 13 widgets with React.lazy and Suspense and runs direct manipulation through custom useDrag and useResize hooks with per-widget size limits."
      },
      {
        "name": "backend",
        "kind": "service",
        "oneLiner": "A FastAPI scaffold for future auth and cross-device sync, wired for SQLAlchemy and Supabase, currently a stub that is excluded from the Vercel build."
      },
      {
        "name": "api",
        "kind": "service",
        "oneLiner": "A Vercel serverless handler at api/index.py that wraps the FastAPI app with Mangum for ASGI compatibility, ready as the entry point once the backend goes live."
      }
    ]
  },
  {
    "slug": "grit-x-awa",
    "num": "11",
    "title": "GRIT-X-AWA",
    "tagline": "A web observatory that classifies exoplanet candidates from NASA's Kepler and TESS data with a gradient-boosting ensemble, keyless demo included.",
    "oneLiner": "Exoplanet classification over NASA Kepler and TESS data",
    "year": "2026",
    "status": "prototype",
    "role": "NASA Space Apps team · full-stack + ML",
    "tags": [
      "exoplanet classification",
      "ensemble ML",
      "NASA open data",
      "three.js",
      "FastAPI",
      "data visualization"
    ],
    "stack": [
      "Astro 5",
      "React 18",
      "TypeScript 5",
      "three.js r167",
      "react-three-fiber",
      "@react-three/drei",
      "Tailwind CSS v3",
      "Supabase",
      "Python",
      "FastAPI",
      "XGBoost",
      "LightGBM",
      "CatBoost",
      "scikit-learn",
      "pandas",
      "Google Cloud Run",
      "Vercel"
    ],
    "summary": "GRIT-X-AWA is a web app for classifying exoplanet candidates from two NASA missions, Kepler and TESS. The front end is Astro 5 with React 18 islands and a three.js starfield: a landing page drops into a Mission Control dashboard where you pick a mission, upload a CSV or type a candidate in by hand, read model-metric cards, then open a full-page results modal with per-class confidence and CSV or JSON export. A paginated browser reads Supabase-hosted mission datasets, react-three-fiber renders 3D orbital views, and an in-app chatbot answers questions about the science.\n\nThe prediction engine is a Python FastAPI service on Google Cloud Run. Each mission has its own ensemble of three gradient-boosting models, CatBoost, XGBoost, and LightGBM, blended by a fixed weighted soft vote (0.40 / 0.35 / 0.25) into a labeled disposition. It now ships as a keyless public demo: demo mode is on by default, so uploads and manual entries return canned but realistic predictions, the data browser falls back to bundled sample rows, and the chatbot returns a graceful scripted reply, which means the whole site runs with no backend and no API keys. Set PUBLIC_DEMO=false with a live backend to hit the real ensemble.",
    "problem": "Vetting a transit signal as a real planet, an eclipsing binary, or noise is slow expert work, and the raw Kepler and TESS tables are wide and unfriendly. GRIT-X-AWA puts a trained ensemble behind a single upload box so a candidate list becomes labeled dispositions with confidence in seconds, and makes the pipeline explorable in the browser instead of a notebook.",
    "highlights": [
      "Two per-mission ensembles of three gradient-boosting models each (CatBoost, XGBoost, LightGBM) combine by a fixed weighted soft vote, argmax(0.40*Cat + 0.35*XGB + 0.25*LGBM), with the weights and class order pinned in each model's meta.json.",
      "Kepler reads 21 KOI features into 3 classes (CANDIDATE, CONFIRMED, FALSE POSITIVE); TESS reads 17 base features engineered into about 66 model inputs across 6 classes (APC, CP, FA, FP, KP, PC), and the backend auto-detects which mission a CSV belongs to.",
      "A keyless demo mode is on by default: CSV upload, manual entry, the Supabase data browser, and the chatbot all fall back to deterministic canned fixtures and bundled sample rows, so the deployed site never shows a blank screen or asks for a key; PUBLIC_DEMO=false restores the real backend paths.",
      "The front end runs Astro 5 in SSR mode on the Vercel adapter with React 18 islands: a three.js starfield landing (SpaceScene), a Mission Control dashboard, a react-three-fiber 3D orbital viewer (ExoplanetVisualization3D), and a full-page prediction-results modal that exports to CSV and JSON via html2canvas.",
      "The AI chatbot is an Astro server endpoint (/api/chat) with per-IP rate limiting (20 messages per day) that degrades to a scripted reply when no model key is present, so the assistant stays graceful in the public demo.",
      "The FastAPI service loads and caches the pickled models on startup and exposes CSV upload, single predict, stats, and recent-prediction endpoints; Supabase (Postgres plus Storage) persists uploads and prediction history when configured, and the service still runs in a local mode when the database is absent."
    ],
    "metrics": [
      "6 gradient-boosting models: a CatBoost, XGBoost, LightGBM ensemble per mission, blended 0.40 / 0.35 / 0.25",
      "2 NASA missions, 9 disposition classes: Kepler's 3 and TESS's 6",
      "0 keys or backend needed: demo mode is on by default with canned predictions and bundled sample data",
      "21 Kepler features and 17 TESS features (engineered into about 66) feed the models"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/pablomanjarres/NASA-Space-Apps-Challenge",
        "kind": "repo"
      },
      {
        "label": "Live demo",
        "url": "/portfolio/grit-x-awa/demo",
        "kind": "live"
      },
      {
        "label": "Landing page",
        "url": "https://pablomanjarres.com/oss/grit-x-awa",
        "kind": "demo"
      }
    ],
    "cover": "/portfolio/previews/grit-x-awa.png",
    "embedUrl": "https://grit-x-awa-kappa.vercel.app",
    "demoLabel": "grit-x-awa-kappa.vercel.app",
    "previewKind": "web",
    "subProjects": [
      {
        "name": "frontend",
        "kind": "app",
        "oneLiner": "Astro 5 and React 18 client with a three.js starfield: the Mission Control dashboard (mission pick, CSV upload or manual entry, metric cards, results modal with CSV and JSON export), a paginated Supabase data browser, react-three-fiber orbital views, and the chatbot."
      },
      {
        "name": "backend",
        "kind": "service",
        "oneLiner": "FastAPI app on Google Cloud Run that auto-detects the mission, preprocesses the CSV, runs the weighted ensemble, and returns per-row predictions with per-class confidence over a REST API."
      },
      {
        "name": "kepler + tess models",
        "kind": "model",
        "oneLiner": "Two per-mission ensembles (CatBoost, XGBoost, LightGBM) plus their imputer, encoders, and meta.json, pickled and loaded on backend startup for the 3-class Kepler and 6-class TESS vote."
      },
      {
        "name": "demoFixtures",
        "kind": "library",
        "oneLiner": "The keyless demo layer: deterministic canned prediction fixtures, bundled sample rows for the data browser, and a scripted chatbot reply, gated by the PUBLIC_DEMO flag so the site runs with no backend or keys."
      },
      {
        "name": "chat endpoint",
        "kind": "service",
        "oneLiner": "An Astro SSR /api/chat route with per-IP daily rate limiting that powers the in-app assistant and degrades to a graceful scripted reply in demo mode."
      }
    ]
  },
  {
    "slug": "study-hub",
    "num": "12",
    "title": "Study Hub",
    "tagline": "A study platform for three university CS courses, where the automata, parsers, and data structures aren't diagrams you read but machines you step through.",
    "oneLiner": "Interactive study platform for three university CS courses.",
    "year": "2026",
    "status": "wip",
    "role": "Solo · design + engineering",
    "tags": [
      "study platform",
      "automata theory",
      "interactive viz",
      "MCP",
      "MDX content",
      "offline-first"
    ],
    "stack": [
      "TypeScript",
      "Astro 6",
      "React 19",
      "Tailwind CSS v4",
      "MDX",
      "KaTeX",
      "ReactFlow",
      "ELK.js",
      "Framer Motion",
      "Zustand",
      "Model Context Protocol",
      "Zod",
      "Node 22",
      "pnpm",
      "Vercel"
    ],
    "summary": "Study Hub is a study platform for three of my university computer-science courses: Lenguajes Formales, Estructuras de Datos y Algoritmos, and Sistemas de Gestión de Datos. Each subject has its own dashboard of practice problems with simple, formal, and full solution tabs, topic explanations, handwritten-style study notes, and exam quizzes, all pre-authored as MDX with KaTeX math. One typed subject config and one shared design system drive all three, so a subject owns a single accent and every surface resolves to it automatically.\n\nThe part that matters is that the hard theory is interactive, not static. Automata render as live state graphs: DFA, NFA, PDA, and Turing machines laid out by ELK and drawn with ReactFlow, that you step through one symbol at a time while the active transition lights up, the stack grows, and the tape moves. The parsing unit adds FIRST and FOLLOW sets, LL(1) and SLR tables, and shift-reduce traces, alongside grammar transforms and newer sorting and database-schema visualizers. A key-free MCP server exposes the whole content store to Claude over stdio as typed read and authoring tools, and the app runs fully offline with seeded content, self-hosted fonts, and no API keys.",
    "problem": "CS courses lean on ideas that are genuinely dynamic: a machine consuming a string, a stack rising and falling, a parser reducing a handle. They are usually taught with static blackboard snapshots and PDFs. I wanted one place that holds a whole semester of three courses and makes those moving parts actually move, with solutions I can read at three depths and content an agent can extend without touching a database.",
    "highlights": [
      "Automata as first-class visualizations: DFA, NFA, PDA, and Turing-machine state graphs are auto-laid-out with ELK and rendered in ReactFlow, then a shared step runner walks an input string one symbol at a time, highlighting the active transition, growing and shrinking the PDA stack, and moving the Turing tape under the head.",
      "The whole compilers unit made interactive: FIRST and FOLLOW set computation, LL(1) and SLR parse tables, animated shift-reduce traces, and CFG grammar transforms, plus newer sorting and relational-algebra visualizers, all built on one useStepAnimation primitive that renders each frame from a real, instrumented trace.",
      "Content is pre-authored MDX, not a CMS: 39 problems and 66 solutions with simple / formal / full tabs, topic explanations, Caveat-handwritten study notes, and exam quizzes, every one with KaTeX math, where a single solved boolean in problem frontmatter is the source of truth for dashboard status.",
      "One design system across three subjects: a refined editorial-dark theme (Instrument Serif display, Instrument Sans body, Caveat notes) with a per-subject accent bridge set via [data-subject], sapphire for Lenguajes Formales, jade for EDA, amethyst for SGD, resolved once so no surface re-declares a color map.",
      "A key-free, offline MCP server: 16 typed tools (10 read, 6 write) over stdio, pure file I/O, that let Claude list and read problems, solutions, and visualizations and author new ones, with every write validated by zod schemas that mirror content.config.ts, so the server rejects exactly what an Astro build would.",
      "Genuinely runnable with zero secrets: seeded content, four self-hosted woff2 fonts, and a mocked upload endpoint mean both the live demo and a fresh clone boot with no API keys and no network fonts."
    ],
    "metrics": [
      "16 typed MCP tools, 10 read and 6 write, key-free over stdio",
      "39 problems and 66 tabbed solutions, all pre-authored MDX",
      "16 React visualizers, from DFA graphs to database schemas",
      "3 subjects, 19 units, 0 API keys to run"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/pablomanjarres/study-hub",
        "kind": "repo"
      },
      {
        "label": "Live demo",
        "url": "/portfolio/study-hub/demo",
        "kind": "live"
      },
      {
        "label": "Landing page",
        "url": "https://pablomanjarres.com/oss/study-hub",
        "kind": "demo"
      }
    ],
    "cover": "/portfolio/previews/study-hub.png",
    "embedUrl": "https://study-hub-three-orpin.vercel.app",
    "demoLabel": "study-hub-three-orpin.vercel.app",
    "previewKind": "web",
    "subProjects": [
      {
        "name": "web",
        "kind": "app",
        "oneLiner": "The Astro 6 dashboard: per-subject problem lists, simple/formal/full solution tabs, explanations, notes, and exam pages, with a React island mounted for every interactive visualization."
      },
      {
        "name": "viz",
        "kind": "library",
        "oneLiner": "The React visualization library: ReactFlow + ELK automata, PDA, and Turing-machine graphs, LL(1)/SLR parse tables, shift-reduce and relational-algebra traces, sorting steppers, and one shared step-animation runner."
      },
      {
        "name": "content",
        "kind": "content",
        "oneLiner": "The MDX content store: problems, three-depth solutions, explanations, handwritten notes, and tests per subject, plus the JSON datasets that feed each visualization."
      },
      {
        "name": "mcp",
        "kind": "server",
        "oneLiner": "The key-free stdio MCP server: 16 tools (10 read, 6 write) over pure file I/O that read and author the content store, with zod validation mirroring the Astro content config."
      },
      {
        "name": "config",
        "kind": "config",
        "oneLiner": "The subject registry: one typed SubjectConfig per course (units, topics, exams, viz enums) that drives routing, dashboards, and the per-subject accent triad."
      }
    ]
  },
  {
    "slug": "valhalla",
    "num": "13",
    "title": "Valhalla",
    "tagline": "The one command that shows my entire personal-AI stack at once, a live terminal command center over every Claude account, VM, daemon, and MCP server on my Mac, with a way to reach into each of them.",
    "oneLiner": "A live terminal command center for a whole personal-AI stack.",
    "year": "2026",
    "status": "wip",
    "role": "Solo · design + engineering",
    "tags": [
      "command center",
      "developer tools",
      "TUI",
      "Ink",
      "Claude Code",
      "macOS",
      "launchd",
      "MCP"
    ],
    "stack": [
      "TypeScript",
      "Node 20",
      "Ink",
      "React 18",
      "commander",
      "chalk",
      "tsup",
      "Vitest",
      "pnpm"
    ],
    "summary": "Valhalla is a single command that shows my whole personal-AI stack at a glance and dispatches into each piece of it. I run a lot on one Mac: Claude accounts I rotate with cswap, a Lima VM full of agents, about two dozen launchd daemons, a handful of MCP servers, and a folder of skills. Checking any of it used to mean remembering a different command every time. Now `valhalla` opens one live board where every part reports in.\n\nThe design is deliberately thin. Each of the eight surfaces is a small module behind one shared interface, and every surface shells out to the tool that already owns the truth, cswap, limactl, launchctl, tmux, instead of reimplementing it or storing a secret. Probes run in parallel and each races a timeout, so one stuck service degrades to a single gray card instead of freezing the view. Bare `valhalla` opens an Ink dashboard, a verb like `valhalla accounts switch 2` runs an action, and `valhalla status --json` hands the whole fleet to another script.",
    "problem": "I had built a whole personal operating system without a front door. The pieces were healthy on their own, but seeing the state of all of them, or acting on any one, meant juggling a dozen tools and remembering which command belonged to which. I wanted one place that reads everything at once and lets me act, without becoming a second system to maintain.",
    "highlights": [
      "One command surfaces the whole machine: a registry of eight independent surfaces folds about 23 launchd jobs, 6 MCP servers, a Lima VM, and 21 skills into a single board read in one glance.",
      "It wraps the tools it reports on and never reimplements them: every surface shells out through one execFile helper that passes argument arrays, so there is no shell string to inject into and no credential ever leaves its original tool.",
      "A live board, not a static dump: the Ink dashboard re-probes every five seconds, colors each card by health, and lets me arrow into any surface to read its rows.",
      "One hung service can never blank the board: probes run in parallel and each races a ten second timeout, so a stuck VM becomes one gray card instead of a frozen screen.",
      "Adding a surface is one file behind a six field interface: a new integration is a single module plus one line in the registry, and each surface keeps its parsing pure so it is unit tested without the live machine.",
      "Safe by default, scriptable when I want: read-only probes run on their own, mutations like switching accounts or starting the VM sit behind a confirm prompt, and a JSON mode hands the fleet to other scripts."
    ],
    "metrics": [
      "8 surfaces over 1 machine, from Claude accounts to the launchd fleet",
      "About 23 launchd jobs and 6 MCP servers on one board",
      "24 unit tests over the pure parsers, green where none of the tools exist",
      "0 secrets stored, every surface shells out to the tool that owns them"
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/pablomanjarres/valhalla",
        "kind": "repo"
      },
      {
        "label": "Landing page",
        "url": "https://pablomanjarres.com/oss/valhalla",
        "kind": "demo"
      }
    ],
    "cover": "/portfolio/previews/valhalla.png",
    "previewKind": "app",
    "subProjects": [
      {
        "name": "core",
        "kind": "library",
        "oneLiner": "The Surface contract, the surface registry, a parallel timeout-guarded probe runner, an execFile shell wrapper, config, and the plain-text renderer."
      },
      {
        "name": "surfaces",
        "kind": "module",
        "oneLiner": "One module per surface (accounts, sessions, apps, vm, services, mcp, skills, workflows), each a pure parser behind a never-throwing probe plus its actions."
      },
      {
        "name": "tui",
        "kind": "app",
        "oneLiner": "The Ink dashboard: a card grid colored by health, a selectable detail pane, and a five second auto-refresh."
      },
      {
        "name": "cli",
        "kind": "cli",
        "oneLiner": "The commander entry: bare valhalla opens the dashboard, every surface is a subcommand, and status --json prints the fleet for scripts."
      },
      {
        "name": "test",
        "kind": "tests",
        "oneLiner": "Vitest unit tests over each surface's pure parser, using real fixture output so they stay green where cswap, lima, and launchctl do not exist."
      }
    ]
  },
  {
    "slug": "redline",
    "num": "14",
    "title": "Redline",
    "tagline": "A statistical-rigor auditor for single-cell RNA-seq: it re-runs the load-bearing stats on your own data and marks the false discoveries on your own figures, before Reviewer 2 does.",
    "oneLiner": "Break your own scRNA-seq analysis before Reviewer 2 does",
    "year": "2026",
    "status": "shipped",
    "role": "Solo · design + engineering",
    "tags": ["scRNA-seq", "statistical rigor", "reproducible research", "AI agents", "MCP", "monorepo"],
    "stack": ["TypeScript", "Node 22", "pnpm + turbo", "Zod", "React 19", "Next.js", "Python (scanpy · decoupler · PyDESeq2 · numpy)", "Claude API + AWS Bedrock", "Model Context Protocol", "GCP Cloud Run", "Vercel"],
    "summary": "Redline is a statistical-rigor auditor for single-cell RNA-seq, and I built it to break my own analysis before a reviewer does. You point it at your own AnnData .h5ad, it re-runs the load-bearing statistics the conclusions actually rest on, and it marks the false discoveries directly on your own figures, before any of it becomes a paper. It catches eight classes of error that no QC tool or generic agent flags: four founding pillars (pseudoreplication, double-dipping, clustering fragility, and confounding) and four rigor checks (multiple testing, unmodeled covariates, resolution choice, and test assumptions).\n\nIt runs on three unbreakable rules. Every correction is reproducible and cited, and the corrected code downloads and runs. When a design is unsalvageable, a full confound or n = 1, it says so and shows no fabricated fix. And a clean analysis is Verified in green with the same confidence as a flag, so it never cries wolf. I proved all of it on a 46-case benchmark of planted errors and clean controls: Redline catches 100% of the planted errors at a 0% false-positive rate, where a single Claude call given the same write-up catches everything too but at a 74% false-positive rate. The whole thing is a pnpm and turbo monorepo: a plots-first Next.js workbench on Vercel over a real Python engine (scanpy, decoupler, PyDESeq2) behind a typed dispatch seam, a reasoning layer on the Claude API and AWS Bedrock, and the same engine shipped as an MCP server and a Claude Skill.",
    "problem": "Single-cell RNA-seq analyses ship with load-bearing statistical errors that survive peer review: cells from one mouse treated as independent replicates, the same cells used to both define and test a cluster, p-values with no multiple-testing correction. Generic QC tools do not catch these, and a generic agent asked to check flags almost everything. Redline re-runs the specific statistics that matter and marks only the real false discoveries.",
    "highlights": [
      "It catches eight classes of error that no QC tool or generic agent flags. Four founding pillars, pseudoreplication, double-dipping, clustering fragility, and confounding, plus four rigor checks (multiple testing, unmodeled covariates, resolution choice, and test assumptions), each with its own panel in apps/web.",
      "Pseudoreplication is the headline crime, and I fix it by the book. Cells from the same animal are not independent replicates, so Redline collapses them to pseudobulk and re-runs differential expression through PyDESeq2 in services/rigor before it trusts a single p-value.",
      "Double-dipping, clustering fragility, and confounding each get a real method, not a lecture. Poisson count-splitting for markers tested on the same cells that defined them, an adjusted-Rand resolution sweep for cluster stability, and a design-matrix rank check for full confounds.",
      "Three unbreakable rules keep it honest. Every fix is reproducible, cited, and runnable, an unsalvageable design (a full confound, n = 1) returns no fabricated result, and a clean analysis renders as Verified in green with the same confidence as a flag.",
      "I proved it on a 46-case benchmark of planted errors and clean controls. Redline catches 100% of the planted errors at a 0% false-positive rate, where a single Claude call given the same write-up catches everything at a 74% false-positive rate, in services/rigor/bench.",
      "It ships as a pnpm and turbo monorepo with a real Python engine behind a typed seam. 13 Zod contract modules bind every surface, a ComputeTarget dispatch routes each check to scanpy, decoupler, and PyDESeq2, and the same engine runs as an MCP server, a GCP Cloud Run job, and a Claude Skill across roughly 150 TypeScript and 75 Python files."
    ],
    "metrics": [
      "46 planted-error cases, 100% caught at 0% false positive",
      "0% false-positive rate vs 74% for a single Claude call",
      "8 classes of error caught, 4 pillars plus 4 rigor checks",
      "13 Zod contract modules binding every surface",
      "~150 TypeScript and 75 Python files across the monorepo"
    ],
    "links": [
      {"label": "GitHub", "url": "https://github.com/pablomanjarres/redline", "kind": "repo"},
      {"label": "Live demo", "url": "https://redline-sooty-zeta.vercel.app", "kind": "live"},
      {"label": "Landing page", "url": "https://pablomanjarres.com/oss/redline", "kind": "demo"}
    ],
    "cover": "/portfolio/previews/redline.png",
    "previewKind": "web",
    "accent": "#ce2a1e",
    "subProjects": [
      {"name": "@redline/engine", "kind": "library", "oneLiner": "The ComputeTarget dispatch seam, critic-gate, and correction bundler: it routes each check to the real Python engine, holds every result behind a critic until it verifies, and packages the corrected, runnable code."},
      {"name": "@redline/reasoning", "kind": "library", "oneLiner": "The Claude layer over a first-party API and AWS Bedrock with a deterministic fallback, so a finding's narrative is model-written while the statistics underneath never are."},
      {"name": "services/rigor", "kind": "service", "oneLiner": "The real statistical engine (scanpy, decoupler, PyDESeq2, numpy) as an MCP server and a GCP Cloud Run job, plus bench, the 46-case planted-error benchmark it is proven on."},
      {"name": "redline-skill", "kind": "skill", "oneLiner": "The same rigor engine packaged as a Claude Skill for Claude: Life Sciences, so an agent can re-run the load-bearing statistics on an .h5ad from inside a conversation."},
      {"name": "apps/web", "kind": "app", "oneLiner": "The plots-first Next.js workbench on Vercel: one panel per check, every finding drawn on the figure it belongs to, and the corrected code one click away."},
      {"name": "@redline/contracts", "kind": "library", "oneLiner": "13 Zod modules binding every surface (inputs, findings, corrections, benchmark) into one typed contract shared by the web app, the engine, the reasoning layer, and the Python service."}
    ]
  }
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
