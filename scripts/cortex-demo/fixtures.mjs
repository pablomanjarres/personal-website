export const FIXTURE_SCHEMA_VERSION = 3;

export function createDemoFixtures(now = new Date()) {
  const day = value => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  const offset = count => { const value = new Date(now); value.setDate(value.getDate() + count); return day(value); };
  const date = day(now), year = now.getFullYear(), timestamp = `${date}T09:00:00.000Z`;
  const months = amount => Array(12).fill(amount);
  const courses = [
    { id: "architecture", name: "Software architecture", difficulty: "Medium", iconKey: "Network", semester: "Sample semester", status: "Normal", credits: 3 },
    { id: "algorithms", name: "Algorithms", difficulty: "Hard", iconKey: "Code", semester: "Sample semester", status: "Under Control", credits: 4 },
  ];
  const projects = [{ name: "sample-studio", path: "Sample projects/studio", description: "A fictional planning app", type: "app", hasPackageJson: true,
    hasClaude: false, gitRemote: null, latestCommit: { message: "Add weekly planning", date: timestamp }, workflows: [], techStack: ["React", "TypeScript"], scripts: ["build", "test"], connections: [] }];
  const history = Array.from({ length: 14 }, (_, index) => ({ date: offset(index - 13), commits: index % 4 + 1, users: 80 + index * 3,
    deploys: index % 2, mrr: 240 + index * 5, prsOpen: 2, prsMerged: 1 }));
  const cache = data => ({ data, fetchedAt: timestamp, lastUpdated: timestamp, ok: true });
  const sources = Object.fromEntries(["aws", "gcp"].map(provider => [provider, { configured: false, ok: false, sourceId: null, fetchedAt: null, attemptedAt: null, error: null }]));
  const records = {
    "cortex-habits": [{ id: "read", name: "Read 30 minutes", emoji: "📖" }, { id: "walk", name: "Take a walk", emoji: "🌿" }, { id: "plan", name: "Plan tomorrow", emoji: "✍️" }],
    "cortex-habits-history": Object.fromEntries(Array.from({ length: 7 }, (_, index) => [offset(-index), { read: true, walk: index % 2 === 0, plan: index > 0 }])),
    "cortex-habits-grid": {},
    "cortex-student-semesters": ["Sample semester"], "cortex-student-active-semester": "Sample semester", "cortex-student-courses": courses,
    "cortex-student-topics": [{ id: "context", name: "Context diagrams", courseId: "architecture", chapter: "System boundaries", types: ["Theory"], mastery: 60, status: "Practiced", priority: "Medium", week: 1 }],
    "cortex-student-assignments": [{ id: "diagram", courseId: "architecture", name: "Draw a context diagram", deadline: offset(2), done: false, type: "Project", weight: 0.15, priority: "Medium" },
      { id: "graph", courseId: "algorithms", name: "Compare graph traversals", deadline: offset(4), done: false, type: "Lab", weight: 0.1, priority: "High" }],
    "cortex-class-materials": [{ id: "material", courseId: "architecture", kind: "text", name: "System boundary notes", unit: "Unit 1", tags: ["architecture"],
      text: "Start with the people and systems around the product. Mark the boundary before adding components.", addedAt: timestamp, source: "app" }],
    "cortex-study-notes": [{ id: "note", courseId: "architecture", courseName: "Software architecture", text: "A context diagram describes who uses the system and what it connects to.", tags: ["revision"], pinned: true, source: "manual", createdAt: timestamp }],
    "cortex-classes": [],
    "cortex-finances": { year, items: [
      { id: "income", name: "Sample consulting", type: "Income", months: months(3200000), receivedAmounts: months(2900000) },
      { id: "workspace", name: "Workspace", type: "Expense", category: "Home", months: months(700000), paidAmounts: months(500000), paid: months(false) },
      { id: "food", name: "Groceries", type: "Expense", category: "Food", months: months(450000), paidAmounts: months(300000), paid: months(false) },
      { id: "hosting", name: "Sample hosting", type: "Subscription", category: "Infrastructure", months: months(65000), paid: months(true) },
    ], oneTimePayments: [{ id: "course", name: "Design workshop", amount: 120000, date: offset(-1), category: "Education", paid: true }] },
    "cortex-finance-hide-income": false,
    "cortex-goals": [{ id: "ship", title: "Finish a small planning app", area: "Build", period: String(year), targetDate: offset(21), status: "active", createdAt: timestamp,
      milestones: [{ id: "prototype", title: "Test the prototype", done: true }, { id: "release", title: "Prepare the release", done: false }] }],
    "cortex-books": [{ id: "book", title: "The sample systems notebook", author: "Jordan Lee", status: "En curso", score: "", genre: "Programming", start: offset(-7), finished: "", notes: "Fictional reading record." }],
    "cortex-thoughts": [{ id: "thought", name: "Keep the first version small", subline: "A clear boundary makes the next step easier.", topic: "Programming", book: "", highValue: true }],
    "cortex-contacts": [], "cortex-crm": { orgs: [{ id: "studio", name: "Sample studio", contacts: [] }], activeOrg: "studio" },
    "cortex-captures": [], "cortex-courses": [], "cortex-opportunities": { items: [], lastRun: null },
    "cortex-founder-history": history,
    "cortex-cache-github": cache({ commitsToday: 3, commitsWeek: 18, prsOpen: 2, prsMergedWeek: 4, repoCount: 5, followers: 28, streak: 6, commitTimeline: history.map(row => ({ date: row.date, commits: row.commits })) }),
    "cortex-cache-lemon": cache({ mrr: 300, totalCustomers: 24, newThisMonth: 4, churnedThisMonth: 1, revenueThisMonth: 360 }),
    "cortex-cache-vercel": cache({ deploymentsToday: 1, deploymentsWeek: 5, latestDeployment: null, pageviews: 1200, visitors: 450 }),
    "cortex-cache-supabase": cache({ totalUsers: 120, signupsToday: 3, signupsWeek: 14, signupTimeline: history.map(row => ({ date: row.date, users: row.users })) }),
    "cortex-cache-projects": cache(projects), "cortex-project-meta": { "sample-studio": { displayName: "Sample studio", tagline: "Weekly plans in one place", description: "A fictional project for exploring the workspace.", status: "active", runsOnLogin: false, alwaysActive: false, why: "Keep weekly priorities clear.", notes: "", priority: 1 } },
    "cortex-project-time": { projects: [{ id: "studio", name: "Sample studio", ratePerHour: 120000, currency: "COP" }], active: null, reports: [], sessions: [
      { id: "work", projectId: "studio", startedAt: `${date}T08:00:00.000Z`, endedAt: `${date}T08:45:00.000Z`, description: "Add weekly planning", billable: true, prUrl: null, durationMs: 2700000, needsReview: false, corrections: [] } ] },
    "cortex-cloud-cost-settings": { awsProfile: "", gcpBillingTable: "", gcpQueryProject: "", monthlyBudgetUsd: 45 },
    "cortex-cloud-costs": { version: 2, periodStart: offset(-30), periodEnd: date, fetchedAt: timestamp, accountAdjustments: [], sources,
      usageItems: Array.from({ length: 14 }, (_, index) => ({ date: offset(index - 13), provider: index % 2 ? "aws" : "gcp", account: "Sample account", project: "Sample studio", service: index % 2 ? "Compute" : "Cloud Run", resource: "Sample service", amountUsd: 0.4 + index * 0.03 })) },
    "cortex-automations": { runs: [{ id: "sample-check", taskName: "sample-backup", timestamp, status: "success", summary: "Sample backup completed.", fullOutput: "Fictional run history. No system task was executed." }] },
    "cortex-gym-plans": [], "cortex-gym-active": null, "cortex-body-stats": [], "cortex-nutrition-targets": { protein: 100, calories: 2000, water: 2 },
    "cortex-meal-templates": [], "cortex-hard-bans": [], "cortex-ban-violations": [], "cortex-market-presets": [], "cortex-quick-foods": [], "cortex-nutrition-pantry": [],
    "cortex-market-budget": 400000, "cortex-market-list": null,
    [`cortex-nutrition-${date}`]: { date, meals: [], waterLiters: 1 }, [`cortex-gym-session-${date}`]: [],
  };
  for (let index = 0; index < 7; index++) {
    const sessionDate = offset(-index);
    records[`cortex-daily-sessions-${sessionDate}`] = [{ id: `focus-${index}`, task: "Review software architecture", duration: 45,
      startedAt: `${sessionDate}T08:00:00.000Z`, completedAt: `${sessionDate}T08:45:00.000Z` }];
  }
  return { records, projects, calendar: [{ id: "walk", title: "Afternoon walk", startDate: `${date}T17:00:00`, endDate: `${date}T17:30:00`, calendar: "Sample calendar", isAllDay: false }] };
}
