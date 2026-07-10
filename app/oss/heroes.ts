export type Hero = {
  slug: string; title: string; kicker: string; titleLead: string; titleMain: string;
  subtitle: string; note: string; repo: string; live: string | null; oss: boolean;
};

export const heroes: Hero[] = [
  {
    "slug": "nella",
    "title": "Nella",
    "kicker": "NELLA · OPEN SOURCE",
    "titleLead": "Grounded",
    "titleMain": "code intelligence.",
    "subtitle": "Nella sits between your AI coding agent and your repo. It indexes the real code with AST-based chunking, answers search with semantic and BM25 retrieval, and keeps a memory of assumptions, changes, and dependencies so the agent stops hallucinating and stops forgetting.",
    "note": "Run `npx -y @getnella/mcp --workspace /path/to/repo`, or `nella connect --client claude` to wire it into Claude Code, Cursor, or VS Code over MCP.",
    "repo": "https://github.com/nella-labs/nella",
    "live": "https://getnella.dev",
    "oss": true
  },
  {
    "slug": "forge",
    "title": "Forge",
    "kicker": "FORGE · OPEN SOURCE",
    "titleLead": "Generate, render, orchestrate",
    "titleMain": "from the menu bar.",
    "subtitle": "Forge is a macOS menu-bar app that generates images, video, and voice, launches coding agents against your repos, and renders Remotion videos. It runs a local server on port 3400 and exposes the same tools to Claude Code over MCP.",
    "note": "Run npm run dev:electron for the desktop shell, or claude mcp add forge to give Claude Code the forge_* media tools.",
    "repo": "https://github.com/pablomanjarres/forge",
    "live": null,
    "oss": true
  },
  {
    "slug": "cortex",
    "title": "Cortex",
    "kicker": "CORTEX · OPEN SOURCE",
    "titleLead": "Your whole life,",
    "titleMain": "one encrypted dashboard.",
    "subtitle": "A macOS desktop app that pulls your habits, sprints, reading, CRM, calendar, coursework, finances, and live founder metrics into one place. Data stays on your machine, encrypted at rest, and Claude can read and write all of it over MCP.",
    "note": "Run npm run electron:dev to boot it, then claude mcp add cortex to wire the 51-tool MCP server into Claude.",
    "repo": "https://github.com/pablomanjarres/cortex",
    "live": null,
    "oss": true
  },
  {
    "slug": "noelle",
    "title": "Noelle",
    "kicker": "NOELLE · SOURCE AVAILABLE",
    "titleLead": "An org chart of",
    "titleMain": "AI growth interns.",
    "subtitle": "Noelle is a dashboard where a small team hires AI agents arranged like a real company: a CEO up top, a marketing lead, and growth interns for X, LinkedIn, Reddit, and short-form video. Each intern finds leads and drafts on-brand replies, and you approve every one before it goes out.",
    "note": "Run it hosted at app.trynoelle.com, or self-host the whole stack on your own VM with the noelle CLI.",
    "repo": "https://github.com/nella-labs/noelle",
    "live": "https://trynoelle.com",
    "oss": false
  },
  {
    "slug": "omegahack",
    "title": "CAROL",
    "kicker": "CAROL · OPEN SOURCE",
    "titleLead": "Answer every petition",
    "titleMain": "before the deadline.",
    "subtitle": "CAROL is an open-source multi-agent stack for Colombian city halls. It validates, redacts, classifies and files each citizen PQRSD, then tracks the legal deadline on every case so none lapse unanswered.",
    "note": "Turborepo + pnpm: `pnpm dev` runs the three Next.js apps (citizen, legal workbench, department console); intake runs on Supabase Postgres with pgvector, Claude and an n8n webhook.",
    "repo": "https://github.com/pablomanjarres/omegahack",
    "live": "https://omega-landing-zeta.vercel.app",
    "oss": true
  },
  {
    "slug": "content-pipeline",
    "title": "Content Pipeline",
    "kicker": "CONTENT PIPELINE · OPEN SOURCE",
    "titleLead": "Local-first",
    "titleMain": "content command center.",
    "subtitle": "A macOS menu-bar app that plans your short-form video and runs your outreach from one window. Every record is a plain JSON file on your machine: no database, no cloud, localhost and Tailscale only.",
    "note": "Run it from the menu bar or with `npm run dev` (React, Express, Electron); it syncs to your Obsidian vault and controls the worker pools on your outreach VM.",
    "repo": "https://github.com/pablomanjarres/content-pipeline",
    "live": null,
    "oss": true
  },
  {
    "slug": "band-of-agents",
    "title": "Band of Agents",
    "kicker": "BAND REVIEW BOARD · OPEN SOURCE",
    "titleLead": "Seventeen agents,",
    "titleMain": "one auditable verdict.",
    "subtitle": "A marketing-compliance review board built on Band.ai. Specialist agents with competing mandates clear every campaign asset against each market's advertising and regulatory rules, argue out the cross-border conflicts, and send only the genuine gray areas to a human, with every verdict traced back to a rule and an agent.",
    "note": "Run the whole debate with no API keys on a fake transport (pnpm local), or connect a live seventeen-agent room to Band.ai (MODEL_MODE=vertex pnpm agents).",
    "repo": "https://github.com/pablomanjarres/Band-Of-Agents",
    "live": "https://artifact-viewer-one.vercel.app",
    "oss": true
  },
  {
    "slug": "archgraph",
    "title": "Archgraph",
    "kicker": "ARCHGRAPH · OPEN SOURCE",
    "titleLead": "Self-drawing",
    "titleMain": "architecture diagrams.",
    "subtitle": "Point Archgraph at any repo and a Claude Code skill maps it into a C4 model: actors, systems, apps, data stores, and the connections between them. An ELK-positioned React canvas renders the result and updates as your code changes.",
    "note": "Run /graph in Claude Code, then archgraph serve to open the viewer at localhost:4321.",
    "repo": "https://github.com/pablomanjarres/archgraph",
    "live": "https://archgraph.vercel.app",
    "oss": true
  },
  {
    "slug": "lumen-frontier",
    "title": "Lumen Frontier",
    "kicker": "LUMEN FRONTIER · OPEN SOURCE",
    "titleLead": "Fly through a",
    "titleMain": "galaxy of subjects.",
    "subtitle": "Lumen Frontier is the front-end of the Lumen learning project. It gives you two interfaces over the same study material: LumenOS, a drag-and-drop dashboard of study widgets, and Lumenverse, a Three.js space where each subject is a planet you fly to as a tethered astronaut.",
    "note": "npm install, then npm run dev:frontend on localhost:3000. Astro 4 static output, React 18 islands, and Three.js r180, with no secrets needed to run it.",
    "repo": "https://github.com/pablomanjarres/Lumen-Frontier",
    "live": "https://lumen-frontier.vercel.app",
    "oss": true
  },
  {
    "slug": "localhost-mirror",
    "title": "Localhost Mirror",
    "kicker": "LOCALHOST MIRROR · OPEN SOURCE",
    "titleLead": "Tailnet-only",
    "titleMain": "localhost tunnels.",
    "subtitle": "Expose a local port to your phone, tablet, or another Mac over Tailscale, and never to the public internet. Every request is checked against your tailnet range before it reaches the port.",
    "note": "Run `lm expose 3000`, or click a port in the macOS menu-bar app; needs Node 18+ and Tailscale, no account, no public URL.",
    "repo": "https://github.com/pablomanjarres/localhost-mirror",
    "live": null,
    "oss": true
  },
  {
    "slug": "grit-x-awa",
    "title": "GRIT-X-AWA",
    "kicker": "GRIT-X-AWA · OPEN SOURCE",
    "titleLead": "Classify exoplanets",
    "titleMain": "from Kepler and TESS.",
    "subtitle": "GRIT-X-AWA is a web observatory for exoplanet classification: upload a Kepler or TESS CSV, or enter a candidate by hand, and a three-model gradient-boosting ensemble returns a labeled disposition with per-class confidence. A three.js starfield, a paginated data browser, 3D orbital views, and an in-app chatbot wrap the model, and the whole thing runs keyless in demo mode with canned predictions and bundled sample data.",
    "note": "Run `cd frontend && npm install && npm run dev` for the keyless demo at localhost:4321; set `PUBLIC_DEMO=false` with a live FastAPI backend to hit the real ensemble.",
    "repo": "https://github.com/pablomanjarres/NASA-Space-Apps-Challenge",
    "live": "https://grit-x-awa-kappa.vercel.app",
    "oss": true
  },
  {
    "slug": "study-hub",
    "title": "Study Hub",
    "kicker": "STUDY HUB · OPEN SOURCE",
    "titleLead": "Three courses,",
    "titleMain": "step by step.",
    "subtitle": "Study Hub is a study platform for three university CS courses (formal languages, data structures, and database systems) with problems, three-depth solutions, explanations, and handwritten notes pre-authored as MDX. The theory that actually moves is interactive: DFA, NFA, PDA, and Turing-machine graphs you step through one symbol at a time, parse tables, grammar transforms, and sorting and schema visualizers, all offline and key-free.",
    "note": "Run `pnpm install && pnpm dev` on port 5847, or `claude mcp add study-hub -- node mcp/dist/index.js` to give Claude the 16-tool content server.",
    "repo": "https://github.com/pablomanjarres/study-hub",
    "live": "https://study-hub-three-orpin.vercel.app",
    "oss": true
  },
  {
    "slug": "valhalla",
    "title": "Valhalla",
    "kicker": "VALHALLA · OPEN SOURCE",
    "titleLead": "Your whole machine,",
    "titleMain": "one command.",
    "subtitle": "Valhalla is a live terminal command center over a whole personal-AI stack: Claude accounts, a Lima VM of agents, about two dozen launchd daemons, MCP servers, and skills, all on one board. Each of the eight surfaces shells out to the tool that already owns the truth, so nothing is reimplemented and no secret is stored. Bare valhalla opens an Ink dashboard, a verb runs an action, and status --json hands the fleet to another script.",
    "note": "Clone it, then `pnpm install && pnpm build`, and run `valhalla` for the live dashboard or `valhalla status --json` to script it.",
    "repo": "https://github.com/pablomanjarres/valhalla",
    "live": null,
    "oss": true
  },
  {
    "slug": "redline",
    "title": "Redline",
    "kicker": "REDLINE · OPEN SOURCE",
    "titleLead": "Break your own analysis",
    "titleMain": "before Reviewer 2 does.",
    "subtitle": "Redline is a statistical-rigor auditor for single-cell RNA-seq. It re-runs the load-bearing statistics on your own AnnData .h5ad, marks the false discoveries on your own figures, and hands back corrected code that downloads and runs, all before the analysis becomes a paper.",
    "note": "Point it at your own `.h5ad`: `pnpm i && pnpm dev` opens the plots-first workbench, or add the rigor engine to Claude as a skill and let it re-run the stats.",
    "repo": "https://github.com/pablomanjarres/redline",
    "live": "https://redline-sooty-zeta.vercel.app",
    "oss": true
  },
  {
    "slug": "lumen",
    "title": "Lumen Tutor",
    "kicker": "LUMEN TUTOR · OPEN SOURCE",
    "titleLead": "Explanations that",
    "titleMain": "draw themselves.",
    "subtitle": "Lumen is an AI tutor that teaches by drawing. Ask it a calculus question and it synthesizes structured canvas commands, then strokes the answer onto a live Excalidraw whiteboard: axes, the curve, a sweeping tangent, the shaded area beneath it. This is the earlier, full-stack chapter of Lumen, the FastAPI teaching engine that Lumen Frontier later stubbed out.",
    "note": "Run the FastAPI backend with `uvicorn app.main:app --reload`, then the Astro whiteboard with `npm run dev`; it calls GPT-4o through an embedding-similarity cache.",
    "repo": "https://github.com/pablomanjarres/lumen",
    "live": null,
    "oss": true
  },
  {
    "slug": "portpeek",
    "title": "PortPeek",
    "kicker": "PORTPEEK · OPEN SOURCE",
    "titleLead": "See what's squatting",
    "titleMain": "on your localhost ports.",
    "subtitle": "PortPeek is a native macOS menu-bar app that shows every TCP port listening on your machine. It rescans with lsof every three seconds, labels each port by probing its HTTP title, colors it by process, and lets you open, copy, or kill whatever is squatting there, all without leaving the menu bar.",
    "note": "Build it yourself with `./scripts/build.sh && ./scripts/install.sh`; PortPeek runs on macOS 13 and up and installs as a menu-bar-only app with no Dock icon.",
    "repo": "https://github.com/pablomanjarres/PortPeek",
    "live": null,
    "oss": true
  }
];

export function getHero(slug: string) {
  return heroes.find((h) => h.slug === slug);
}
