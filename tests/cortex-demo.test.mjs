import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { transformDemoSource } from "../scripts/cortex-demo/transform.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const demo = resolve(root, "public/demos/cortex");
const text = path => readFileSync(resolve(demo, path), "utf8");
const assets = extension => readdirSync(resolve(demo, "assets")).filter(name => name.endsWith(extension));
const bundle = () => assets(".js").map(name => text(`assets/${name}`)).join("\n");

test("Cortex export uses the current graphite and teal app", () => {
  const html = text("index.html");
  const css = assets(".css").map(name => text(`assets/${name}`)).join("\n");
  for (const color of ["#181c1b", "#232a27", "#85c7b4", "#263f37", "#343c2c"]) {
    assert.ok(css.toLowerCase().includes(color), `Current Cortex token ${color} is missing`);
  }
  assert.match(html, /name="theme-color" content="#181C1B"/);
  const js = bundle();
  for (const value of ["/calendar", "/cloud-costs", "/automations", "Project time", "Infrastructure ledger", "Materials"]) {
    assert.ok(js.includes(value), `Current Cortex feature ${value} is missing`);
  }
  for (const value of ["#B7A6FF", "#624AB5", "Good morning, Pablo", "Mac Mini Debt", "Voice memo in Mars", "nella-daily-dev-log"]) {
    assert.ok(!js.toLowerCase().includes(value.toLowerCase()), `Private or obsolete fallback remains: ${value}`);
  }
});

test("Public Cortex hints describe saved content without private workflow instructions", () => {
  const js = bundle();
  for (const value of ["Notes you or Claude save land here.", "Add a grocery bill via Claude and items land here.",
    "Ask Claude to build one from your previous buys.", "Say “save that” to Claude mid-session and it lands here."]) {
    assert.ok(!js.includes(value), `Private workflow hint remains: ${value}`);
  }
  for (const value of ["Saved notes for this course appear here.", "Saved grocery items appear here.", "Saved shopping lists appear here.",
    "Save your study notes to keep them here."]) assert.ok(js.includes(value), `Product hint is missing: ${value}`);
});

test("Cortex export records pinned source and every shipped asset", () => {
  assert.ok(existsSync(resolve(demo, "export.json")), "Pinned export manifest is missing");
  const manifest = JSON.parse(text("export.json"));
  assert.equal(manifest.sourceCommit, "d5e50e0165ed70ec95fb62c0625c474087974935");
  assert.equal(manifest.fixtureSchemaVersion, 3);
  assert.deepEqual(assets(".js").sort(), manifest.assets.filter(name => name.startsWith("assets/") && name.endsWith(".js")).map(name => name.slice(7)).sort());
  assert.ok(manifest.routes.includes("/cloud-costs") && manifest.routes.includes("/automations"));
  assert.equal(manifest.persistence, "browser-only");
  assert.equal(manifest.serviceWorker, "disabled");
  assert.ok(!bundle().includes("serviceWorker.register"), "Upstream worker can replace the isolated demo worker");
  assert.ok(!readdirSync(resolve(demo, "assets")).some(name => name.includes("instrument-serif")), "Retired font assets remain");
  for (const [file, expected] of Object.entries(manifest.hashes)) {
    assert.equal(createHash("sha256").update(readFileSync(resolve(demo, file))).digest("hex"), expected, `${file} is not the audited export`);
  }
});

test("The compile seam removes private initializer data and fails if its owner changes", () => {
  const file = "src/features/finance/FinancePage.tsx";
  const source = 'const DEFAULT_DATA: FinanceData = { items: [{ name: "private-canary", months: [987654321] }] };\nexport function FinancePage() { return DEFAULT_DATA; }';
  const result = transformDemoSource(source, file);
  assert.ok(!result.code.includes("private-canary") && !result.code.includes("987654321"));
  assert.ok(result.code.includes("export function FinancePage() { return DEFAULT_DATA; }"), "The original app component was replaced");
  assert.throws(() => transformDemoSource(source.replace("DEFAULT_DATA:", "OTHER_DATA:"), file), /Missing demo initializer/);
});

test("Request objects retain local write methods and stale revisions cannot overwrite data", async () => {
  const app = runtime();
  const path = "https://example.com/api/data";
  const post = value => app.fetch(new Request(path, { method: "POST", body: JSON.stringify(value) }));
  assert.equal((await post({ key: "cortex-test", data: { count: 1 } })).status, 200);
  const conflict = await post({ key: "cortex-test", data: { count: 2 }, baseRev: "wrong" });
  assert.equal(conflict.status, 409);
  assert.deepEqual((await conflict.json()).data, { count: 1 });
  assert.equal(app.forwarded.length, 0);
});

