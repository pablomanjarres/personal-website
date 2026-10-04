import ts from "typescript";

export const SOURCE_COMMIT = "d5e50e0165ed70ec95fb62c0625c474087974935";
export const ROUTES = ["/daily", "/calendar", "/habits", "/goals", "/founder", "/projects", "/opportunities", "/cloud-costs", "/student", "/library", "/books", "/finance", "/gym", "/social", "/system", "/automations", "/settings"];
const replacements = {
  "src/features/finance/FinancePage.tsx": { DEFAULT_DATA: '{ year: new Date().getFullYear(), items: [] }' },
  "src/features/student/student-defaults.ts": { DEFAULT_SEMESTERS: '["Sample semester"]', DEFAULT_COURSES: "[]", DEFAULT_TOPICS: "[]", DEFAULT_ASSIGNMENTS: "[]" },
  "src/features/books/BooksPage.tsx": { DEFAULT_BOOKS: "[]" },
  "src/features/thoughts/ThoughtsPage.tsx": { DEFAULT_THOUGHTS: "[]" },
  "src/features/daily/DailyPage.tsx": { defaultHabits: "[]" },
  "src/features/habits/HabitsPage.tsx": { defaultHabits: "[]" },
  "src/lib/use-calendar-sync.ts": { FALLBACK_COURSES: "[]" },
  "src/features/automations/AutomationsPage.tsx": { STATIC_TASKS: '[{ name: "sample-backup", description: "Fictional backup task. System controls are unavailable in this demo.", frequency: "Daily", group: "System", type: "launchd", host: "mac-mini" }]', CLAUDE_TASK_META: "{}" },
  "src/types/gym.ts": { DEFAULT_NUTRITION_TARGETS: "{protein:100,calories:2000,water:2}", COMMON_FOODS: "[]", DEFAULT_WORKOUT_PLANS: "[]", DEFAULT_HARD_BANS: "[]", DEFAULT_MEAL_TEMPLATES: "[]", DEFAULT_MARKET_PRESETS: "[]" },
  "src/features/student/ClassSchedule.tsx": { DEFAULT_TERM_START: '"2026-01-05"', DEFAULT_TERM_END: '"2026-12-18"' },
};
const literalChanges = {
  "src/features/daily/DailyPage.tsx": { "Good morning, Pablo": "Good morning", "Good afternoon, Pablo": "Good afternoon", "Good evening, Pablo": "Good evening" },
  "src/components/layout/Sidebar.tsx": { "http://localhost:19100/lm": "#/settings" },
  "src/features/cloud-costs/CloudCostsPage.tsx": { "Actual AWS and GCP usage, normalized to USD and kept private on this Mac.": "Fictional AWS and GCP usage for exploring the infrastructure ledger." },
  "src/lib/theme.ts": { "cortex-ui-theme": "cortex-public-demo-theme-v3" },
  "src/features/student/MaterialsTab.tsx": { "Notes you or Claude save land here.": "Saved notes for this course appear here." },
  "src/features/student/NotesTab.tsx": { "Say “save that” to Claude mid-session and it lands here.": "Save your study notes to keep them here." },
  "src/features/gym/components/MarketLog.tsx": { "Ask Claude to build one from your previous buys.": "Saved shopping lists appear here." },
  "src/features/gym/components/NutritionLog.tsx": { "Add a grocery bill via Claude and items land here.": "Saved grocery items appear here." },
};

export function transformDemoSource(code, file) {
  const expected = replacements[file] ?? {};
  const literals = literalChanges[file] ?? {};
  const edits = [], found = new Set(), changed = new Set();
  const tree = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const edit = (node, value) => edits.push({ start: node.getStart(tree), end: node.end, value });
  const walk = node => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && Object.hasOwn(expected, node.name.text)) {
      if (!node.initializer || found.has(node.name.text)) throw new Error(`Unexpected demo initializer: ${file}:${node.name.text}`);
      found.add(node.name.text); edit(node.initializer, expected[node.name.text]); return;
    }
    if (ts.isStringLiteral(node) && Object.hasOwn(literals, node.text)) { changed.add(node.text); edit(node, JSON.stringify(literals[node.text])); }
    if (file === "src/features/gym/components/MarketLog.tsx" && ts.isCallExpression(node) && node.expression.getText(tree) === "useStore" && node.arguments[0]?.text === "cortex-market-budget") {
      changed.add("market-budget"); edit(node.arguments[1], "400000");
    }
    if (file === "src/main.tsx" && ts.isIfStatement(node) && node.expression.getText(tree).includes("serviceWorker")) {
      changed.add("worker-registration"); edit(node, ""); return;
    }
    ts.forEachChild(node, walk);
  };
  walk(tree);
  for (const name of Object.keys(expected)) if (!found.has(name)) throw new Error(`Missing demo initializer: ${file}:${name}`);
  for (const literal of Object.keys(literals)) if (!changed.has(literal)) throw new Error(`Missing demo presentation seam: ${file}`);
  if (file === "src/main.tsx" && !changed.has("worker-registration")) throw new Error("Worker registration seam changed");
  if (file === "src/features/gym/components/MarketLog.tsx" && !changed.has("market-budget")) throw new Error("Market budget seam changed");
  let output = code;
  for (const change of edits.sort((a, b) => b.start - a.start)) output = output.slice(0, change.start) + change.value + output.slice(change.end);
  if (file === "src/components/layout/Sidebar.tsx") output = output.replace(/>\s*Localhost\s*</, ">Local demo<");
  return { code: output, sanitized: [...found] };
}

export function demoTransformPlugin(root) {
  const seen = new Set();
  return { name: "cortex-public-demo", enforce: "pre", transform(code, id) {
    const file = id.replace(root + "/", "").split("?")[0];
    if (!file.startsWith("src/") || !/\.(?:ts|tsx)$/.test(file)) return;
    seen.add(file);
    return transformDemoSource(code, file).code;
  }, buildEnd(error) {
    if (error) return;
    for (const file of [...Object.keys(replacements), ...Object.keys(literalChanges), "src/main.tsx", "src/features/gym/components/MarketLog.tsx"]) {
      if (!seen.has(file)) throw new Error(`A required demo compile seam was not applied: ${file}`);
    }
  } };
}
