import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const website = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [cortexArg, ankiArg] = process.argv.slice(2);

if (!cortexArg || !ankiArg) {
  console.error("Usage: node scripts/sync-project-brand-assets.mjs <cortex-repo> <anki-repo>");
  process.exit(1);
}

const sources = {
  cortex: resolve(cortexArg),
  anki: resolve(ankiArg),
};

// Cortex and Anki own their geometry. The portfolio commits the rendered copies
// so a website deploy never depends on another checkout being present.
const assets = [
  ["cortex", "public/brand/mark.svg", "public/brand/cortex/cortex-symbol.svg"],
  ["cortex", "public/brand/wordmark.svg", "public/brand/cortex/cortex-wordmark.svg"],
  ["cortex", "public/brand/logo.svg", "public/brand/cortex/cortex-logo.svg"],
  ["cortex", "public/favicon.svg", "public/brand/cortex/cortex-app-icon.svg"],
  ["cortex", "public/brand/mark.svg", "public/demos/cortex/brand/mark.svg"],
  ["cortex", "public/brand/wordmark.svg", "public/demos/cortex/brand/wordmark.svg"],
  ["cortex", "public/favicon.svg", "public/demos/cortex/favicon.svg"],
  ["cortex", "public/icons/icon-192.png", "public/demos/cortex/icons/icon-192.png"],
  ["cortex", "public/icons/icon-512.png", "public/demos/cortex/icons/icon-512.png"],
  ["cortex", "public/icons/icon-maskable-512.png", "public/demos/cortex/icons/icon-maskable-512.png"],
  ["cortex", "public/icons/apple-touch-icon.png", "public/demos/cortex/icons/apple-touch-icon.png"],
  ["anki", "public/brand/anki-symbol.svg", "public/brand/anki/anki-symbol.svg"],
  ["anki", "public/brand/anki-wordmark.svg", "public/brand/anki/anki-wordmark.svg"],
  ["anki", "public/brand/anki-logo.svg", "public/brand/anki/anki-logo.svg"],
  ["anki", "public/brand/anki-app-icon.svg", "public/brand/anki/anki-app-icon.svg"],
];

for (const [project, source] of assets) {
  if (!existsSync(resolve(sources[project], source))) {
    throw new Error(`Missing ${project} brand source: ${source}`);
  }
}

for (const [project, source, destination] of assets) {
  const output = resolve(website, destination);
  mkdirSync(dirname(output), { recursive: true });
  copyFileSync(resolve(sources[project], source), output);
}

console.log(`Synced ${assets.length} brand assets from the Cortex and Anki geometry sources.`);
