import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, process.env.NEXT_OUTPUT_DIR ?? ".next", "server/app");
const heroSource = readFileSync(resolve(root, "app/oss/heroes.ts"), "utf8");
const slugs = [...heroSource.matchAll(/"slug":\s*"([^"]+)"/g)].map(([, slug]) => slug);
const projectSource = readFileSync(resolve(root, "app/projects.ts"), "utf8");
const projectSlugs = [...projectSource.matchAll(/"slug":\s*"([^"]+)"/g)].map(([, slug]) => slug);
const routes = ["/", "/portfolio", "/oss", ...slugs.map(slug => `/oss/${slug}`), ...projectSlugs.map(slug => `/portfolio/projects/${slug}`)];

for (const route of routes) test(`${route} renders the shared personal website mark`, () => {
  const page = route === "/" ? "index" : route.slice(1);
  const html = readFileSync(resolve(output, `${page}.html`), "utf8")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const homeLink = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)]
    .find(([, attributes]) => /\bhref="(?:\/|#main)"/.test(attributes) && /\bclass="[^"]*brand/.test(attributes));
  assert.ok(homeLink, `${route}: missing home link`);
  assert.match(homeLink[1], /aria-label="Pablo Manjarres, home"/);
  assert.equal(homeLink[2].replace(/<[^>]*>/g, "").trim(), "pm.");
  const iconLinks = [...html.matchAll(/<link\b([^>]*)>/g)].map(([, attributes]) => attributes);
  assert.ok(iconLinks.some(attributes => /rel="icon"/.test(attributes) && /href="\/favicon\.ico"/.test(attributes)), `${route}: missing ICO browser fallback`);
  assert.ok(iconLinks.some(attributes => /rel="shortcut icon"/.test(attributes) && /href="\/favicon\.ico\?v=pm-1"/.test(attributes)), `${route}: missing refreshed browser icon URL`);
  assert.ok(iconLinks.some(attributes => /rel="apple-touch-icon"/.test(attributes) && /href="\/apple-icon\.png/.test(attributes)), `${route}: missing Apple touch icon`);
});

test("Browser fallback icons contain the approved personal website mark", () => {
  const svg = readFileSync(resolve(root, "app/icon.svg"), "utf8");
  assert.match(svg, />pm<tspan[^>]*>\.<\/tspan>/);
  assert.doesNotMatch(svg, />P<|#c8542a/i);
  const ico = readFileSync(resolve(root, "app/favicon.ico"));
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 4);
  for (const [index, size] of [16, 32, 48, 64].entries()) {
    const entry = 6 + index * 16;
    assert.equal(ico[entry], size);
    assert.equal(ico[entry + 1], size);
    const image = ico.subarray(ico.readUInt32LE(entry + 12), ico.readUInt32LE(entry + 12) + ico.readUInt32LE(entry + 8));
    assert.equal(image.subarray(1, 4).toString(), "PNG");
    assert.equal(image.readUInt32BE(16), size);
    assert.equal(image.readUInt32BE(20), size);
  }
  const apple = readFileSync(resolve(root, "app/apple-icon.png"));
  assert.equal(apple.subarray(1, 4).toString(), "PNG");
  assert.equal(apple.readUInt32BE(16), 180);
  assert.equal(apple.readUInt32BE(20), 180);
});
