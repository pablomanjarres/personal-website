import type { ProjectStudy } from "./data";

type Note = { title: string; body: string };
export type CaseStudy = {
  headline: string;
  introduction: string;
  challenge: string;
  responsibility: string;
  outcome: string;
  platform: string;
  decisions: readonly Note[];
  flow: readonly Note[];
  measures: readonly { value: string; label: string }[];
  components: readonly { name: string; body: string }[];
};

// Editorial context for mockup case studies. Status, dates, stack and links
// remain owned by the project registry; media stays in anki-media and data.
const selectedStories: Record<string, CaseStudy> = {
  anki: {
    headline: "A study habit that fits in your pocket.",
    introduction: "Anki turns the lectures and book pages I’ve reached into a small daily review. Every card keeps its source, so I can return to the passage when an answer needs more context.",
    challenge: "Course files arrive before the class reaches them. Books contain hundreds of unread pages. Generating cards from the whole file would fill the deck with material I haven’t learned yet. The app needed to respect my place in each course and book.",
    responsibility: "I designed the mobile interface and built the review scheduler, local study store, Cortex connection, and tools that prepare new cards. I also built the monitor that catches a missed morning run.",
    outcome: "A working mobile PWA with source-linked cards, a daily queue, reading checkpoints, and review history. It runs privately from my Mac and keeps the study database in SQLite.",
    platform: "Mobile PWA",
    decisions: [
      { title: "Start from what’s been reached", body: "Class dates and reading checkpoints decide which passages are eligible. A generated card must include quoted evidence and a supported answer before it enters the deck." },
      { title: "Give the day a finish line", body: "Due cards come first. The queue caps distinct reviews at 30 per day, while cards that need another attempt can still return within the same session." },
      { title: "Make the review work with one thumb", body: "Reveal the answer with a swipe, choose one of five grades, and undo a grade when needed. The interface respects reduced motion and keeps the source alongside the card." },
    ],
    flow: [
      { title: "Reading context", body: "Cortex supplies class dates, course material, and book checkpoints." },
      { title: "Cited cards", body: "The generation tools submit questions with evidence and an answer for validation." },
      { title: "Daily review", body: "SQLite holds the cards and FSRS schedules when they return to the phone." },
    ],
    measures: [{ value: "30", label: "distinct reviews per day" }, { value: "5", label: "review grades" }, { value: "14", label: "MCP tools" }],
    components: [
      { name: "Pocket PWA", body: "Review, books, decks, and statistics in a phone interface with an offline app shell." },
      { name: "Study store", body: "Cards, reading progress, FSRS schedules, history, and daily run records in SQLite." },
      { name: "Cortex reader", body: "Read-only access to the course timeline and reached book passages." },
      { name: "Daily monitor", body: "Checks for a missed or failed morning generation run." },
    ],
  },
  construcredit: {
    headline: "From a credit application to the last payment.",
    introduction: "ConstruCredit lends to families building their homes in Colombia. I build the software behind the public application site and the internal tools staff use to manage credit, clients, and payments.",
    challenge: "The public application and the staff’s credit records need to agree. A balance also depends on rounding rules, payment dates, and Colombian holidays. Those rules have to stay consistent across the site, the panel, and scheduled jobs.",
    responsibility: "As the sole developer, I built the public site, staff panel, API, background worker, and shared financial rules. The work includes access control, database changes, testing, and deployment.",
    outcome: "A live platform covering applications, clients, payments, reports, notifications, and audit records. The public site runs on Vercel; the API and background work run on Google Cloud.",
    platform: "Web platform",
    decisions: [
      { title: "Keep money and dates in one place", body: "Shared domain packages own exact peso arithmetic, amortization, and the Colombian business calendar. Screens and jobs use those rules rather than calculating balances separately." },
      { title: "Give each role the right view", body: "The staff panel filters access by role. Administrator access requires two-factor login, and provisional passwords must be changed on first use with server-side enforcement." },
      { title: "Make financial changes traceable", body: "The platform keeps audit records and versions database changes. Tests for financial rules and a separate integration database protect the parts that alter credit and payment records." },
    ],
    flow: [
      { title: "Apply", body: "A family reads the credit lines and sends an application through the public site." },
      { title: "Manage credit", body: "Authorized staff work with applications, clients, and credit records in the panel." },
      { title: "Record and follow up", body: "Payment records, reports, audit history, and scheduled notifications support the account." },
    ],
    measures: [{ value: "4", label: "applications in the platform" }, { value: "3", label: "shared financial rule packages" }, { value: "2FA", label: "required for administrator access" }],
    components: [
      { name: "Public site", body: "Credit information and the application flow for families." },
      { name: "Staff panel", body: "Applications, clients, payments, reports, and audit views with role-based access." },
      { name: "API", body: "The authenticated HTTP layer over credit, payment, client, and user records." },
      { name: "Background worker", body: "Scheduled tasks and WhatsApp notifications." },
    ],
  },
  cortex: {
    headline: "One private place for the moving parts of a day.",
    introduction: "Cortex brings coursework, habits, focus sessions, contacts, calendar, and money into a desktop app. I built it for my own daily work, with a local API that lets agents use the same records.",
    challenge: "My courses, planning, finances, and contacts lived in separate tools. I wanted to see them together and let agents help with the work while keeping the underlying records private and stored locally.",
    responsibility: "I designed and built the macOS app, encrypted storage, local API, MCP server, and background integrations. The same dashboard can also open on my phone through a private Tailscale connection.",
    outcome: "A shipped macOS app with encrypted local records and agent access through MCP. It also brings opportunity research and cloud billing history into the dashboard.",
    platform: "macOS app",
    decisions: [
      { title: "Keep the records local and encrypted", body: "Data files use AES-256-GCM encryption. Electron safeStorage protects the master key through macOS Keychain, and the app migrates older plaintext records into encrypted storage." },
      { title: "Let the app and agents use the same API", body: "The MCP server forwards study, habit, calendar, contact, and finance actions to the local API. Agents work with the same records the interface presents." },
      { title: "Run background work outside the window", body: "Opportunity collection and monitoring run independently of Electron. Cloud billing data is collected into a local ledger with source health, credits, and budgets visible together." },
    ],
    flow: [
      { title: "Desktop and phone", body: "The React interface runs in Electron and through the private web server." },
      { title: "Local API and MCP", body: "The interface and agents read and update the same application records." },
      { title: "Encrypted storage", body: "Authenticated encryption protects data files; macOS Keychain protects the key." },
    ],
    measures: [{ value: "256-bit", label: "authenticated encryption" }, { value: "13 months", label: "of cloud cost history" }, { value: "2", label: "MCP transports" }],
    components: [
      { name: "Desktop app", body: "Daily planning, coursework, finances, contacts, and focus sessions." },
      { name: "Local server", body: "The private API and phone dashboard, available over Tailscale." },
      { name: "MCP server", body: "Study and planning actions over stdio or HTTP." },
      { name: "Background integrations", body: "Opportunity collection, billing data, and source health checks." },
    ],
  },
};

