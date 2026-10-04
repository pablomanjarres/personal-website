import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import vm from "node:vm";

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

test("Cortex export records pinned source and every shipped asset", () => {
  assert.ok(existsSync(resolve(demo, "export.json")), "Pinned export manifest is missing");
  const manifest = JSON.parse(text("export.json"));
  assert.equal(manifest.sourceCommit, "d5e50e0165ed70ec95fb62c0625c474087974935");
  assert.equal(manifest.fixtureSchemaVersion, 3);
  assert.deepEqual(assets(".js").sort(), manifest.assets.filter(name => name.endsWith(".js")).map(name => name.slice(7)).sort());
  assert.ok(manifest.routes.includes("/cloud-costs") && manifest.routes.includes("/automations"));
  assert.equal(manifest.persistence, "browser-only");
  assert.equal(manifest.serviceWorker, "disabled");
  assert.ok(!bundle().includes("serviceWorker.register"), "Upstream worker can replace the isolated demo worker");
  assert.ok(!readdirSync(resolve(demo, "assets")).some(name => name.includes("instrument-serif")), "Retired font assets remain");
});

function runtime() {
  const saved = new Map();
  const forwarded = [];
  const window = { fetch: async (...args) => { forwarded.push(args); return new Response("asset"); } };
  const context = { window, location: new URL("https://example.com/demos/cortex/"), Response, Request, URL, Date,
    structuredClone, localStorage: { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) },
    console, setTimeout, clearTimeout };
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
