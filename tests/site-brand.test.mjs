import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, process.env.NEXT_OUTPUT_DIR ?? ".next", "server/app");
const heroSource = readFileSync(resolve(root, "app/oss/heroes.ts"), "utf8");
const slugs = [...heroSource.matchAll(/"slug":\s*"([^"]+)"/g)].map(([, slug]) => slug);
const routes = ["/", "/portfolio", "/oss", ...slugs.map(slug => `/oss/${slug}`)];

for (const route of routes) test(`${route} renders the shared personal website mark`, () => {
  const page = route === "/" ? "index" : route.slice(1);
  const html = readFileSync(resolve(output, `${page}.html`), "utf8")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const homeLink = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)]
    .find(([, attributes]) => /\bhref="(?:\/|#main)"/.test(attributes) && /\bclass="[^"]*brand/.test(attributes));
  assert.ok(homeLink, `${route}: missing home link`);
  assert.match(homeLink[1], /aria-label="Pablo Manjarres, home"/);
  assert.equal(homeLink[2].replace(/<[^>]*>/g, "").trim(), "pm.");
});
