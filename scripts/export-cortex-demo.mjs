import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FIXTURE_SCHEMA_VERSION } from "./cortex-demo/fixtures.mjs";
import { ROUTES, SOURCE_COMMIT, transformDemoSource } from "./cortex-demo/transform.mjs";

const website = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cortex = resolve(process.argv[2] ?? "../cortex");
const destination = resolve(website, "public/demos/cortex");
const source = realpathSync(mkdtempSync(resolve(tmpdir(), "cortex-public-demo-")));
const hash = value => createHash("sha256").update(value).digest("hex");
const files = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(resolve(directory, entry.name)).map(name => `${entry.name}/${name}`) : [entry.name]);

try {
  const knownCommit = execFileSync("git", ["rev-parse", `${SOURCE_COMMIT}^{commit}`], { cwd: cortex, encoding: "utf8", timeout: 10000 }).trim();
  if (knownCommit !== SOURCE_COMMIT) throw new Error("The pinned Cortex source is unavailable.");
  const archive = execFileSync("git", ["archive", SOURCE_COMMIT], { cwd: cortex, timeout: 10000, maxBuffer: 32 * 1024 * 1024 });
  const unpacked = spawnSync("tar", ["-x", "-C", source], { cwd: website, input: archive, timeout: 10000 });
  if (unpacked.status !== 0) throw new Error("The Cortex source archive could not be extracted.");
  if (!existsSync(resolve(cortex, "node_modules/vite/bin/vite.js"))) throw new Error("Install the Cortex build dependencies before exporting.");
  symlinkSync(resolve(cortex, "node_modules"), resolve(source, "node_modules"), "dir");
  const sourceFiles = files(resolve(source, "src")).filter(file => /\.(?:ts|tsx)$/.test(file));
  const sanitized = sourceFiles.flatMap(file => {
    const path = `src/${file}`;
    return transformDemoSource(readFileSync(resolve(source, path), "utf8"), path).sanitized.map(name => `${path}:${name}`);
  });
  const transformUrl = new URL("./cortex-demo/transform.mjs", import.meta.url).href;
  const common = `import { defineConfig } from 'vite';\n`;
  writeFileSync(resolve(source, "vite.demo.config.mts"), common + `import react from '@vitejs/plugin-react';\nimport tailwindcss from '@tailwindcss/vite';\nimport { demoTransformPlugin } from ${JSON.stringify(transformUrl)};\nexport default defineConfig({ root: ${JSON.stringify(source)}, base: './', plugins: [demoTransformPlugin(${JSON.stringify(source)}), react(), tailwindcss()], resolve: { alias: { '@': ${JSON.stringify(resolve(source, "src"))} } }, build: { outDir: 'demo-dist', minify: true, sourcemap: false, reportCompressedSize: false } });\n`);
  const fixtureUrl = new URL("./cortex-demo/fixtures.mjs", import.meta.url).href;
  const adapterUrl = new URL("./cortex-demo/adapter.mjs", import.meta.url).href;
  writeFileSync(resolve(source, "demo-entry.ts"), `import { createDemoFixtures } from ${JSON.stringify(fixtureUrl)};\nimport { installCortexDemo } from ${JSON.stringify(adapterUrl)};\nimport { applyWorkHoursCommand } from './electron/work-hours-model';\ninstallCortexDemo(createDemoFixtures(), applyWorkHoursCommand);\n`);
  writeFileSync(resolve(source, "vite.adapter.config.mts"), common + `export default defineConfig({ root: ${JSON.stringify(source)}, build: { outDir: 'adapter-dist', minify: true, sourcemap: false, reportCompressedSize: false, lib: { entry: 'demo-entry.ts', name: 'CortexDemo', formats: ['iife'], fileName: () => 'demo-data.js' } } });\n`);
  for (const config of ["vite.demo.config.mts", "vite.adapter.config.mts"]) {
    execFileSync(process.execPath, [resolve(source, "node_modules/vite/bin/vite.js"), "build", "--config", config], { cwd: source, stdio: "inherit", timeout: 120000 });
  }
  const output = resolve(source, "demo-dist");
  const assetFiles = files(resolve(output, "assets")).map(name => `assets/${name}`).sort();
  const javascript = assetFiles.filter(name => name.endsWith(".js")).map(name => readFileSync(resolve(output, name), "utf8")).join("\n");
  const forbidden = [/Good (?:morning|afternoon|evening), Pablo/i, /Mac Mini Debt/i, /Corporaciones/, /nella-daily-dev-log/, /Voice memo in Mars/, /1895000|1895e3/, /serviceWorker\.register/];
  const failedRule = forbidden.findIndex(pattern => pattern.test(javascript));
  if (failedRule >= 0) throw new Error(`The public Cortex bundle failed privacy rule ${failedRule + 1}.`);
  if (assetFiles.some(name => name.includes("instrument-serif"))) throw new Error("The public Cortex bundle contains retired font assets.");
  let html = readFileSync(resolve(output, "index.html"), "utf8");
  html = html.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; connect-src \'self\'; img-src \'self\' data: blob:; style-src \'self\' \'unsafe-inline\'; font-src \'self\'; base-uri \'self\'; form-action \'none\'" />');
  html = html.replace(/(<script type="module")/, '<script src="./demo-data.js"></script>\n    $1');
  // The full asset set comes from this build; obsolete hashed outputs are removed.
  rmSync(resolve(destination, "assets"), { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  cpSync(resolve(output, "assets"), resolve(destination, "assets"), { recursive: true });
  for (const file of ["brand", "icons", "favicon.svg", "manifest.webmanifest"]) cpSync(resolve(output, file), resolve(destination, file), { recursive: true });
  cpSync(resolve(source, "adapter-dist/demo-data.js"), resolve(destination, "demo-data.js"));
  writeFileSync(resolve(destination, "index.html"), html);
  const assets = [...assetFiles, "demo-data.js", "index.html", "favicon.svg", "manifest.webmanifest", "sw.js", ...files(resolve(destination, "brand")).map(name => `brand/${name}`), ...files(resolve(destination, "icons")).map(name => `icons/${name}`)].sort();
  const tools = Object.fromEntries(["vite", "@vitejs/plugin-react", "@tailwindcss/vite", "typescript"].map(name => [name, JSON.parse(readFileSync(resolve(cortex, "node_modules", name, "package.json"), "utf8")).version]));
  const manifest = { sourceCommit: SOURCE_COMMIT, fixtureSchemaVersion: FIXTURE_SCHEMA_VERSION, persistence: "browser-only", serviceWorker: "disabled", routes: ROUTES, buildTools: tools,
    sanitizedInitializers: sanitized, assets, hashes: Object.fromEntries(assets.map(file => [file, hash(readFileSync(resolve(destination, file)))])) };
  writeFileSync(resolve(destination, "export.json"), JSON.stringify(manifest) + "\n");
  console.log(`Cortex ${SOURCE_COMMIT.slice(0, 7)}: ${assetFiles.length} assets, ${sanitized.length} sanitized initializers, privacy audit passed.`);
} finally {
  rmSync(source, { recursive: true, force: true });
}