function plain(text: string) {
  return text.replace(/[*`]/g, "").replace(/[—–]/g, ", ").replace(/\bserves as\b/g, "is").replace(/\s+/g, " ").trim();
}

export function getReleaseHeading(study: ProjectStudy) {
  return ["live", "shipped"].includes(study.project.status) ? "What shipped." : "Current build.";
}

export function getCaseStudy(study: ProjectStudy): CaseStudy {
  const curated = selectedStories[study.project.slug];
  if (curated) return curated;
  const project = study.project;
  const components = (project.subProjects ?? []).map(part => ({ name: plain(part.name), body: plain(part.oneLiner) }));
  const decisions = project.highlights.slice(0, 3).map(highlight => {
    const text = plain(highlight);
    const split = text.indexOf(". ");
    return split > 0 && split < 100 ? { title: text.slice(0, split), body: text.slice(split + 2) } : { title: "Implementation choice", body: text };
  });
  return {
    headline: plain(project.oneLiner), introduction: plain(project.summary.split("\n\n")[0]),
    challenge: plain(project.problem), responsibility: plain(project.role),
    outcome: components.length ? `The work includes ${components.slice(0, 3).map(part => part.name).join(", ")}.` : plain(project.summary.split("\n\n").at(-1) ?? project.oneLiner),
    platform: project.previewKind === "app" ? "Desktop app" : project.previewKind === "web" ? "Web app" : "Software project",
    decisions, flow: [], components,
    measures: (project.metrics ?? []).slice(0, 3).map(metric => {
      const text = plain(metric);
      const quantitative = text.match(/^([<>~+]?\d[\d,.]*(?:\+|%|-bit)?)\s+(.+)$/);
      return quantitative ? { value: quantitative[1], label: quantitative[2] } : { value: "", label: text };
    }),
  };
}