function runtime(extra = {}) {
  const saved = new Map();
  const forwarded = [];
  const window = { fetch: async (...args) => { forwarded.push(args); return new Response("asset"); } };
  const context = { window, location: new URL("https://example.com/demos/cortex/"), Response, Request, URL, Date,
    structuredClone, localStorage: { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) },
    console, setTimeout, clearTimeout, ...extra };
  vm.runInNewContext(text("demo-data.js"), context, { timeout: 1000 });
  return { fetch: window.fetch, forwarded, saved };
}

test("The browser demo contains complete isolated records and blocks service writes", async () => {
  const app = runtime();
  for (const key of ["cortex-finances", "cortex-student-semesters", "cortex-student-active-semester", "cortex-student-courses",
    "cortex-student-topics", "cortex-student-assignments", "cortex-cloud-costs", "cortex-project-time", "cortex-automations"]) {
    const response = await app.fetch(`/api/data?key=${key}`);
    assert.notEqual(await response.json(), null, `${key} falls back to upstream private defaults`);
  }
  for (const path of ["http://127.0.0.1:3456/api/data", "https://private.example/api/data", "/api/calendar/create", "/api/automation/run/approve", "/api/keychain"]) {
    const response = await app.fetch(path, { method: "POST", body: "{}" });
    assert.equal(response.status, 503, `${path} did not report that the service is unavailable`);
  }
  assert.equal(app.forwarded.length, 0, "An API request reached the network");
  await app.fetch("./assets/app.js");
  assert.equal(app.forwarded.length, 1, "Static app assets were blocked");
});

test("Returning browsers retire only the Cortex demo worker and caches", async () => {
  const unregistered = [], deleted = [];
  const scopes = ["https://example.com/demos/cortex/", "https://example.com/", "https://example.com/demos/another/"];
  runtime({ navigator: { serviceWorker: { getRegistrations: async () => scopes.map(scope => ({ scope, unregister: async () => unregistered.push(scope) })) } },
    caches: { keys: async () => ["site-cache", "cortex-demo-brand-v3"], delete: async key => deleted.push(key) } });
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(unregistered, [scopes[0]]);
  assert.deepEqual(deleted, ["cortex-demo-brand-v3"]);
});

test("The worker upgrade refreshes stale demo documents without moving other pages", async () => {
  const events = {}, navigated = [], deleted = [];
  const urls = ["https://example.com/demos/cortex/#/daily", "https://example.com/portfolio"];
  const self = { location: new URL(urls[0]), addEventListener: (type, handler) => events[type] = handler,
    clients: { claim: async () => {}, matchAll: async () => urls.map(url => ({ url, navigate: async () => navigated.push(url) })) } };
  vm.runInNewContext(text("sw.js"), { self, URL, Promise, Response,
    caches: { keys: async () => ["site-cache", "cortex-demo-brand-v3"], delete: async key => deleted.push(key) } });
  let completed;
  events.activate({ waitUntil: value => completed = value });
  await completed;
  assert.deepEqual(navigated, [urls[0]], "A returning browser keeps the obsolete demo document");
  assert.deepEqual(deleted, ["cortex-demo-brand-v3"]);
});

test("Project time commands use the actual ledger and persist only in demo storage", async () => {
  const app = runtime();
  const command = async body => {
    const response = await app.fetch("/api/work-hours/command", { method: "POST", body: JSON.stringify(body) });
    assert.equal(response.status, 200);
    return response.json();
  };
  await command({ type: "add-project", id: "test-work", name: "Sample work" });
  const started = await command({ type: "start", id: "test-session", projectId: "test-work" });
  assert.equal(started.state.active.projectId, "test-work");
  const stopped = await command({ type: "stop" });
  assert.equal(stopped.state.active, null);
  assert.ok(stopped.state.sessions.some(session => session.id === "test-session"));
  assert.deepEqual([...app.saved.keys()], ["cortex-public-demo-v3"]);
  assert.equal(app.forwarded.length, 0);
});

test("Opportunity scanning reports an unavailable service instead of a queued background job", async () => {
  const app = runtime();
  const response = await app.fetch("/api/data", { method: "POST", body: JSON.stringify({ key: "cortex-opportunities", data: { items: [], runStatus: "requested" } }) });
  const result = await response.json();
  assert.equal(result.data?.runStatus, "error");
  assert.match(result.data.runError, /unavailable in the browser demo/);
  assert.equal(app.forwarded.length, 0);
});
